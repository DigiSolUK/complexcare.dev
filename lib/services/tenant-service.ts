// Update the import for executeQuery to use the correct database connection
import { executeQuery } from "@/lib/db"
import type { Tenant, TenantUser, TenantInvitation } from "@/types"

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
export async function getTenantById(id: string): Promise<Tenant | null> {
  try {
    const tenants = await executeQuery<Tenant>(
      `
      SELECT * FROM tenants 
      WHERE id = $1 AND deleted_at IS NULL
    `,
      [id],
    )

    return tenants.length > 0 ? tenants[0] : null
  } catch (error) {
    console.error(`Error fetching tenant with ID ${id}:`, error)
    throw error
  }
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

// Create a new tenant
export async function createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
  try {
    // Generate a slug from the name if not provided
    if (!tenantData.slug && tenantData.name) {
      tenantData.slug = tenantData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    const result = await executeQuery<Tenant>(
      `
      INSERT INTO tenants (
        name, 
        slug, 
        domain, 
        status, 
        subscription_tier, 
        settings, 
        branding
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *
    `,
      [
        tenantData.name,
        tenantData.slug,
        tenantData.domain || null,
        tenantData.status || "active",
        tenantData.subscription_tier || "basic",
        JSON.stringify(tenantData.settings || {}),
        JSON.stringify(tenantData.branding || {}),
      ],
    )

    return result[0]
  } catch (error) {
    console.error("Error creating tenant:", error)
    throw error
  }
}

// Update a tenant
export async function updateTenant(id: string, tenantData: Partial<Tenant>): Promise<Tenant> {
  try {
    const updateFields = []
    const values = []
    let paramIndex = 1

    // Build dynamic update query based on provided fields
    if (tenantData.name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`)
      values.push(tenantData.name)
    }

    if (tenantData.slug !== undefined) {
      updateFields.push(`slug = $${paramIndex++}`)
      values.push(tenantData.slug)
    }

    if (tenantData.domain !== undefined) {
      updateFields.push(`domain = $${paramIndex++}`)
      values.push(tenantData.domain)
    }

    if (tenantData.status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`)
      values.push(tenantData.status)
    }

    if (tenantData.subscription_tier !== undefined) {
      updateFields.push(`subscription_tier = $${paramIndex++}`)
      values.push(tenantData.subscription_tier)
    }

    if (tenantData.settings !== undefined) {
      updateFields.push(`settings = $${paramIndex++}`)
      values.push(JSON.stringify(tenantData.settings))
    }

    if (tenantData.branding !== undefined) {
      updateFields.push(`branding = $${paramIndex++}`)
      values.push(JSON.stringify(tenantData.branding))
    }

    updateFields.push(`updated_at = $${paramIndex++}`)
    values.push(new Date())

    // Add tenant ID as the last parameter
    values.push(id)

    const result = await executeQuery<Tenant>(
      `
      UPDATE tenants 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `,
      values,
    )

    if (result.length === 0) {
      throw new Error(`Tenant with ID ${id} not found or already deleted`)
    }

    return result[0]
  } catch (error) {
    console.error(`Error updating tenant with ID ${id}:`, error)
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
      JOIN public.users u ON tu.user_id = u.id
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
export async function getUserTenants(userId: string): Promise<Tenant[]> {
  try {
    const tenants = await executeQuery<Tenant>(
      `
      SELECT t.*
      FROM tenants t
      JOIN tenant_users tu ON t.id = tu.tenant_id
      WHERE tu.user_id = $1 AND tu.deleted_at IS NULL AND t.deleted_at IS NULL
      ORDER BY tu.is_primary DESC, t.name ASC
    `,
      [userId],
    )

    return tenants
  } catch (error) {
    console.error(`Error fetching tenants for user ${userId}:`, error)
    throw error
  }
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
export async function setUserPrimaryTenant(userId: string, tenantId: string): Promise<boolean> {
  try {
    // Start a transaction
    await executeQuery("BEGIN")

    // Unset any existing primary tenant
    await executeQuery(
      `
      UPDATE tenant_users
      SET is_primary = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND is_primary = true
    `,
      [userId],
    )

    // Set the new primary tenant
    const result = await executeQuery(
      `
      UPDATE tenant_users
      SET is_primary = true, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND tenant_id = $2 AND deleted_at IS NULL
      RETURNING id
    `,
      [userId, tenantId],
    )

    // Commit the transaction
    await executeQuery("COMMIT")

    return result.length > 0
  } catch (error) {
    await executeQuery("ROLLBACK")
    console.error(`Error setting primary tenant ${tenantId} for user ${userId}:`, error)
    throw error
  }
}
