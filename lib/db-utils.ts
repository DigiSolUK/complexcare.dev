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
 * Executes a SQL query with a tenant_id filter.
 * This function is deprecated as authentication is not configured.
 * Direct SQL queries with tenant_id as a parameter should be used instead.
 * @deprecated
 */
export async function tenantQuery(query: string, params: any[] = [], tenantId: string): Promise<any[]> {
  // This function is deprecated. Direct SQL queries should be used.
  // For now, we'll just execute the query directly with the tenantId appended to params.
  // In a real scenario without authentication, tenantId would be passed explicitly to services.
  return await sql(query, [...params, tenantId])
}

/**
 * Builds an SQL UPDATE query string and its corresponding values.
 * @param tableName The name of the table to update.
 * @param data The object containing the data to update. Keys are column names, values are new values.
 * @param idColumn The name of the ID column (e.g., 'id').
 * @param idValue The value of the ID column for the row to update.
 * @returns An object containing the `query` string and `values` array.
 */
export function buildUpdateQuery(
  tableName: string,
  data: Record<string, any>,
  idColumn: string,
  idValue: string,
): { query: string; values: any[] } {
  const keys = Object.keys(data).filter((key) => data[key] !== undefined) // Filter out undefined values
  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`)
  const values = keys.map((key) => data[key])

  // Add the ID value to the end of the values array
  values.push(idValue)

  const query = `
    UPDATE ${tableName}
    SET ${setClauses.join(", ")}
    WHERE ${idColumn} = $${values.length}
    RETURNING *;
  `

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
    const { query, values } = buildUpdateQuery(tableName, data, "id", id)
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
