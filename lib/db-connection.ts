import { neon } from "@neondatabase/serverless"
import { AppError } from "@/lib/error-handler"

let connectionAttempts = 0
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // 1 second

export async function getDbConnection() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new AppError("DATABASE_URL environment variable is not set", 500, false, "critical")
  }

  try {
    const sql = neon(databaseUrl)

    // Test the connection
    await sql`SELECT 1`

    connectionAttempts = 0 // Reset on successful connection
    return sql
  } catch (error) {
    connectionAttempts++

    if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
      console.log(`Database connection attempt ${connectionAttempts} failed, retrying...`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return getDbConnection()
    }

    throw new AppError("Failed to connect to database after multiple attempts", 500, false, "critical")
  }
}

export async function executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
  try {
    const sql = await getDbConnection()
    const result = await sql.query(query, params)
    return result.rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new AppError("Database query failed", 500, false, "high")
  }
}

export async function executeTransaction<T = any>(queries: Array<{ query: string; params?: any[] }>): Promise<T[]> {
  const sql = await getDbConnection()

  try {
    await sql`BEGIN`

    const results: T[] = []

    for (const { query, params } of queries) {
      const result = await sql.query(query, params)
      results.push(...(result.rows as T[]))
    }

    await sql`COMMIT`
    return results
  } catch (error) {
    await sql`ROLLBACK`
    console.error("Transaction error:", error)
    throw new AppError("Transaction failed", 500, false, "high")
  }
}
