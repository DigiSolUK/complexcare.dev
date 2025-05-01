import { sql } from "@/lib/db"
import type { ApiKey } from "@/types"

export async function getApiKeys(tenantId: string): Promise<ApiKey[]> {
  try {
    const result = await sql`
      SELECT k.*, u.name as created_by_name
      FROM api_keys k
      LEFT JOIN users u ON k.created_by = u.id
      WHERE k.tenant_id = ${tenantId}
      ORDER BY k.created_at DESC
    `

    return result.rows
  } catch (error) {
    console.error("Error fetching API keys:", error)
    throw new Error("Failed to fetch API keys")
  }
}

export async function getApiKeyById(tenantId: string, id: string): Promise<ApiKey | null> {
  try {
    const result = await sql`
      SELECT k.*, u.name as created_by_name
      FROM api_keys k
      LEFT JOIN users u ON k.created_by = u.id
      WHERE k.tenant_id = ${tenantId} AND k.id = ${id}
    `

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error("Error fetching API key:", error)
    throw new Error("Failed to fetch API key")
  }
}

export async function createApiKey(
  tenantId: string,
  name: string,
  scopes: string[],
  createdBy: string,
  expiresAt?: Date,
): Promise<ApiKey> {
  try {
    // Generate a random API key
    const prefix = "cc_live_"
    const randomPart = Array.from(
      { length: 32 },
      () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 62)],
    ).join("")
    const key = `${prefix}${randomPart}`

    const result = await sql`
      INSERT INTO api_keys (
        tenant_id, name, key, scopes, expires_at, created_by
      )
      VALUES (
        ${tenantId}, ${name}, ${key}, ${scopes}, ${expiresAt || null}, ${createdBy}
      )
      RETURNING *
    `

    return result.rows[0]
  } catch (error) {
    console.error("Error creating API key:", error)
    throw new Error("Failed to create API key")
  }
}

export async function deleteApiKey(tenantId: string, id: string): Promise<void> {
  try {
    await sql`
      DELETE FROM api_keys
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `
  } catch (error) {
    console.error("Error deleting API key:", error)
    throw new Error("Failed to delete API key")
  }
}

export async function updateApiKeyLastUsed(tenantId: string, key: string): Promise<void> {
  try {
    await sql`
      UPDATE api_keys
      SET last_used_at = NOW()
      WHERE tenant_id = ${tenantId} AND key = ${key}
    `
  } catch (error) {
    console.error("Error updating API key last used:", error)
    throw new Error("Failed to update API key last used")
  }
}
