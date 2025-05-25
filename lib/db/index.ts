import { neon, type NeonDatabase } from "@neondatabase/serverless"

// Use production_DATABASE_URL if available, otherwise fallback to DATABASE_URL
const databaseUrl = process.env.production_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable not set")
}

// Create a SQL client with the database URL from environment variables
const sql: NeonDatabase = neon(databaseUrl)

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
