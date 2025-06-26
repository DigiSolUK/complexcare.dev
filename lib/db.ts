import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

/**
 * Executes a SQL query using the Neon client.
 * This is a generic wrapper for direct SQL execution with parameterized queries.
 * @param query The SQL query string with placeholders ($1, $2, etc.).
 * @param params Optional array of parameters for the SQL query.
 * @returns The result of the SQL query.
 */
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  try {
    // Use sql.query for conventional function calls with value placeholders ($1, $2, etc.)
    const result = await sql.query<T>(query, params)
    return result.rows // sql.query returns { rows: [], fields: [] }
  } catch (error) {
    console.error("Database query execution failed:", error)
    throw new Error("Failed to execute database query.")
  }
}
