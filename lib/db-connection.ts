import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "./constants"

// Get the database URL from environment variables
const getDatabaseUrl = () => {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.production_DATABASE_URL ||
    process.env.production_POSTGRES_URL ||
    process.env.AUTH_DATABASE_URL

  if (!dbUrl) {
    console.error("No database connection string found in environment variables")
    throw new Error("Database connection string is required")
  }

  return dbUrl
}

// Create a SQL client using the Neon serverless driver
export const sql = neon(getDatabaseUrl())

// Legacy alias for compatibility
export const db = sql

// Helper function to execute queries with tenant context
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<T[]> {
  try {
    console.log(`Executing query: ${query.substring(0, 100)}...`)
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
    await sql.query("ROLLBACK").catch((rollbackError) => {
      console.error("Rollback error:", rollbackError)
    })
    console.error("Transaction error:", error)
    throw error
  }
}

// Generic CRUD operations
export async function getById<T = any>(
  table: string,
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<T | null> {
  try {
    const query = `
      SELECT * FROM ${table}
      WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
    `
    const result = await sql.query(query, [id, tenantId])
    return (result.rows?.[0] as T) || null
  } catch (error) {
    console.error(`Error getting ${table} by ID:`, error)
    throw error
  }
}

export async function getAll<T = any>(
  table: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
  orderBy = "created_at DESC",
): Promise<T[]> {
  try {
    const query = `
      SELECT * FROM ${table}
      WHERE tenant_id = $1 AND deleted_at IS NULL
      ORDER BY ${orderBy}
      LIMIT $2 OFFSET $3
    `
    const result = await sql.query(query, [tenantId, limit, offset])
    return result.rows as T[]
  } catch (error) {
    console.error(`Error getting all from ${table}:`, error)
    throw error
  }
}

export async function insert<T = any>(
  table: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<T | null> {
  try {
    const dataWithTenant = { ...data, tenant_id: tenantId }
    const columns = Object.keys(dataWithTenant)
    const values = Object.values(dataWithTenant)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

    const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `

    const result = await sql.query(query, values)
    return (result.rows?.[0] as T) || null
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    throw error
  }
}

export async function update<T = any>(
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<T | null> {
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
    return (result.rows?.[0] as T) || null
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
      const query = `
        UPDATE ${table}
        SET deleted_at = NOW(), updated_at = NOW()
        WHERE id = $1 AND tenant_id = $2
      `
      await sql.query(query, [id, tenantId])
    } else {
      const query = `
        DELETE FROM ${table}
        WHERE id = $1 AND tenant_id = $2
      `
      await sql.query(query, [id, tenantId])
    }
    return true
  } catch (error) {
    console.error(`Error removing from ${table}:`, error)
    throw error
  }
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

// Helper function to sanitize SQL inputs
export function sanitize(input: string): string {
  if (!input) return ""
  return input.replace(/'/g, "''")
}

// Helper function to check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const result = await sql.query("SELECT 1 as connection_test")
    return result.rows?.[0]?.connection_test === 1
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
  }
}
