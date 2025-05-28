"use server"

import { revalidatePath } from "next/cache"
import getManagementClient from "../auth0/management-api"
import { requirePermission } from "../auth/require-permission"
import { PERMISSIONS } from "../auth/permissions"

// Get all Auth0 users with pagination
export async function getAuth0Users(page = 0, perPage = 10, query = "") {
  try {
    // Ensure user has permission
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()

    // Build query parameters
    const params: any = {
      page,
      per_page: perPage,
      include_totals: true,
    }

    if (query) {
      params.q = query
      params.search_engine = "v3"
    }

    const users = await management.getUsers(params)
    return users
  } catch (error) {
    console.error("Error fetching Auth0 users:", error)
    throw new Error("Failed to fetch Auth0 users")
  }
}

// Get a single Auth0 user by ID
export async function getAuth0User(userId: string) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    const user = await management.getUser({ id: userId })
    return user
  } catch (error) {
    console.error(`Error fetching Auth0 user ${userId}:`, error)
    throw new Error("Failed to fetch Auth0 user")
  }
}

// Update an Auth0 user with comprehensive data
export async function updateAuth0User(
  userId: string,
  userData: {
    email?: string
    name?: string
    given_name?: string
    family_name?: string
    nickname?: string
    picture?: string
    user_metadata?: any
    app_metadata?: any
    email_verified?: boolean
    verify_email?: boolean
    phone_number?: string
    phone_verified?: boolean
    blocked?: boolean
    connection?: string
    password?: string
  },
) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()

    // Remove undefined values to avoid overwriting with null
    const cleanedUserData = Object.fromEntries(Object.entries(userData).filter(([_, v]) => v !== undefined))

    const user = await management.updateUser({ id: userId }, cleanedUserData)

    revalidatePath("/superadmin/auth0")
    return user
  } catch (error) {
    console.error(`Error updating Auth0 user ${userId}:`, error)
    throw new Error(`Failed to update Auth0 user: ${(error as Error).message}`)
  }
}

// Delete an Auth0 user
export async function deleteAuth0User(userId: string) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    await management.deleteUser({ id: userId })

    revalidatePath("/superadmin/auth0")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting Auth0 user ${userId}:`, error)
    throw new Error("Failed to delete Auth0 user")
  }
}

// Get Auth0 roles
export async function getAuth0Roles() {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    const roles = await management.getRoles()
    return roles
  } catch (error) {
    console.error("Error fetching Auth0 roles:", error)
    throw new Error("Failed to fetch Auth0 roles")
  }
}

// Assign roles to a user
export async function assignRolesToUser(userId: string, roleIds: string[]) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    await management.assignRolestoUser({ id: userId }, { roles: roleIds })

    revalidatePath("/superadmin/auth0")
    return { success: true }
  } catch (error) {
    console.error(`Error assigning roles to user ${userId}:`, error)
    throw new Error("Failed to assign roles to user")
  }
}

// Get Auth0 logs
export async function getAuth0Logs(page = 0, perPage = 10) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    const logs = await management.getLogs({
      page,
      per_page: perPage,
      include_totals: true,
    })

    return logs
  } catch (error) {
    console.error("Error fetching Auth0 logs:", error)
    throw new Error("Failed to fetch Auth0 logs")
  }
}

// Create a new Auth0 user
export async function createAuth0User(userData: {
  email: string
  password?: string
  connection: string
  name?: string
  given_name?: string
  family_name?: string
  nickname?: string
  picture?: string
  user_metadata?: any
  app_metadata?: any
  email_verified?: boolean
  verify_email?: boolean
  phone_number?: string
  phone_verified?: boolean
  blocked?: boolean
}) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    const user = await management.createUser(userData)

    revalidatePath("/superadmin/auth0")
    return user
  } catch (error) {
    console.error("Error creating Auth0 user:", error)
    throw new Error(`Failed to create Auth0 user: ${(error as Error).message}`)
  }
}

// Get Auth0 connections
export async function getAuth0Connections() {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    const connections = await management.getConnections()

    // Filter to only include database connections
    return connections.filter((conn) => conn.strategy === "auth0" || conn.strategy === "username-password")
  } catch (error) {
    console.error("Error fetching Auth0 connections:", error)
    throw new Error("Failed to fetch Auth0 connections")
  }
}

// Get user roles
export async function getUserRoles(userId: string) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    const roles = await management.getUserRoles({ id: userId })
    return roles
  } catch (error) {
    console.error(`Error fetching roles for user ${userId}:`, error)
    throw new Error("Failed to fetch user roles")
  }
}

// Remove roles from a user
export async function removeRolesFromUser(userId: string, roleIds: string[]) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    await management.removeRolesFromUser({ id: userId }, { roles: roleIds })

    revalidatePath("/superadmin/auth0")
    return { success: true }
  } catch (error) {
    console.error(`Error removing roles from user ${userId}:`, error)
    throw new Error("Failed to remove roles from user")
  }
}

// Send password reset email to a user
export async function sendPasswordResetEmail(userId: string) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()

    // First, get the user to get their email and connection
    const user = await management.getUser({ id: userId })

    if (!user.email) {
      throw new Error("User does not have an email address")
    }

    // Get the connection name from the user's identities
    const connection = user.identities?.[0]?.connection

    if (!connection) {
      throw new Error("Could not determine user's connection")
    }

    // Create a password change ticket
    const ticket = await management.createPasswordChangeTicket({
      user_id: userId,
      connection_id: connection,
      email: user.email,
      ttl_sec: 432000, // 5 days
      mark_email_as_verified: false,
      includeEmailInRedirect: false,
    })

    // Log the password reset action
    console.log(`Password reset email sent to user ${userId} (${user.email})`)

    return {
      success: true,
      ticket: ticket.ticket,
      email: user.email,
    }
  } catch (error) {
    console.error(`Error sending password reset email to user ${userId}:`, error)
    throw new Error(`Failed to send password reset email: ${(error as Error).message}`)
  }
}

// Force password reset on next login
export async function forcePasswordReset(userId: string) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()

    // Update user's app_metadata to require password reset
    const user = await management.updateUser(
      { id: userId },
      {
        app_metadata: {
          force_password_reset: true,
          password_reset_required_at: new Date().toISOString(),
        },
      },
    )

    revalidatePath("/superadmin/auth0")
    return { success: true, user }
  } catch (error) {
    console.error(`Error forcing password reset for user ${userId}:`, error)
    throw new Error(`Failed to force password reset: ${(error as Error).message}`)
  }
}

// Generate a one-time password reset link
export async function generatePasswordResetLink(userId: string) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()

    // First, get the user to get their email
    const user = await management.getUser({ id: userId })

    if (!user.email) {
      throw new Error("User does not have an email address")
    }

    // Get the connection name from the user's identities
    const connection = user.identities?.[0]?.connection

    if (!connection) {
      throw new Error("Could not determine user's connection")
    }

    // Create a password change ticket without sending email
    const ticket = await management.createPasswordChangeTicket({
      user_id: userId,
      connection_id: connection,
      email: user.email,
      ttl_sec: 86400, // 24 hours
      mark_email_as_verified: false,
      includeEmailInRedirect: false,
      result_url: `${process.env.NEXTAUTH_URL}/auth/password-reset-success`,
    })

    return {
      success: true,
      resetLink: ticket.ticket,
      email: user.email,
      expiresIn: "24 hours",
    }
  } catch (error) {
    console.error(`Error generating password reset link for user ${userId}:`, error)
    throw new Error(`Failed to generate password reset link: ${(error as Error).message}`)
  }
}
