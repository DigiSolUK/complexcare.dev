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
