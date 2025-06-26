import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

// Initialize the SQL client once
const sql = neon(process.env.DATABASE_URL!)

/**
 * Checks if a string is a valid UUID.
 * @param uuid The string to check.
 * @returns True if the string is a valid UUID, false otherwise.
 */
export function isValidUUID(uuid: string) {
  if (!uuid) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
}

/**
 * Executes a SQL query, ensuring it's scoped to a specific tenant.
 * Throws an error if the tenantId is missing or if the query fails.
 * Always returns an array of results (empty array if no rows found).
 */
export async function tenantQuery<T>(tenantId: string, query: string, params: any[] = []): Promise<T[]> {
  if (!tenantId) {
    throw new Error("Tenant ID is required for tenant-scoped queries.")
  }
  try {
    const result = await sql<T[]>(query, params)
    // Ensure result is an array, even if the underlying driver returns null/undefined for no rows
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error(`Error executing tenant-scoped query for tenant ${tenantId}:`, error)
    throw new Error("Database query failed.")
  }
}

/**
 * Inserts a record into a specified table for a given tenant.
 * Automatically assigns a UUID if not provided and sets the tenant_id.
 * @param tenantId The ID of the tenant.
 * @param table The name of the table.
 * @param data The data object to insert.
 * @returns An array of the inserted records.
 */
export async function tenantInsert<T>(tenantId: string, table: string, data: any): Promise<T[]> {
  if (!isValidUUID(tenantId)) {
    console.warn("Invalid tenant ID provided. Skipping insert operation.")
    return []
  }
  try {
    if (!data.id) {
      data.id = uuidv4()
    }
    data.tenant_id = tenantId
    data.created_at = new Date()
    data.updated_at = new Date()

    const columns = Object.keys(data).join(", ")
    const valuesPlaceholders = Object.keys(data)
      .map((_, i) => `$${i + 1}`)
      .join(", ")
    const values = Object.values(data)

    const query = `
      INSERT INTO ${table} (${columns})
      VALUES (${valuesPlaceholders})
      RETURNING *
    `
    const result = await sql<T[]>(query, values)
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Error executing tenant insert:", error)
    throw new Error("Database insert failed.")
  }
}

/**
 * Updates a record in a specified table for a given tenant and record ID.
 * Automatically updates the `updated_at` timestamp.
 * @param tenantId The ID of the tenant.
 * @param table The name of the table.
 * @param id The ID of the record to update.
 * @param data The data object containing fields to update.
 * @returns An array of the updated records.
 */
export async function tenantUpdate<T>(tenantId: string, table: string, id: string, data: any): Promise<T[]> {
  if (!isValidUUID(tenantId) || !isValidUUID(id)) {
    console.warn("Invalid tenant or record ID provided. Skipping update operation.")
    return []
  }
  try {
    const { query, values } = buildUpdateQuery(table, data, { id, tenant_id: tenantId })
    const result = await sql<T[]>(query, values)
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Error executing tenant update:", error)
    throw new Error("Database update failed.")
  }
}

/**
 * Deletes a record from a specified table for a given tenant and record ID.
 * @param tenantId The ID of the tenant.
 * @param table The name of the table.
 * @param id The ID of the record to delete.
 * @returns An array of the deleted records.
 */
export async function tenantDelete<T>(tenantId: string, table: string, id: string): Promise<T[]> {
  if (!isValidUUID(tenantId) || !isValidUUID(id)) {
    console.warn("Invalid tenant or record ID provided. Skipping delete operation.")
    return []
  }
  try {
    const query = `DELETE FROM ${table} WHERE id = $1 AND tenant_id = $2 RETURNING *`
    const result = await sql<T[]>(query, [id, tenantId])
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Error executing tenant delete:", error)
    throw new Error("Database delete failed.")
  }
}

/**
 * Builds a parameterized SQL UPDATE query string and its corresponding values array.
 * @param table The name of the table to update.
 * @param data An object containing the columns and values to update.
 * @param where An object specifying the WHERE clause conditions (e.g., { id: 'some-uuid', tenant_id: 'another-uuid' }).
 * @returns An object containing the query string and the array of values.
 */
export function buildUpdateQuery(
  table: string,
  data: Record<string, any>,
  where: Record<string, any>,
): { query: string; values: any[] } {
  const dataEntries = Object.entries(data).filter(([, value]) => value !== undefined)
  const whereEntries = Object.entries(where)

  if (dataEntries.length === 0) {
    throw new Error("No fields to update.")
  }

  const values: any[] = []
  let paramIndex = 1

  const setClauses = dataEntries.map(([key, value]) => {
    // Convert camelCase to snake_case for database columns
    const snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
    values.push(value)
    return `${snakeCaseKey} = $${paramIndex++}`
  })

  // Always update the updated_at timestamp
  setClauses.push(`updated_at = NOW()`)

  const whereClauses = whereEntries.map(([key, value]) => {
    // Convert camelCase to snake_case for database columns
    const snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
    values.push(value)
    return `${snakeCaseKey} = $${paramIndex++}`
  })

  const query = `
    UPDATE ${table}
    SET ${setClauses.join(", ")}
    WHERE ${whereClauses.join(" AND ")}
    RETURNING *;
  `

  return { query, values }
}
