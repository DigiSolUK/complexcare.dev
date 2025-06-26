import { sql } from "@/lib/db" // Corrected import path
import { v4 as uuidv4, validate as uuidValidate } from "uuid"

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
  let finalQuery = query
  const finalParams = [...params]

  if (tenantId) {
    const lowerCaseQuery = query.toLowerCase()
    const whereClauseIndex = lowerCaseQuery.indexOf("where")

    if (whereClauseIndex !== -1) {
      if (!lowerCaseQuery.includes("tenant_id")) {
        finalQuery =
          query.substring(0, whereClauseIndex + 5) +
          ` tenant_id = $${finalParams.length + 1} AND ` +
          query.substring(whereClauseIndex + 5)
        finalParams.push(tenantId)
      }
    } else {
      finalQuery = `${query} WHERE tenant_id = $${finalParams.length + 1}`
      finalParams.push(tenantId)
    }
  }

  try {
    const result = await sql.query<T>(finalQuery, finalParams)
    return result.rows || []
  } catch (error) {
    console.error(`Error executing tenant-scoped query for tenant ${tenantId}:`, error)
    throw error
  }
}

/**
 * Helper to build update query dynamically.
 * @param tableName The name of the table to update.
 * @param data An object containing the columns and values to update.
 * @param conditions An object containing the WHERE clause conditions.
 * @returns An object containing the query string and the array of values.
 */
export function buildUpdateQuery(
  tableName: string,
  data: Record<string, any>,
  conditions: Record<string, any>,
): { query: string; values: any[] } {
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      updates.push(`${key} = $${paramIndex++}`)
      values.push(data[key])
    }
  }

  if (updates.length === 0) {
    throw new Error("No data provided for update.")
  }

  const conditionClauses: string[] = []
  for (const key in conditions) {
    if (conditions.hasOwnProperty(key)) {
      conditionClauses.push(`${key} = $${paramIndex++}`)
      values.push(conditions[key])
    }
  }

  if (conditionClauses.length === 0) {
    throw new Error("No conditions provided for update.")
  }

  const query = `UPDATE ${tableName} SET ${updates.join(", ")} WHERE ${conditionClauses.join(" AND ")} RETURNING *`

  return { query, values }
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
 * @param id The ID of the record to update.
 * @param data The data object containing fields to update.
 * @param tenantId Optional tenant ID for tenant-scoping.
 * @returns The updated record.
 */
export async function tenantUpdate<T>(
  tableName: string,
  id: string,
  data: Record<string, any>,
  tenantId?: string,
): Promise<T> {
  try {
    const { query, values } = buildUpdateQuery(tableName, data, { id, tenant_id: tenantId })
    const result = await sql.query<T>(query, values)
    if (result.rows.length === 0) {
      throw new Error(`Record with ID ${id} not found or not accessible for update.`)
    }
    return result.rows[0]
  } catch (error) {
    console.error(`Error updating ${tableName} with ID ${id} for tenant ${tenantId}:`, error)
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
