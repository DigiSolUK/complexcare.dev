import { neon, type NeonDatabase } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Use production_DATABASE_URL if available, otherwise fallback to DATABASE_URL
const databaseUrl = process.env.production_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn("DATABASE_URL environment variable not set, using demo data")
}

// Create a SQL client with the database URL from environment variables
const sql: NeonDatabase = databaseUrl ? neon(databaseUrl) : null

// Initialize the Drizzle ORM instance if we have a database URL
export const db = databaseUrl ? drizzle(sql) : null

// Helper function for raw SQL queries using tagged template literals
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    if (!sql) {
      console.warn("Database not configured, returning empty result")
      return []
    }

    // Convert to tagged template literal format
    const result = await sql.query(query, params)
    return result.rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export { sql }
