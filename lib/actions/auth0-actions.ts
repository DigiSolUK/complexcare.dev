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

// Update an Auth0 user
export async function updateAuth0User(userId: string, userData: any) {
  try {
    await requirePermission(PERMISSIONS.SUPERADMIN, "system")

    const management = getManagementClient()
    const user = await management.updateUser({ id: userId }, userData)

    revalidatePath("/superadmin/auth0")
    return user
  } catch (error) {
    console.error(`Error updating Auth0 user ${userId}:`, error)
    throw new Error("Failed to update Auth0 user")
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
