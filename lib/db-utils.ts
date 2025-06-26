import { sql } from "@neondatabase/serverless"
import { v4 as uuidv4, validate as uuidValidate } from "uuid"

// Helper to validate UUIDs
export function isValidUUID(uuid: string): boolean {
  return uuidValidate(uuid)
}

// Tenant-scoped query function
export async function tenantQuery<T>(query: string, params: any[] = [], tenantId?: string): Promise<T[]> {
  try {
    let finalQuery = query
    const finalParams = [...params]

    if (tenantId) {
      // Assuming the first parameter is always the tenant_id for tenant-scoped queries
      // This is a convention, adjust if your queries handle tenant_id differently
      finalParams.unshift(tenantId)
      // Adjust query to include tenant_id filter if not already present
      // This is a simplistic approach; for complex queries, you might need more sophisticated parsing
      if (!query.includes("tenant_id = $1")) {
        const whereClauseIndex = query.toLowerCase().indexOf("where")
        if (whereClauseIndex !== -1) {
          finalQuery =
            query.substring(0, whereClauseIndex + 5) + "tenant_id = $1 AND " + query.substring(whereClauseIndex + 5)
        } else {
          finalQuery = `${query} WHERE tenant_id = $1`
        }
      }
    }

    // Use sql.query for parameterized queries
    const result = await sql.query<T>(finalQuery, finalParams)
    return result.rows || [] // Ensure it always returns an array
  } catch (error) {
    console.error(`Error executing tenant-scoped query for tenant ${tenantId}:`, error)
    throw error
  }
}

// Helper to build update query dynamically
export function buildUpdateQuery(
  tableName: string,
  id: string,
  data: Record<string, any>,
  tenantId?: string,
): { query: string; params: any[] } {
  const updates: string[] = []
  const params: any[] = []
  let paramIndex = 1

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      updates.push(`${key} = $${paramIndex++}`)
      params.push(data[key])
    }
  }

  if (updates.length === 0) {
    throw new Error("No data provided for update.")
  }

  let query = `UPDATE ${tableName} SET ${updates.join(", ")} WHERE id = $${paramIndex++}`
  params.push(id)

  if (tenantId) {
    query += ` AND tenant_id = $${paramIndex++}`
    params.push(tenantId)
  }

  query += " RETURNING *" // Return the updated row

  return { query, params }
}

// Tenant-scoped insert function
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

// Tenant-scoped update function
export async function tenantUpdate<T>(
  tableName: string,
  id: string,
  data: Record<string, any>,
  tenantId?: string,
): Promise<T> {
  try {
    const { query, params } = buildUpdateQuery(tableName, id, data, tenantId)
    const result = await sql.query<T>(query, params)
    if (result.rows.length === 0) {
      throw new Error(`Record with ID ${id} not found or not accessible for update.`)
    }
    return result.rows[0]
  } catch (error) {
    console.error(`Error updating ${tableName} with ID ${id} for tenant ${tenantId}:`, error)
    throw error
  }
}

// Tenant-scoped delete function
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
