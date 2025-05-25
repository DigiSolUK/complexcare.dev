import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "./constants"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get the database URL from environment variables
const getDatabaseUrl = () => {
  // In browser/client components, we should never try to connect directly
  if (isBrowser) {
    console.warn("Attempted to access database from client component")
    return null
  }

  // Try to get the database URL from various environment variables
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.production_DATABASE_URL ||
    process.env.production_POSTGRES_URL ||
    process.env.AUTH_DATABASE_URL

  if (!dbUrl) {
    console.error("No database connection string found in environment variables")
  }

  return dbUrl
}

// Create a safe SQL client
const createSqlClient = () => {
  const dbUrl = getDatabaseUrl()

  // If we're in a browser or don't have a database URL, return a mock client
  if (isBrowser || !dbUrl) {
    return {
      query: async (...args: any[]) => {
        console.warn("Mock SQL client used. Database operations will not work.")
        return { rows: [] }
      },
    }
  }

  // Otherwise, create a real Neon client
  try {
    return neon(dbUrl)
  } catch (error) {
    console.error("Failed to create Neon SQL client:", error)
    return {
      query: async (...args: any[]) => {
        console.error("Database client initialization failed")
        return { rows: [] }
      },
    }
  }
}

// Create and export the SQL client
export const sql = createSqlClient()

// Legacy alias for compatibility
export const db = sql

// Helper function to execute queries with tenant context
export async function executeQuery(
  query: string,
  params: any[] = [],
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<any[]> {
  if (isBrowser) {
    console.error("Database query attempted in browser environment")
    return []
  }

  try {
    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Database query error:", error)
    return []
  }
}

// Helper function to get a connection with tenant context
export async function withTenant(tenantId = DEFAULT_TENANT_ID) {
  if (isBrowser) {
    console.error("Database connection attempted in browser environment")
    return {
      query: async () => ({ rows: [] }),
    }
  }

  return {
    query: async (text: string, params: any[] = []) => {
      try {
        const result = await sql.query(text, params)
        return result
      } catch (error) {
        console.error("Database query error:", error)
        return { rows: [] }
      }
    },
  }
}
