import { neon, type NeonDatabase } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { getDatabaseUrl } from "../env-safe"

// Get database URL from environment variables using the safe accessor
const databaseUrl = getDatabaseUrl()

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable not set")
}

// Create a SQL client with the database URL from environment variables
const sql: NeonDatabase = neon(databaseUrl)

// Initialize the Drizzle ORM instance
export const db = drizzle(sql)

// Helper function for raw SQL queries using tagged template literals
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    // Convert to tagged template literal format
    const result = await sql.query(query, params)
    return result.rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export { sql }
