import { executeQuery } from "../db"

export interface User {
  id: string
  tenant_id: string
  email: string
  name: string
  role: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Tenant {
  id: string
  name: string
  subscription_tier: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export async function getUserById(userId: string): Promise<User | null> {
  const query = `
    SELECT * FROM users 
    WHERE id = $1 
    AND deleted_at IS NULL
  `

  const results = await executeQuery<User>(query, [userId])
  return results.length > 0 ? results[0] : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT * FROM users 
    WHERE email = $1 
    AND deleted_at IS NULL
  `

  const results = await executeQuery<User>(query, [email])
  return results.length > 0 ? results[0] : null
}

export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  const query = `
    SELECT * FROM tenants 
    WHERE id = $1 
    AND deleted_at IS NULL
  `

  const results = await executeQuery<Tenant>(query, [tenantId])
  return results.length > 0 ? results[0] : null
}

export async function getUsersByTenant(tenantId: string): Promise<User[]> {
  const query = `
    SELECT * FROM users 
    WHERE tenant_id = $1 
    AND deleted_at IS NULL
    ORDER BY name
  `

  return executeQuery<User>(query, [tenantId])
}

