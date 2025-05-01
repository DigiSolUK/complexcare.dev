// Update the import for executeQuery to use the correct database connection
import { executeQuery } from "@/lib/db"
import type { Tenant, TenantUser, TenantInvitation } from "@/types"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "../tenant"
import { getCachedTenant, cacheTenant, invalidateTenantCache } from "../redis/tenant-cache"

// Get all tenants
export async function getAllTenants(): Promise<Tenant[]> {
  try {
    const tenants = await executeQuery<Tenant>(`
      SELECT * FROM tenants 
      WHERE deleted_at IS NULL 
      ORDER BY name ASC
    `)
    return tenants
  } catch (error) {
    console.error("Error fetching tenants:", error)
    throw error
  }
}

// Get tenant by ID
export async function getTenantById(tenantId: string = DEFAULT_TENANT_ID) {
  return getCachedTenant(tenantId, async () => {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql(`SELECT * FROM tenants WHERE id = $1`, [tenantId])

      if (result.length === 0) {
        return null
      }

      return result[0]
    } catch (error) {
      console.error("Error fetching tenant:", error)
      return null
    }
  })
}

// Get tenant by slug
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  try {
    const tenants = await executeQuery<Tenant>(
      `
      SELECT * FROM tenants 
      WHERE slug = $1 AND deleted_at IS NULL
    `,
      [slug],
    )

    return tenants.length > 0 ? tenants[0] : null
  } catch (error) {
    console.error(`Error fetching tenant with slug ${slug}:`, error)
    throw error
  }
}

export async function createTenant(data: any) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    // Build columns and values dynamically
    const fields = Object.keys(data)
    const columns = fields.join(", ")
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ")
    const values = fields.map((field) => data[field])

    const query = `
      INSERT INTO tenants (${columns}, created_at, updated_at)
      VALUES (${placeholders}, NOW(), NOW())
      RETURNING *
    `

    const result = await sql(query, values)

    // Cache the new tenant
    await cacheTenant(result[0].id, result[0])

    return result[0]
  } catch (error) {
    console.error("Error creating tenant:", error)
    throw error
  }
}

export async function updateTenant(tenantId: string, data: any) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    // Build SET clause dynamically
    const fields = Object.keys(data)
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ")
    const values = [tenantId, ...fields.map((field) => data[field])]

    const query = `
      UPDATE tenants
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `

    const result = await sql(query, values)

    // Invalidate cache
    await invalidateTenantCache(tenantId)

    return result[0]
  } catch (error) {
    console.error("Error updating tenant:", error)
    throw error
  }
}

// Soft delete a tenant
export async function deleteTenant(id: string): Promise<boolean> {
  try {
    const result = await executeQuery(
      `
      UPDATE tenants 
      SET deleted_at = CURRENT_TIMESTAMP, status = 'deleted'
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
    `,
      [id],
    )

    return result.length > 0
  } catch (error) {
    console.error(`Error deleting tenant with ID ${id}:`, error)
    throw error
  }
}

// Add a user to a tenant
export async function addUserToTenant(
  tenantId: string,
  userId: string,
  role = "user",
  isPrimary = false,
): Promise<TenantUser> {
  try {
    const result = await executeQuery<TenantUser>(
      `
      INSERT INTO tenant_users (
        tenant_id, 
        user_id, 
        role, 
        is_primary
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING *
    `,
      [tenantId, userId, role, isPrimary],
    )

    return result[0]
  } catch (error) {
    console.error(`Error adding user ${userId} to tenant ${tenantId}:`, error)
    throw error
  }
}

// Remove a user from a tenant
export async function removeUserFromTenant(tenantId: string, userId: string): Promise<boolean> {
  try {
    const result = await executeQuery(
      `
      UPDATE tenant_users 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING id
    `,
      [tenantId, userId],
    )

    return result.length > 0
  } catch (error) {
    console.error(`Error removing user ${userId} from tenant ${tenantId}:`, error)
    throw error
  }
}

// Update a user's role in a tenant
export async function updateUserRole(tenantId: string, userId: string, role: string): Promise<TenantUser> {
  try {
    const result = await executeQuery<TenantUser>(
      `
      UPDATE tenant_users 
      SET role = $3, updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING *
    `,
      [tenantId, userId, role],
    )

    if (result.length === 0) {
      throw new Error(`User ${userId} not found in tenant ${tenantId} or already removed`)
    }

    return result[0]
  } catch (error) {
    console.error(`Error updating role for user ${userId} in tenant ${tenantId}:`, error)
    throw error
  }
}

// Get all users in a tenant
export async function getTenantUsers(tenantId: string): Promise<TenantUser[]> {
  try {
    const users = await executeQuery<TenantUser>(
      `
      SELECT tu.*, u.email, u.name
      FROM tenant_users tu
      JOIN neon_auth.users_sync u ON tu.user_id = u.id
      WHERE tu.tenant_id = $1 AND tu.deleted_at IS NULL
      ORDER BY tu.is_primary DESC, u.name ASC
    `,
      [tenantId],
    )

    return users
  } catch (error) {
    console.error(`Error fetching users for tenant ${tenantId}:`, error)
    throw error
  }
}

// Create a tenant invitation
export async function createTenantInvitation(
  tenantId: string,
  email: string,
  role = "user",
): Promise<TenantInvitation> {
  try {
    // Generate a random token
    const token = Buffer.from(Math.random().toString(36) + Date.now().toString(36)).toString("base64")

    // Set expiration to 7 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const result = await executeQuery<TenantInvitation>(
      `
      INSERT INTO tenant_invitations (
        tenant_id, 
        email, 
        role, 
        token, 
        expires_at
      ) VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING *
    `,
      [tenantId, email, role, token, expiresAt],
    )

    return result[0]
  } catch (error) {
    console.error(`Error creating invitation for ${email} to tenant ${tenantId}:`, error)
    throw error
  }
}

// Get tenant invitations
export async function getTenantInvitations(tenantId: string): Promise<TenantInvitation[]> {
  try {
    const invitations = await executeQuery<TenantInvitation>(
      `
      SELECT * FROM tenant_invitations
      WHERE tenant_id = $1 AND accepted_at IS NULL AND expires_at > CURRENT_TIMESTAMP
      ORDER BY created_at DESC
    `,
      [tenantId],
    )

    return invitations
  } catch (error) {
    console.error(`Error fetching invitations for tenant ${tenantId}:`, error)
    throw error
  }
}

// Accept a tenant invitation
export async function acceptTenantInvitation(token: string, userId: string): Promise<boolean> {
  try {
    // Start a transaction
    await executeQuery("BEGIN")

    // Get the invitation
    const invitations = await executeQuery<TenantInvitation>(
      `
      SELECT * FROM tenant_invitations
      WHERE token = $1 AND accepted_at IS NULL AND expires_at > CURRENT_TIMESTAMP
    `,
      [token],
    )

    if (invitations.length === 0) {
      await executeQuery("ROLLBACK")
      throw new Error("Invalid or expired invitation token")
    }

    const invitation = invitations[0]

    // Mark the invitation as accepted
    await executeQuery(
      `
      UPDATE tenant_invitations
      SET accepted_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [invitation.id],
    )

    // Add the user to the tenant
    await addUserToTenant(invitation.tenant_id, userId, invitation.role)

    // Commit the transaction
    await executeQuery("COMMIT")

    return true
  } catch (error) {
    await executeQuery("ROLLBACK")
    console.error(`Error accepting invitation with token ${token}:`, error)
    throw error
  }
}

// Get tenants for a user
export async function getUserTenants(userId: string) {
  // Mock implementation
  return [
    {
      id: process.env.DEFAULT_TENANT_ID,
      name: "Default Tenant",
      status: "active",
    },
  ]
}

// Get user's primary tenant
export async function getUserPrimaryTenant(userId: string): Promise<Tenant | null> {
  try {
    const tenants = await executeQuery<Tenant>(
      `
      SELECT t.*
      FROM tenants t
      JOIN tenant_users tu ON t.id = tu.tenant_id
      WHERE tu.user_id = $1 AND tu.is_primary = true AND tu.deleted_at IS NULL AND t.deleted_at IS NULL
      LIMIT 1
    `,
      [userId],
    )

    return tenants.length > 0 ? tenants[0] : null
  } catch (error) {
    console.error(`Error fetching primary tenant for user ${userId}:`, error)
    throw error
  }
}

// Set user's primary tenant
export async function setUserPrimaryTenant(userId: string, tenantId: string) {
  // Mock implementation
  return {
    id: tenantId,
    name: "Default Tenant",
    status: "active",
  }
}
