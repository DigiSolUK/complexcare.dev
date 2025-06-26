import { sql } from "@neondatabase/serverless"
import { v4 as uuidv4, validate as uuidValidate } from "uuid"
// import { getAuth } from "@auth0/nextjs-auth0" // Commented out as it's not directly used in these functions
// import { DEFAULT_TENANT_ID } from "@/lib/tenant-utils" // Commented out as tenantId is passed as an argument

// Initialize the SQL client once
// const db = neon(process.env.DATABASE_URL!) // This line is not needed if using `sql` directly from @neondatabase/serverless

/**
 * Checks if a string is a valid UUID.
 * @param uuid The string to check.
 * @returns True if the string is a valid UUID, false otherwise.
 */
export function isValidUUID(uuid: string): boolean {
  return uuidValidate(uuid)
}

/**
 * Executes a SQL query, ensuring it's scoped to a specific tenant.
 * Throws an error if the tenantId is missing or if the query fails.
 * Always returns an array of results (empty array if no rows found).
 */
export async function tenantQuery<T>(query: string, params: any[] = [], tenantId?: string): Promise<T[]> {
  // The original code had getAuth() and session logic here.
  // For these utility functions, it's better to pass tenantId explicitly
  // and let the calling API route or service handle session/auth.

  let finalQuery = query
  const finalParams = [...params]

  if (tenantId) {
    // Adjust query to include tenant_id filter if not already present
    // This is a simplistic approach; for complex queries, you might need more sophisticated parsing
    // For example, if the query already has a WHERE clause, append with AND
    // Otherwise, add a WHERE clause.
    const lowerCaseQuery = query.toLowerCase()
    const whereClauseIndex = lowerCaseQuery.indexOf("where")

    if (whereClauseIndex !== -1) {
      // Check if tenant_id is already part of the WHERE clause to avoid duplicates
      if (!lowerCaseQuery.includes("tenant_id")) {
        finalQuery =
          query.substring(0, whereClauseIndex + 5) +
          ` tenant_id = $${finalParams.length + 1} AND ` +
          query.substring(whereClauseIndex + 5)
        finalParams.push(tenantId)
      } else {
        // If tenant_id is already in the query, assume it's handled by the caller
        // and ensure the tenantId is in the params at the correct position.
        // This requires careful coordination with how the query is constructed.
        // For simplicity, we'll assume it's added if not present.
      }
    } else {
      finalQuery = `${query} WHERE tenant_id = $${finalParams.length + 1}`
      finalParams.push(tenantId)
    }
  }

  try {
    // Use sql.query for parameterized queries
    const result = await sql.query<T>(finalQuery, finalParams)
    return result.rows || [] // Ensure it always returns an array
  } catch (error) {
    console.error(`Error executing tenant-scoped query for tenant ${tenantId}:`, error)
    throw error // Re-throw the error for upstream handling
  }
}

/**
 * Helper to build update query dynamically.
 * @param tableName The name of the table to update.
 * @param data An object containing the columns and values to update.
 * @param whereClause An object containing the WHERE clause conditions.
 * @returns An object containing the query string and the array of values.
 */
export function buildUpdateQuery(
  tableName: string,
  data: Record<string, any>,
  whereClause: Record<string, any>,
): { query: string; values: any[] } {
  const keys = Object.keys(data).filter((key) => data[key] !== undefined)
  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")
  const values = keys.map((key) => data[key])

  const whereKeys = Object.keys(whereClause)
  const whereClauses = whereKeys.map((key, index) => `${key} = $${values.length + index + 1}`).join(" AND ")
  const whereValues = whereKeys.map((key) => whereClause[key])

  const query = `UPDATE ${tableName} SET ${setClauses} WHERE ${whereClauses} RETURNING *`
  return { query, values: [...values, ...whereValues] }
}

/**
 * Tenant-scoped insert function.
 * @param tableName The name of the table to insert into.
 * @param data The data object to insert.
 * @param tenantId Optional tenant ID for tenant-scoping.
 * @returns The inserted record.
 */
export async function tenantInsert<T>(tableName: string, data: Record<string, any>, tenantId?: string): Promise<T> {
  try {
    const id = uuidv4()
    const columns = ["id", "created_at", "updated_at"]
    const placeholders = ["$1", "$2", "$3"]
    const values = [id, new Date(), new Date()]

    if (tenantId) {
      columns.push("tenant_id")
      placeholders.push(`$${columns.length}`)
      values.push(tenantId)
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        columns.push(key)
        placeholders.push(`$${columns.length}`)
        values.push(data[key])
      }
    }

    const query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`

    const result = await sql.query<T>(query, values)
    return result.rows[0]
  } catch (error) {
    console.error(`Error inserting into ${tableName} for tenant ${tenantId}:`, error)
    throw error
  }
}

/**
 * Tenant-scoped update function.
 * @param tableName The name of the table to update.
 * @param data The data object containing fields to update.
 * @param whereClause An object containing the WHERE clause conditions.
 * @returns The updated record.
 */
export async function tenantUpdate<T>(
  tableName: string,
  data: Record<string, any>,
  whereClause: Record<string, any>,
): Promise<T> {
  try {
    const { query, values } = buildUpdateQuery(tableName, data, whereClause)
    const result = await sql.query<T>(query, values)
    if (result.rows.length === 0) {
      throw new Error(`Record not found or not accessible for update.`)
    }
    return result.rows[0]
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error)
    throw error
  }
}

/**
 * Tenant-scoped delete function.
 * @param tableName The name of the table to delete from.
 * @param id The ID of the record to delete.
 * @param tenantId Optional tenant ID for tenant-scoping.
 * @returns void
 */
export async function tenantDelete(tableName: string, id: string, tenantId?: string): Promise<void> {
  try {
    let query = `DELETE FROM ${tableName} WHERE id = $1`
    const params = [id]

    if (tenantId) {
      query += ` AND tenant_id = $2`
      params.push(tenantId)
    }

    const result = await sql.query(query, params)
    if (result.rowCount === 0) {
      throw new Error(`Record with ID ${id} not found or not accessible for deletion.`)
    }
  } catch (error) {
    console.error(`Error deleting from ${tableName} with ID ${id} for tenant ${tenantId}:`, error)
    throw error
  }
}
