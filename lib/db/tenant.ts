import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Execute a query for a specific tenant using tagged template literals
export async function tenantQuery<T>(tenantId: string, queryText: string, params: any[] = []): Promise<T[]> {
  try {
    const query = queryText
    const values = [...params]

    const result = await sql`${query}`
    return result as T[]
  } catch (error) {
    console.error("Error executing tenant query:", error)
    return [] as T[]
  }
}

// Insert a record for a specific tenant
export async function tenantInsert<T>(tenantId: string, table: string, data: any): Promise<T[]> {
  try {
    if (!data.id) {
      data.id = uuidv4()
    }
    data.tenant_id = tenantId

    const result = await sql`
      INSERT INTO ${sql.identifier(table)} (${sql.unsafe(Object.keys(data).join(", "))})
      VALUES (${sql.unsafe(
        Object.values(data)
          .map((v) => `$${Object.values(data).indexOf(v) + 1}`)
          .join(", "),
      )})
      RETURNING *
    `
    return result as T[]
  } catch (error) {
    console.error("Error executing tenant insert:", error)
    return [] as T[]
  }
}

// Update a record for a specific tenant
export async function tenantUpdate<T>(tenantId: string, table: string, id: string, data: any): Promise<T[]> {
  try {
    const updateFields = Object.entries(data)
      .map(([key, value]) => `${sql.identifier(key)} = $${Object.entries(data).indexOf([key, value]) + 1}`)
      .join(", ")

    const result = await sql`
      UPDATE ${sql.identifier(table)}
      SET ${sql.unsafe(updateFields)}
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `
    return result as T[]
  } catch (error) {
    console.error("Error executing tenant update:", error)
    return [] as T[]
  }
}

// Delete a record for a specific tenant
export async function tenantDelete<T>(tenantId: string, table: string, id: string): Promise<T[]> {
  try {
    const result = await sql`
      DELETE FROM ${sql.identifier(table)}
      WHERE tenant_id = ${tenantId} AND id = ${id}
      RETURNING *
    `
    return result as T[]
  } catch (error) {
    console.error("Error executing tenant delete:", error)
    return [] as T[]
  }
}
