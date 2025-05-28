import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "./constants"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get the database URL from environment variables
const getDatabaseUrl = () => {
  // In browser/client components, we should never try to connect directly
  if (isBrowser) {
    console.warn("Attempted to access database from client component")
    return null
  }

  // Try to get the database URL from various environment variables
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.production_DATABASE_URL ||
    process.env.production_POSTGRES_URL ||
    process.env.AUTH_DATABASE_URL

  if (!dbUrl) {
    console.error("No database connection string found in environment variables")
  }

  return dbUrl
}

// Create a safe SQL client
const createSqlClient = () => {
  const dbUrl = getDatabaseUrl()

  // If we're in a browser or don't have a database URL, return a mock client
  if (isBrowser || !dbUrl) {
    return {
      query: async (...args: any[]) => {
        console.warn("Mock SQL client used. Database operations will not work.")
        return { rows: [] }
      },
    }
  }

  // Otherwise, create a real Neon client
  try {
    return neon(dbUrl)
  } catch (error) {
    console.error("Failed to create Neon SQL client:", error)
    return {
      query: async (...args: any[]) => {
        console.error("Database client initialization failed")
        return { rows: [] }
      },
    }
  }
}

// Create and export the SQL client
export const sql = createSqlClient()

// Legacy alias for compatibility
export const db = sql

// Helper function to execute queries with tenant context
export async function executeQuery(
  query: string,
  params: any[] = [],
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any[]> {
  if (isBrowser) {
    console.error("Database query attempted in browser environment")
    return []
  }

  try {
    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Database query error:", error)
    return []
  }
}

// Helper function to get a connection with tenant context
export async function withTenant(tenantId = DEFAULT_TENANT_ID) {
  if (isBrowser) {
    console.error("Database connection attempted in browser environment")
    return {
      query: async () => ({ rows: [] }),
    }
  }

  return {
    query: async (text: string, params: any[] = []) => {
      try {
        const result = await sql.query(text, params)
        return result
      } catch (error) {
        console.error("Database query error:", error)
        return { rows: [] }
      }
    },
  }
}

// Helper function to execute a transaction
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T | null> {
  if (isBrowser) {
    console.error("Database transaction attempted in browser environment")
    return null
  }

  try {
    await sql.query("BEGIN")
    const result = await callback(sql)
    await sql.query("COMMIT")
    return result
  } catch (error) {
    await sql.query("ROLLBACK")
    console.error("Transaction error:", error)
    return null
  }
}

// Generic CRUD operations
export async function getById(table: string, id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<any | null> {
  if (isBrowser) {
    console.error("Database query attempted in browser environment")
    return null
  }

  try {
    const result = await sql.query(`SELECT * FROM ${table} WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL`, [
      id,
      tenantId,
    ])
    return result.rows?.[0] || null
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
  if (isBrowser) {
    console.error("Database insert attempted in browser environment")
    return null
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
    return result.rows?.[0] || null
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    return null
  }
}

export async function update(
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any | null> {
  if (isBrowser) {
    console.error("Database update attempted in browser environment")
    return null
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
    return result.rows?.[0] || null
  } catch (error) {
    console.error(`Error updating ${table}:`, error)
    return null
  }
}

export async function remove(
  table: string,
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
  softDelete = true,
): Promise<boolean> {
  if (isBrowser) {
    console.error("Database delete attempted in browser environment")
    return false
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
