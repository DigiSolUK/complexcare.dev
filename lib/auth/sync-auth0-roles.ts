import { executeQuery } from "@/lib/db"
import { ManagementClient } from "auth0"

// Initialize Auth0 Management API client
const auth0ManagementClient = new ManagementClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL!.replace("https://", ""),
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
})

// Sync Auth0 roles to database
export async function syncAuth0Roles(userId: string, tenantId: string): Promise<void> {
  try {
    // Get user roles from Auth0
    const auth0User = await auth0ManagementClient.users.get({ id: userId })

    if (!auth0User || !auth0User.data) {
      throw new Error("User not found in Auth0")
    }

    // Get roles from Auth0 app_metadata or roles
    const auth0Roles = auth0User.data.app_metadata?.roles || auth0User.data.roles || ["care_professional"] // Default role

    // Delete existing roles for this user and tenant
    await executeQuery(`DELETE FROM user_roles WHERE user_id = $1 AND tenant_id = $2`, [userId, tenantId])

    // Insert new roles
    for (const role of auth0Roles) {
      await executeQuery(`INSERT INTO user_roles (user_id, role, tenant_id) VALUES ($1, $2, $3)`, [
        userId,
        role,
        tenantId,
      ])
    }
  } catch (error) {
    console.error("Error syncing Auth0 roles:", error)
    throw error
  }
}

// Get or create user in database
export async function getOrCreateUser(auth0User: any, tenantId: string): Promise<string> {
  try {
    // Check if user exists
    const existingUsers = await executeQuery(`SELECT id FROM users WHERE auth0_id = $1`, [auth0User.sub])

    if (existingUsers.length > 0) {
      return existingUsers[0].id
    }

    // Create new user
    const newUsers = await executeQuery(
      `INSERT INTO users (
        auth0_id, 
        email, 
        name, 
        picture, 
        default_tenant_id
      ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [auth0User.sub, auth0User.email, auth0User.name, auth0User.picture, tenantId],
    )

    return newUsers[0].id
  } catch (error) {
    console.error("Error getting or creating user:", error)
    throw error
  }
}

