import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL client with the database URL from environment variables
// Use a fallback empty string if DATABASE_URL is not defined
const dbUrl = process.env.DATABASE_URL || ""

// Initialize the SQL client with error handling
// Create a SQL tag that uses the DATABASE_URL environment variable
// or returns a mock function if it's not available
export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : {
      // Mock SQL function that returns empty results
      query: async () => ({ rows: [] }),
      // Support for template literals
      async(...args: any[]) {
        console.warn("No database connection string provided. Using mock data instead.")
        return { rows: [] }
      },
    }

// Initialize the Drizzle ORM instance if possible
export const db = (() => {
  try {
    if (dbUrl) {
      return drizzle(sql)
    }
    // Return a mock db object
    return {} as any
  } catch (error) {
    console.error("Error initializing Drizzle:", error)
    return {} as any
  }
})()

// Helper function for raw SQL queries using tagged template literals
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    // If we don't have a valid SQL client, return an empty array
    if (typeof sql !== "function") {
      console.warn("SQL client not initialized, returning empty results")
      return []
    }

    // Convert to tagged template literal format
    const result = await (sql as any)`${query}`
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    // Return empty array on error
    return []
  }
}

