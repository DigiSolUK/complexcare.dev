import { neon } from "@neondatabase/serverless"

// Initialize the Neon client
// It's recommended to create a single instance and reuse it across your application
// For serverless functions, a new connection might be established per invocation,
// but the underlying connection pooling by Neon handles this efficiently.
const sql = neon(process.env.DATABASE_URL!)

export { sql }

/**
 * Executes a SQL query using the Neon client.
 * This is a generic wrapper for direct SQL execution.
 * @param query The SQL query string.
 * @param params Optional array of parameters for the SQL query.
 * @returns The result of the SQL query.
 */
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql<T[]>(query, params)
    return result
  } catch (error) {
    console.error("Database query execution failed:", error)
    throw new Error("Failed to execute database query.")
  }
}
