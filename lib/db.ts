import { neon } from "@neondatabase/serverless"
import { getCurrentTenantId } from "./tenant"
import { DEFAULT_TENANT_ID } from "./constants"

// Create a connection pool
let sql: ReturnType<typeof neon>

// Initialize the SQL client
export function getDbClient() {
  if (!sql) {
    // Initialize the SQL client if it doesn't exist
    sql = neon(process.env.DATABASE_URL!)
  }
  return sql
}

// Execute a query with error handling and tenant isolation
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const client = getDbClient()

    // Add tenant isolation for tables that support it
    // This is a simplified version - in production you'd want more sophisticated parsing
    let tenantIsolatedQuery = query

    // Only add tenant isolation if not in safe mode and the query isn't a system query
    const isSystemQuery =
      query.includes("information_schema") ||
      query.includes("pg_") ||
      query.includes("pg_") ||
      query.toLowerCase().includes("select now()") ||
      query.toLowerCase().includes("select version()")

    if (!isSystemQuery && !global.SAFE_MODE) {
      const tenantId = getCurrentTenantId()

      // Simple check for SELECT queries on tenant-isolated tables
      const tenantTables = ["users", "patients", "appointments", "clinical_notes", "tasks", "medications"]

      for (const table of tenantTables) {
        // Very simple regex to add tenant_id condition
        // In production, you'd want a proper SQL parser
        const tablePattern = new RegExp(`FROM\\s+${table}\\s+WHERE`, "i")
        if (tablePattern.test(query)) {
          tenantIsolatedQuery = query.replace(tablePattern, `FROM ${table} WHERE tenant_id = '${tenantId}' AND`)
        }

        const tablePatternNoWhere = new RegExp(`FROM\\s+${table}\\s+(?!WHERE)`, "i")
        if (tablePatternNoWhere.test(query)) {
          tenantIsolatedQuery = query.replace(tablePatternNoWhere, `FROM ${table} WHERE tenant_id = '${tenantId}' `)
        }
      }
    }

    // Execute the query
    return await client`${tenantIsolatedQuery}`
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
        const result = await executeQuery(text, params)
        return result
      } catch (error) {
        console.error("Database query error:", error)
        throw error
      }
    },
  }
}

// Export db object for compatibility
export const db = {
  query: executeQuery,
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
    await getDbClient().query("BEGIN")
    const result = await callback(getDbClient())
    await getDbClient().query("COMMIT")
    return result
  } catch (error) {
    await getDbClient().query("ROLLBACK")
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

// Safe mode toggle for emergency recovery
export function setSafeMode(enabled: boolean) {
  global.SAFE_MODE = enabled
}

// Check if safe mode is enabled
export function isSafeMode() {
  return !!global.SAFE_MODE
}
