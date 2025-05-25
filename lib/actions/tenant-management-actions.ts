"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { requirePermission } from "../auth/require-permission"
import { PERMISSIONS } from "../auth/permissions"
import getManagementClient from "../auth0/management-api"
import { v4 as uuidv4 } from "uuid"

// Create a new tenant with Auth0 integration
export async function createTenant(formData: FormData) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const domain = (formData.get("domain") as string) || null
    const subscription_tier = formData.get("subscription_tier") as string
    const status = "active"

    // Validate required fields
    if (!name || !slug || !subscription_tier) {
      throw new Error("Missing required fields")
    }

    // Check if slug is already taken
    const existingTenant = await sql`
      SELECT id FROM tenants WHERE slug = ${slug} AND deleted_at IS NULL
    `

    if (existingTenant.length > 0) {
      throw new Error("Slug is already taken")
    }

    // Create tenant in database
    const id = uuidv4()
    const now = new Date()

    const result = await sql`
      INSERT INTO tenants (
        id, name, slug, domain, subscription_tier, status, created_at, updated_at
      ) VALUES (
        ${id}, ${name}, ${slug}, ${domain}, ${subscription_tier}, ${status}, ${now}, ${now}
      )
      RETURNING id, name, slug, domain, subscription_tier, status, created_at, updated_at
    `

    // Create Auth0 client for the tenant
    const management = getManagementClient()

    // Create a new client in Auth0
    const client = await management.createClient({
      name: `${name} Application`,
      description: `Client for ${name} tenant`,
      app_type: "regular_web",
      callbacks: domain ? [`https://${domain}/api/auth/callback`] : [],
      allowed_logout_urls: domain ? [`https://${domain}`] : [],
      web_origins: domain ? [`https://${domain}`] : [],
      jwt_configuration: {
        alg: "RS256",
      },
    })

    // Update tenant with Auth0 client ID
    await sql`
      UPDATE tenants
      SET auth0_client_id = ${client.client_id}
      WHERE id = ${id}
    `

    revalidatePath("/superadmin/tenants")
    return result[0]
  } catch (error) {
    console.error("Error creating tenant:", error)
    throw new Error("Failed to create tenant")
  }
}

// Get all tenants
export async function getAllTenants() {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const tenants = await sql`
      SELECT id, name, slug, domain, subscription_tier, status, created_at, updated_at, auth0_client_id
      FROM tenants
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `

    return tenants
  } catch (error) {
    console.error("Error fetching tenants:", error)
    throw new Error("Failed to fetch tenants")
  }
}

// Get tenant by ID
export async function getTenantById(id: string) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const result = await sql`
      SELECT id, name, slug, domain, subscription_tier, status, created_at, updated_at, auth0_client_id
      FROM tenants
      WHERE id = ${id} AND deleted_at IS NULL
    `

    if (result.length === 0) {
      throw new Error("Tenant not found")
    }

    return result[0]
  } catch (error) {
    console.error(`Error fetching tenant ${id}:`, error)
    throw new Error("Failed to fetch tenant")
  }
}

// Update tenant
export async function updateTenant(id: string, formData: FormData) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const domain = (formData.get("domain") as string) || null
    const subscription_tier = formData.get("subscription_tier") as string
    const status = formData.get("status") as string

    // Validate required fields
    if (!name || !slug || !subscription_tier || !status) {
      throw new Error("Missing required fields")
    }

    // Check if slug is already taken by another tenant
    const existingTenant = await sql`
      SELECT id FROM tenants 
      WHERE slug = ${slug} AND id != ${id} AND deleted_at IS NULL
    `

    if (existingTenant.length > 0) {
      throw new Error("Slug is already taken")
    }

    // Update tenant
    const now = new Date()

    const result = await sql`
      UPDATE tenants
      SET name = ${name}, 
          slug = ${slug}, 
          domain = ${domain}, 
          subscription_tier = ${subscription_tier}, 
          status = ${status}, 
          updated_at = ${now}
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id, name, slug, domain, subscription_tier, status, created_at, updated_at
    `

    if (result.length === 0) {
      throw new Error("Tenant not found")
    }

    // Update Auth0 client if domain changed
    if (domain) {
      const tenant = await sql`
        SELECT auth0_client_id FROM tenants WHERE id = ${id}
      `

      if (tenant.length > 0 && tenant[0].auth0_client_id) {
        const management = getManagementClient()

        await management.updateClient(
          { client_id: tenant[0].auth0_client_id },
          {
            callbacks: [`https://${domain}/api/auth/callback`],
            allowed_logout_urls: [`https://${domain}`],
            web_origins: [`https://${domain}`],
          },
        )
      }
    }

    revalidatePath("/superadmin/tenants")
    return result[0]
  } catch (error) {
    console.error(`Error updating tenant ${id}:`, error)
    throw new Error("Failed to update tenant")
  }
}

// Delete tenant (soft delete)
export async function deleteTenant(id: string) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    // Get tenant Auth0 client ID
    const tenant = await sql`
      SELECT auth0_client_id FROM tenants WHERE id = ${id} AND deleted_at IS NULL
    `

    if (tenant.length === 0) {
      throw new Error("Tenant not found")
    }

    // Soft delete the tenant
    const now = new Date()

    await sql`
      UPDATE tenants
      SET deleted_at = ${now}, updated_at = ${now}, status = 'deleted'
      WHERE id = ${id}
    `

    // Delete Auth0 client if exists
    if (tenant[0].auth0_client_id) {
      const management = getManagementClient()
      await management.deleteClient({ client_id: tenant[0].auth0_client_id })
    }

    revalidatePath("/superadmin/tenants")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting tenant ${id}:`, error)
    throw new Error("Failed to delete tenant")
  }
}
