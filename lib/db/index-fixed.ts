import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// List of possible environment variables for database connection
const DB_ENV_VARS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "production_DATABASE_URL",
  "production_POSTGRES_URL",
  "AUTH_DATABASE_URL",
]

// Get the first available database URL
export function getDatabaseUrl(): string | null {
  for (const envVar of DB_ENV_VARS) {
    if (process.env[envVar] && process.env[envVar]!.trim() !== "") {
      return process.env[envVar]!
    }
  }
  return null
}

// Create a SQL client with the available database URL
let sqlClient: NeonQueryFunction<any, any> | null = null

export function getSqlClient(): NeonQueryFunction<any, any> | null {
  if (!sqlClient) {
    const dbUrl = getDatabaseUrl()
    if (dbUrl) {
      try {
        sqlClient = neon(dbUrl)
      } catch (error) {
        console.error("Failed to initialize database connection:", error)
      }
    }
  }
  return sqlClient
}

// Execute a query with proper error handling
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  const sql = getSqlClient()
  if (!sql) {
    console.warn("No database connection available, returning empty result")
    return []
  }

  try {
    const result = await sql(query, params)
    return result.rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    console.error("Query:", query)
    console.error("Params:", params)
    throw error
  }
}

// For compatibility with existing code
export const sql = getSqlClient()
export const db = null // Placeholder for drizzle if needed
