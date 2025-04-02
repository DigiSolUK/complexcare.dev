import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL client with the database URL from environment variables
export const sql = neon(process.env.DATABASE_URL)

// Initialize the Drizzle ORM instance
export const db = drizzle(sql)

// Helper function for raw SQL queries using tagged template literals
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    // Convert to tagged template literal format
    const result = await sql`${query}`
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

