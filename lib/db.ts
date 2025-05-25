import { neon } from "@neondatabase/serverless"
import { Pool } from "pg"
import { DEFAULT_TENANT_ID } from "./constants"

// Use environment variables for database connection
const connectionString = process.env.DATABASE_URL || ""

// Create a connection pool for PostgreSQL
export const pool = new Pool({
  connectionString,
  max: 10,
  ssl: true,
})

// Create a neon client for serverless functions
export const sql = neon(connectionString)

// Simple query wrapper for the pool
export const db = {
  query: async (text: string, params: any[] = []) => {
    try {
      return await pool.query(text, params)
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  },
  // For transactions
  getClient: async () => {
    const client = await pool.connect()
    return client
  },
}

// For serverless functions
export async function executeQuery(text: string, params: any[] = []) {
  try {
    return await sql(text, params)
  } catch (error) {
    console.error("Serverless database query error:", error)
    throw error
  }
}

// Helper function to get a connection with tenant context
export async function withTenant(tenantId = DEFAULT_TENANT_ID) {
  return {
    query: async (text: string, params: any[] = []) => {
      try {
        const result = await sql(text, params)
        return result
      } catch (error) {
        console.error("Database query error:", error)
        throw error
      }
    },
  }
}

// Generic function to get a record by ID
export async function getById(table: string, id: string, tenantId = DEFAULT_TENANT_ID) {
  const query = `
    SELECT * FROM ${table}
    WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
  `
  const result = await executeQuery(query, [id, tenantId])
  return result.length > 0 ? result[0] : null
}

// Generic function to insert a record
export async function insert(table: string, data: Record<string, any>, tenantId = DEFAULT_TENANT_ID) {
  // Add tenant_id to data if not present
  const dataWithTenant = { ...data, tenant_id: data.tenant_id || tenantId }

  const columns = Object.keys(dataWithTenant)
  const values = Object.values(dataWithTenant)
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

  const query = `
    INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${placeholders})
    RETURNING *
  `

  const result = await executeQuery(query, values)
  return result.length > 0 ? result[0] : null
}

// Generic function to update a record
export async function update(table: string, id: string, data: Record<string, any>, tenantId = DEFAULT_TENANT_ID) {
  const columns = Object.keys(data)
  const values = Object.values(data)

  const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(", ")

  const query = `
    UPDATE ${table}
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND tenant_id = $${values.length + 2} AND deleted_at IS NULL
    RETURNING *
  `

  const result = await executeQuery(query, [id, ...values, tenantId])
  return result.length > 0 ? result[0] : null
}

// Generic function to soft delete a record
export async function remove(table: string, id: string, tenantId = DEFAULT_TENANT_ID) {
  const query = `
    UPDATE ${table}
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
    RETURNING *
  `

  const result = await executeQuery(query, [id, tenantId])
  return result.length > 0 ? result[0] : null
}

// Helper function to execute a transaction
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  try {
    await sql("BEGIN")
    const result = await callback(sql)
    await sql("COMMIT")
    return result
  } catch (error) {
    await sql("ROLLBACK")
    console.error("Transaction error:", error)
    throw error
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
