import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "./constants"

// Create a SQL client using the Neon serverless driver
export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : {
      // Provide a mock implementation when DATABASE_URL is not available
      query: async () => {
        console.warn("No DATABASE_URL provided, mock SQL client being used")
        return { rows: [] }
      },
    }

// Legacy alias for compatibility
export const db = sql

// Helper function to execute queries with tenant context
export async function executeQuery(
  query: string,
  params: any[] = [],
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("No DATABASE_URL provided, returning empty result")
    return []
  }

  try {
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
  try {
    const result = await sql`
      SELECT * FROM ${sql(table)}
      WHERE id = ${id}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
    `
    return result[0] || null
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
  try {
    if (softDelete) {
      await sql`
        UPDATE ${sql(table)}
        SET deleted_at = NOW(), updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `
    } else {
      await sql`
        DELETE FROM ${sql(table)}
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `
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
