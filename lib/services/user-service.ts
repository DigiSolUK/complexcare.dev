import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { User as UserType, TenantUser } from "@/types"
import { AppError } from "@/lib/error-handler"
import { executeQuery, getById, insert, update, remove } from "@/lib/db"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  name: string
  email: string
  role: string
  tenant_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export class UserService {
  private constructor() {}

  public static async create() {
    return new UserService()
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    })
    if (!user) return null
    return {
      ...user,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
      name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
      tenantId: user.tenant_memberships?.[0]?.tenant_id || null, // Assuming primary tenant for simplicity
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    })
    if (!user) return null
    return {
      ...user,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
      name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
      tenantId: user.tenant_memberships?.[0]?.tenant_id || null, // Assuming primary tenant for simplicity
    }
  }

  async getTenantUsers(tenantId: string): Promise<{ success: boolean; data?: TenantUser[]; error?: string }> {
    try {
      const users = await db.query.tenantMemberships.findMany({
        where: eq(schema.tenantMemberships.tenant_id, tenantId),
        with: {
          user: true, // Join with the users table
        },
      })

      const formattedUsers: TenantUser[] = users.map((membership) => ({
        id: membership.user_id,
        tenant_id: membership.tenant_id,
        user_id: membership.user_id,
        role: membership.role,
        is_primary: membership.is_primary,
        created_at: new Date(membership.created_at),
        updated_at: new Date(membership.updated_at),
        email: membership.user?.email,
        name:
          membership.user?.first_name && membership.user?.last_name
            ? `${membership.user.first_name} ${membership.user.last_name}`
            : membership.user?.email,
      }))
      return { success: true, data: formattedUsers }
    } catch (error) {
      const appError = AppError.fromError(error)
      return { success: false, error: appError.message }
    }
  }

  // ... other existing methods ...
}

// Get user by ID
export async function getUserById(id: string): Promise<UserType | null> {
  return getById<UserType>("users", id)
}

// Get user by email
export async function getUserByEmail(email: string): Promise<UserType | null> {
  try {
    const users = await executeQuery<UserType>(`SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1`, [
      email,
    ])
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error)
    throw error
  }
}

// Create a new user
export async function createUser(userData: {
  name: string
  email: string
  password: string
  role?: string
  tenant_id?: string
}): Promise<UserType> {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(userData.password, 10)

    // Prepare user data
    const data = {
      name: userData.name,
      email: userData.email,
      password_hash: passwordHash,
      role: userData.role || "user",
      tenant_id: userData.tenant_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    return insert<UserType>("users", data)
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Update a user
export async function updateUser(
  id: string,
  userData: Partial<{
    name: string
    email: string
    password: string
    role: string
    tenant_id: string
  }>,
): Promise<UserType> {
  try {
    const data: Record<string, any> = {
      ...userData,
      updated_at: new Date(),
    }

    // If password is provided, hash it
    if (userData.password) {
      data.password_hash = await bcrypt.hash(userData.password, 10)
      delete data.password
    }

    return update<UserType>("users", id, data)
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    throw error
  }
}

// Delete a user (soft delete)
export async function deleteUser(id: string): Promise<boolean> {
  return remove("users", id)
}

// Get all users for a tenant
export async function getTenantUsersOld(tenantId: string): Promise<UserType[]> {
  try {
    return executeQuery<UserType>(`SELECT * FROM users WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY name ASC`, [
      tenantId,
    ])
  } catch (error) {
    console.error(`Error fetching users for tenant ${tenantId}:`, error)
    throw error
  }
}

// Add the missing exported function
export async function getTenantById(id: string): Promise<{ id: string } | null> {
  try {
    const tenants = await executeQuery<{ id: string }>(`SELECT id FROM tenants WHERE id = $1 LIMIT 1`, [id])
    return tenants.length > 0 ? tenants[0] : null
  } catch (error) {
    console.error(`Error fetching tenant with ID ${id}:`, error)
    return null
  }
}
