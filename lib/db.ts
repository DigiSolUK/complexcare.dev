import { neon } from "@neondatabase/serverless"
import { sql } from "@vercel/postgres"

// Create a SQL client with your connection string
const neonClient = neon(process.env.DATABASE_URL!)

// Export the sql function for direct SQL queries
export { sql }

// Execute a query with parameters
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await neonClient(query, params)
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Get a single record by ID
export async function getById<T = any>(table: string, id: string): Promise<T | null> {
  try {
    const result = await executeQuery<T>(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [id])
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Error fetching ${table} with ID ${id}:`, error)
    throw error
  }
}

// Insert a record and return the created record
export async function insert<T = any>(table: string, data: Record<string, any>): Promise<T> {
  try {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")
    const columns = keys.join(", ")

    const query = `
      INSERT INTO ${table} (${columns}) 
      VALUES (${placeholders})
      RETURNING *
    `

    const result = await executeQuery<T>(query, values)
    return result[0]
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    throw error
  }
}

// Update a record and return the updated record
export async function update<T = any>(table: string, id: string, data: Record<string, any>): Promise<T> {
  try {
    const keys = Object.keys(data)
    const values = Object.values(data)

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ")

    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `

    const result = await executeQuery<T>(query, [...values, id])

    if (result.length === 0) {
      throw new Error(`Record with ID ${id} not found in ${table}`)
    }

    return result[0]
  } catch (error) {
    console.error(`Error updating ${table} with ID ${id}:`, error)
    throw error
  }
}

// Delete a record (soft delete if deleted_at column exists)
export async function remove(table: string, id: string): Promise<boolean> {
  try {
    // Check if the table has a deleted_at column
    const tableInfo = await executeQuery(
      `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1 AND column_name = 'deleted_at'
    `,
      [table],
    )

    let query
    if (tableInfo.length > 0) {
      // Soft delete
      query = `
        UPDATE ${table}
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id
      `
    } else {
      // Hard delete
      query = `
        DELETE FROM ${table}
        WHERE id = $1
        RETURNING id
      `
    }

    const result = await executeQuery(query, [id])
    return result.length > 0
  } catch (error) {
    console.error(`Error deleting from ${table} with ID ${id}:`, error)
    throw error
  }
}
