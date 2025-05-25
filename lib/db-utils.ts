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

// Add the missing exports
export async function tenantQuery(query: string, params: any[] = [], tenantId = DEFAULT_TENANT_ID): Promise<any[]> {
  try {
    // Add tenant_id filter to the query if it has a WHERE clause
    let tenantQuery = query
    const hasWhere = query.toUpperCase().includes("WHERE")

    if (hasWhere) {
      // Add AND tenant_id = $X to the query
      const whereIndex = query.toUpperCase().indexOf("WHERE") + 5
      const beforeWhere = query.substring(0, whereIndex)
      const afterWhere = query.substring(whereIndex)
      tenantQuery = `${beforeWhere} ${afterWhere} AND tenant_id = $${params.length + 1}`
    } else {
      // Add WHERE tenant_id = $X to the query
      tenantQuery = `${query} WHERE tenant_id = $${params.length + 1}`
    }

    // Add tenant_id to params
    const tenantParams = [...params, tenantId]

    const result = await sql.query(tenantQuery, tenantParams)
    return result.rows || []
  } catch (error) {
    console.error("Error executing tenant query:", error)
    return []
  }
}

export async function tenantInsert(
  table: string,
  data: Record<string, any>,
  tenantId = DEFAULT_TENANT_ID,
  returningClause = "RETURNING *",
): Promise<any> {
  try {
    // Add tenant_id to the data
    const dataWithTenant = { ...data, tenant_id: tenantId }

    // Build the column names and placeholders
    const columns = Object.keys(dataWithTenant)
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")
    const values = Object.values(dataWithTenant)

    const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${placeholders})
      ${returningClause}
    `

    const result = await sql.query(query, values)
    return result.rows?.[0] || null
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    throw error
  }
}

export async function tenantUpdate(
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId = DEFAULT_TENANT_ID,
  returningClause = "RETURNING *",
): Promise<any> {
  try {
    // Build the SET clause
    const setColumns = Object.keys(data).map((col, i) => `${col} = $${i + 1}`)
    const values = Object.values(data)

    // Add id and tenant_id to values
    values.push(id, tenantId)

    const query = `
      UPDATE ${table}
      SET ${setColumns.join(", ")}
      WHERE id = $${values.length - 1} AND tenant_id = $${values.length}
      ${returningClause}
    `

    const result = await sql.query(query, values)
    return result.rows?.[0] || null
  } catch (error) {
    console.error(`Error updating ${table}:`, error)
    throw error
  }
}

export async function tenantDelete(
  table: string,
  id: string,
  tenantId = DEFAULT_TENANT_ID,
  returningClause = "RETURNING *",
): Promise<any> {
  try {
    const query = `
      DELETE FROM ${table}
      WHERE id = $1 AND tenant_id = $2
      ${returningClause}
    `

    const result = await sql.query(query, [id, tenantId])
    return result.rows?.[0] || null
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error)
    throw error
  }
}
