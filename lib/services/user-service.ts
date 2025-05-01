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

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  return getById<User>("users", id)
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await executeQuery<User>(`SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1`, [
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
}): Promise<User> {
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

    return insert<User>("users", data)
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
): Promise<User> {
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

    return update<User>("users", id, data)
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
export async function getTenantUsers(tenantId: string): Promise<User[]> {
  try {
    return executeQuery<User>(`SELECT * FROM users WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY name ASC`, [
      tenantId,
    ])
  } catch (error) {
    console.error(`Error fetching users for tenant ${tenantId}:`, error)
    throw error
  }
}
