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
  if (isBrowser) {
    console.error("Database query attempted in browser environment")
    return { rows: [] }
  }

  try {
    // Add tenant_id filter to the query if it contains a WHERE clause
    let tenantQuery = query
    if (query.toLowerCase().includes("where")) {
      tenantQuery = query.replace(/where/i, `WHERE tenant_id = '${tenantId}' AND`)
    } else if (query.toLowerCase().includes("from")) {
      // Add WHERE clause if there isn't one
      const fromIndex = query.toLowerCase().indexOf("from")
      const restOfQuery = query.substring(fromIndex)

      // Check if there's a GROUP BY, ORDER BY, or LIMIT after FROM
      const groupByIndex = restOfQuery.toLowerCase().indexOf("group by")
      const orderByIndex = restOfQuery.toLowerCase().indexOf("order by")
      const limitIndex = restOfQuery.toLowerCase().indexOf("limit")

      let insertIndex = query.length
      if (groupByIndex > 0) insertIndex = fromIndex + groupByIndex
      else if (orderByIndex > 0) insertIndex = fromIndex + orderByIndex
      else if (limitIndex > 0) insertIndex = fromIndex + limitIndex

      tenantQuery = query.substring(0, insertIndex) + ` WHERE tenant_id = '${tenantId}' ` + query.substring(insertIndex)
    }

    const result = await sql.query(tenantQuery, params)
    return result
  } catch (error) {
    console.error("Tenant query error:", error)
    return { rows: [] }
  }
}

export async function tenantInsert(
  table: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
  returningAll = true,
) {
  if (isBrowser) {
    console.error("Database insert attempted in browser environment")
    return { rows: [] }
  }

  try {
    // Add tenant_id to the data
    const dataWithTenant = { ...data, tenant_id: tenantId }

    // Build the insert query
    const columns = Object.keys(dataWithTenant)
    const values = Object.values(dataWithTenant)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

    const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${placeholders})
      ${returningAll ? "RETURNING *" : ""}
    `

    const result = await sql.query(query, values)
    return result
  } catch (error) {
    console.error("Tenant insert error:", error)
    return { rows: [] }
  }
}

export async function tenantUpdate(
  table: string,
  id: string,
  data: Record<string, any>,
  tenantId: string = DEFAULT_TENANT_ID,
  idField = "id",
) {
  if (isBrowser) {
    console.error("Database update attempted in browser environment")
    return { rows: [] }
  }

  try {
    // Build the update query
    const setClause = Object.entries(data)
      .map(([key, _], i) => `${key} = $${i + 1}`)
      .join(", ")

    const values = [...Object.values(data), id, tenantId]

    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE ${idField} = $${Object.keys(data).length + 1}
      AND tenant_id = $${Object.keys(data).length + 2}
      RETURNING *
    `

    const result = await sql.query(query, values)
    return result
  } catch (error) {
    console.error("Tenant update error:", error)
    return { rows: [] }
  }
}

export async function tenantDelete(
  table: string,
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
  idField = "id",
  softDelete = false,
) {
  if (isBrowser) {
    console.error("Database delete attempted in browser environment")
    return { rows: [] }
  }

  try {
    let query

    if (softDelete) {
      // Soft delete - update deleted_at field
      query = `
        UPDATE ${table}
        SET deleted_at = NOW()
        WHERE ${idField} = $1
        AND tenant_id = $2
        RETURNING *
      `
    } else {
      // Hard delete
      query = `
        DELETE FROM ${table}
        WHERE ${idField} = $1
        AND tenant_id = $2
        RETURNING *
      `
    }

    const result = await sql.query(query, [id, tenantId])
    return result
  } catch (error) {
    console.error("Tenant delete error:", error)
    return { rows: [] }
  }
}
