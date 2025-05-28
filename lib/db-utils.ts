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

// Add the missing exports for tenant operations
export async function tenantQuery(query: string, params: any[] = [], tenantId: string = DEFAULT_TENANT_ID) {
  // Add tenant_id to WHERE clause if not already present
  const hasWhere = query.toLowerCase().includes("where")
  const tenantFilter = hasWhere ? `AND tenant_id = $${params.length + 1}` : `WHERE tenant_id = $${params.length + 1}`

  // Don't modify queries that already filter by tenant_id
  if (query.toLowerCase().includes("tenant_id")) {
    return executeQuery(query, params)
  }

  // Add tenant filter before any GROUP BY, ORDER BY, LIMIT, etc.
  let modifiedQuery = query
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("group by")) {
    const index = lowerQuery.indexOf("group by")
    modifiedQuery = query.slice(0, index) + ` ${tenantFilter} ` + query.slice(index)
  } else if (lowerQuery.includes("order by")) {
    const index = lowerQuery.indexOf("order by")
    modifiedQuery = query.slice(0, index) + ` ${tenantFilter} ` + query.slice(index)
  } else if (lowerQuery.includes("limit")) {
    const index = lowerQuery.indexOf("limit")
    modifiedQuery = query.slice(0, index) + ` ${tenantFilter} ` + query.slice(index)
  } else {
    modifiedQuery = query + ` ${tenantFilter}`
  }

  return executeQuery(modifiedQuery, [...params, tenantId])
}

export async function tenantInsert(
  table: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
  returning = true,
) {
  // Add tenant_id to the data
  const dataWithTenant = { ...data, tenant_id: tenantId }

  // Build the query
  const columns = Object.keys(dataWithTenant)
  const values = Object.values(dataWithTenant)
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

  const query = `
    INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${placeholders})
    ${returning ? "RETURNING *" : ""}
  `

  const result = await sql.query(query, values)
  return returning ? result.rows[0] : undefined
}

export async function tenantUpdate(
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
  returning = true,
) {
  // Build the SET clause
  const updates = Object.entries(data).map(([key, _], i) => `${key} = $${i + 3}`)
  const values = [id, tenantId, ...Object.values(data)]

  const query = `
    UPDATE ${table}
    SET ${updates.join(", ")}
    WHERE id = $1 AND tenant_id = $2
    ${returning ? "RETURNING *" : ""}
  `

  const result = await sql.query(query, values)
  return returning ? result.rows[0] : undefined
}

export async function tenantDelete(table: string, id: string, tenantId: string = DEFAULT_TENANT_ID, returning = true) {
  const query = `
    DELETE FROM ${table}
    WHERE id = $1 AND tenant_id = $2
    ${returning ? "RETURNING *" : ""}
  `

  const result = await sql.query(query, [id, tenantId])
  return returning ? result.rows[0] : undefined
}
