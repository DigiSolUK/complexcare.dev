import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "./constants"

// Create a SQL client using the Neon serverless driver
export const sql = neon(process.env.DATABASE_URL!)

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
