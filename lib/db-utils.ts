import { neon } from "@neondatabase/serverless"
import { sql } from "@neondatabase/serverless"
import { getAuth } from "@auth0/nextjs-auth0"
import { DEFAULT_TENANT_ID } from "@/lib/tenant-utils"

// Initialize the SQL client once
const db = neon(process.env.DATABASE_URL!)

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
export async function tenantQuery<T>(query: string, params: any[] = [], options?: { tenantId?: string }): Promise<T[]> {
  const { getSession } = getAuth()
  const session = await getSession()
  const userTenantId = session?.user?.tenantId

  const effectiveTenantId = options?.tenantId || userTenantId || DEFAULT_TENANT_ID

  if (!effectiveTenantId) {
    console.error("Error: No tenant ID available for tenantQuery.")
    return [] // Return an empty array if no tenant ID is available
  }

  // Ensure the query includes a tenant_id filter
  const tenantFilteredQuery = `${query} WHERE tenant_id = $${params.length + 1}`
  const allParams = [...params, effectiveTenantId]

  try {
    const result = await sql.query<T>(tenantFilteredQuery, allParams)
    return result.rows || [] // Ensure an array is always returned
  } catch (error) {
    console.error(`Error executing tenant-scoped query for tenant ${effectiveTenantId}:`, error)
    return [] // Return an empty array on error
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
export async function tenantInsert<T>(
  tableName: string,
  data: Partial<T>,
  options?: { tenantId?: string },
): Promise<T | null> {
  const { getSession } = getAuth()
  const session = await getSession()
  const userTenantId = session?.user?.tenantId

  const effectiveTenantId = options?.tenantId || userTenantId || DEFAULT_TENANT_ID

  if (!effectiveTenantId) {
    console.error("Error: No tenant ID available for tenantInsert.")
    return null
  }

  const columns = Object.keys(data)
  const values = Object.values(data)
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")

  const query = `INSERT INTO ${tableName} (${columns.join(", ")}, tenant_id) VALUES (${placeholders}, $${columns.length + 1}) RETURNING *`
  const allValues = [...values, effectiveTenantId]

  try {
    const result = await sql.query<T>(query, allValues)
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error inserting into ${tableName} for tenant ${effectiveTenantId}:`, error)
    return null
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
export async function tenantUpdate<T>(
  tableName: string,
  id: string,
  data: Partial<T>,
  options?: { tenantId?: string },
): Promise<T | null> {
  const { getSession } = getAuth()
  const session = await getSession()
  const userTenantId = session?.user?.tenantId

  const effectiveTenantId = options?.tenantId || userTenantId || DEFAULT_TENANT_ID

  if (!effectiveTenantId) {
    console.error("Error: No tenant ID available for tenantUpdate.")
    return null
  }

  const { query, values } = buildUpdateQuery(tableName, data, { id, tenant_id: effectiveTenantId })

  try {
    const result = await sql.query<T>(query, values)
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error updating ${tableName} (id: ${id}) for tenant ${effectiveTenantId}:`, error)
    return null
  }
}

/**
 * Deletes a record from a specified table for a given tenant and record ID.
 * @param tenantId The ID of the tenant.
 * @param table The name of the table.
 * @param id The ID of the record to delete.
 * @returns A boolean indicating if the deletion was successful.
 */
export async function tenantDelete(tableName: string, id: string, options?: { tenantId?: string }): Promise<boolean> {
  const { getSession } = getAuth()
  const session = await getSession()
  const userTenantId = session?.user?.tenantId

  const effectiveTenantId = options?.tenantId || userTenantId || DEFAULT_TENANT_ID

  if (!effectiveTenantId) {
    console.error("Error: No tenant ID available for tenantDelete.")
    return false
  }

  const query = `DELETE FROM ${tableName} WHERE id = $1 AND tenant_id = $2`
  const params = [id, effectiveTenantId]

  try {
    const result = await sql.query(query, params)
    return result.rowCount > 0
  } catch (error) {
    console.error(`Error deleting from ${tableName} (id: ${id}) for tenant ${effectiveTenantId}:`, error)
    return false
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
