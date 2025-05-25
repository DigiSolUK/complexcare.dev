import { DEFAULT_TENANT_ID } from "./constants"
import { mockDb, shouldUseMockDb, getDbClient } from "./mock-db-provider"

// Use the mock DB provider when needed
export const sql = shouldUseMockDb() ? mockDb : getDbClient()

// Legacy alias for compatibility
export const db = sql

// Helper function to execute queries with tenant context
export async function executeQuery(
  query: string,
  params: any[] = [],
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any[]> {
  try {
    if (shouldUseMockDb()) {
      console.log("Mock executeQuery:", query, params, tenantId)
      return []
    }

    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to get a connection with tenant context
export async function withTenant(tenantId = DEFAULT_TENANT_ID) {
  return {
    query: async (text: string, params: any[] = []) => {
      try {
        if (shouldUseMockDb()) {
          console.log("Mock withTenant query:", text, params, tenantId)
          return { rows: [] }
        }

        const result = await sql.query(text, params)
        return result
      } catch (error) {
        console.error("Database query error:", error)
        throw error
      }
    },
  }
}

// Helper function to execute a transaction
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  if (shouldUseMockDb()) {
    console.log("Mock transaction")
    return callback(mockDb) as Promise<T>
  }

  try {
    await sql.query("BEGIN")
    const result = await callback(sql)
    await sql.query("COMMIT")
    return result
  } catch (error) {
    await sql.query("ROLLBACK")
    console.error("Transaction error:", error)
    throw error
  }
}

// Generic CRUD operations
export async function getById(table: string, id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<any | null> {
  if (shouldUseMockDb()) {
    console.log("Mock getById:", table, id, tenantId)
    return null
  }

  try {
    const result = await sql.query(`SELECT * FROM ${table} WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL`, [
      id,
      tenantId,
    ])
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error getting ${table} by ID:`, error)
    return null
  }
}

export async function insert(
  table: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any | null> {
  if (shouldUseMockDb()) {
    console.log("Mock insert:", table, data, tenantId)
    return { id: "mock-id", ...data, tenant_id: tenantId }
  }

  try {
    const dataWithTenant = { ...data, tenant_id: tenantId }
    const columns = Object.keys(dataWithTenant)
    const values = Object.values(dataWithTenant)

    const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${columns.map((_, i) => `$${i + 1}`).join(", ")})
      RETURNING *
    `

    const result = await sql.query(query, values)
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    throw error
  }
}

export async function update(
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any | null> {
  if (shouldUseMockDb()) {
    console.log("Mock update:", table, id, data, tenantId)
    return { id, ...data, tenant_id: tenantId }
  }

  try {
    const updateFields = Object.keys(data)
      .map((key, i) => `${key} = $${i + 3}`)
      .join(", ")

    const query = `
      UPDATE ${table}
      SET ${updateFields}, updated_at = NOW()
      WHERE id = $1 AND tenant_id = $2
      RETURNING *
    `

    const values = [id, tenantId, ...Object.values(data)]
    const result = await sql.query(query, values)
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error updating ${table}:`, error)
    throw error
  }
}

export async function remove(
  table: string,
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
  softDelete = true,
): Promise<boolean> {
  if (shouldUseMockDb()) {
    console.log("Mock remove:", table, id, tenantId, softDelete)
    return true
  }

  try {
    if (softDelete) {
      await sql.query(`UPDATE ${table} SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND tenant_id = $2`, [
        id,
        tenantId,
      ])
    } else {
      await sql.query(`DELETE FROM ${table} WHERE id = $1 AND tenant_id = $2`, [id, tenantId])
    }
    return true
  } catch (error) {
    console.error(`Error removing from ${table}:`, error)
    return false
  }
}

// Helper function to sanitize SQL inputs
export function sanitize(input: string): string {
  if (!input) return ""
  return input.replace(/'/g, "''")
}

// Helper function to build a WHERE clause with filters
export function buildWhereClause(
  filters: Record<string, any>,
  tenantId = DEFAULT_TENANT_ID,
): {
  whereClause: string
  params: any[]
} {
  const conditions: string[] = ["tenant_id = $1", "deleted_at IS NULL"]
  const params: any[] = [tenantId]

  let paramIndex = 2

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "string" && value.includes("%")) {
        // Handle LIKE queries
        conditions.push(`${key} ILIKE $${paramIndex}`)
      } else {
        conditions.push(`${key} = $${paramIndex}`)
      }
      params.push(value)
      paramIndex++
    }
  }

  return {
    whereClause: conditions.join(" AND "),
    params,
  }
}
