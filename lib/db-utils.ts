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

// Add missing exports
export const tenantQuery = async (query: string, params: any[] = [], tenantId: string = DEFAULT_TENANT_ID) => {
  // Add tenant_id to WHERE clause if not present
  let modifiedQuery = query
  if (!query.toLowerCase().includes("tenant_id") && query.toLowerCase().includes("where")) {
    modifiedQuery = query.replace(/where/i, `WHERE tenant_id = '${tenantId}' AND`)
  } else if (!query.toLowerCase().includes("tenant_id")) {
    // Add WHERE clause with tenant_id if no WHERE clause exists
    modifiedQuery = `${query} WHERE tenant_id = '${tenantId}'`
  }

  return executeQuery(modifiedQuery, params, tenantId)
}

export const tenantInsert = async (table: string, data: Record<string, any>, tenantId: string = DEFAULT_TENANT_ID) => {
  // Ensure tenant_id is included in the data
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
  return result.rows?.[0] || null
}

export const tenantUpdate = async (
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
) => {
  const columns = Object.keys(data)
  const values = Object.values(data)

  const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ")

  const query = `
    UPDATE ${table}
    SET ${setClause}
    WHERE id = $${values.length + 1} AND tenant_id = $${values.length + 2}
    RETURNING *
  `

  const result = await sql.query(query, [...values, id, tenantId])
  return result.rows?.[0] || null
}

export const tenantDelete = async (table: string, id: string, tenantId: string = DEFAULT_TENANT_ID) => {
  const query = `
    DELETE FROM ${table}
    WHERE id = $1 AND tenant_id = $2
    RETURNING *
  `

  const result = await sql.query(query, [id, tenantId])
  return result.rows?.[0] || null
}
