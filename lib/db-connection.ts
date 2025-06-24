import { neon } from "@neondatabase/serverless"
import { AppError } from "@/lib/error-handler"

let connectionAttempts = 0
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1500 // Slightly increased delay

// Function to get the first available database URL from a list of env vars
function getDatabaseUrl(): string {
  console.log("Attempting to find database URL for db-connection...")
  const possibleEnvVars = [
    "production_DATABASE_URL", // Highest priority for production
    "DATABASE_URL",
    "POSTGRES_URL",
    "production_POSTGRES_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL_NON_POOLING",
    "production_DATABASE_URL_UNPOOLED",
    "production_POSTGRES_URL_NON_POOLING",
    "AUTH_DATABASE_URL",
  ]

  for (const envVar of possibleEnvVars) {
    const value = process.env[envVar]
    if (value && value.trim() !== "") {
      console.log(`Using database connection string from environment variable: ${envVar}`)
      // Mask the password in the log
      const maskedValue = value.replace(/:([^:@\s]+)@/, ":********@")
      console.log(`DB URL (masked): ${maskedValue.substring(0, 60)}...`)
      return value
    }
  }

  console.error("CRITICAL: No suitable database connection string found in environment variables for db-connection.")
  console.error("Checked for:", possibleEnvVars.join(", "))
  // This will be caught by the AppError below if not found
  return ""
}

export async function getDbConnection() {
  const startTime = Date.now()
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    console.error("DATABASE_URL resolution failed. Cannot connect.")
    throw new AppError("DATABASE_URL environment variable is not properly configured or found.", 500, false, "critical")
  }

  try {
    console.log(`Attempting database connection (Attempt: ${connectionAttempts + 1}).`)
    const sql = neon(databaseUrl, {
      // Consider adding options like connectionTimeoutMillis if available and relevant
      // For Neon serverless, it's usually about quick connections.
    })

    // Test the connection
    await sql`SELECT 1`
    const duration = Date.now() - startTime
    console.log(`Database connection successful. (Attempt: ${connectionAttempts + 1}, Duration: ${duration}ms)`)
    connectionAttempts = 0 // Reset on successful connection
    return sql
  } catch (error: any) {
    connectionAttempts++
    const duration = Date.now() - startTime
    console.error(`Database connection attempt ${connectionAttempts} failed. (Duration: ${duration}ms)`)
    console.error("Connection Error Details:", error.message, error.stack ? `\nStack: ${error.stack}` : "")

    if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
      console.log(`Retrying database connection in ${RETRY_DELAY / 1000}s...`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return getDbConnection() // Recursive call for retry
    }

    console.error("Failed to connect to database after multiple attempts.")
    throw new AppError(
      `Failed to connect to database after ${MAX_RETRY_ATTEMPTS} attempts. Last error: ${error.message}`,
      500,
      false,
      "critical",
    )
  }
}

export async function executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
  const queryStartTime = Date.now()
  let sql
  try {
    sql = await getDbConnection()
  } catch (connectionError) {
    // getDbConnection already logs and throws an AppError
    console.error("executeQuery: Failed to get database connection. Aborting query.")
    throw connectionError // Re-throw the AppError from getDbConnection
  }

  try {
    // Basic query logging (can be made more sophisticated or conditional)
    console.log(`Executing query: ${query.substring(0, 100)}${query.length > 100 ? "..." : ""}`)
    if (params && params.length > 0) {
      console.log(`Query params: ${JSON.stringify(params)}`)
    }

    const result = await sql.query(query, params)
    const queryDuration = Date.now() - queryStartTime
    console.log(`Query executed successfully. (Duration: ${queryDuration}ms, Rows: ${result.rowCount})`)
    return result.rows as T[]
  } catch (error: any) {
    const queryDuration = Date.now() - queryStartTime
    console.error(`Database query error. (Duration: ${queryDuration}ms)`)
    console.error("Query Failed:", query.substring(0, 200) + (query.length > 200 ? "..." : ""))
    if (params && params.length > 0) {
      console.error("Query Params at Failure:", JSON.stringify(params))
    }
    console.error("Query Error Details:", error.message, error.stack ? `\nStack: ${error.stack}` : "")
    throw new AppError(`Database query failed: ${error.message}`, 500, false, "high")
  }
}

export async function executeTransaction<T = any>(queries: Array<{ query: string; params?: any[] }>): Promise<T[]> {
  const transactionStartTime = Date.now()
  let sql
  try {
    sql = await getDbConnection()
  } catch (connectionError) {
    console.error("executeTransaction: Failed to get database connection. Aborting transaction.")
    throw connectionError
  }

  console.log(`Starting transaction with ${queries.length} queries.`)
  try {
    // Note: @neondatabase/serverless driver's `sql` object from `neon()` is also a function
    // that can execute transactions using `sql.transaction()`.
    // However, the existing code uses BEGIN/COMMIT manually. We'll stick to that for now
    // but be aware of the driver's built-in transaction helper for future refactoring.

    await sql`BEGIN`
    console.log("Transaction BEGIN successful.")

    const results: T[] = []

    for (let i = 0; i < queries.length; i++) {
      const { query, params } = queries[i]
      const queryStartTime = Date.now()
      console.log(
        `Executing transaction query ${i + 1}/${queries.length}: ${query.substring(0, 100)}${query.length > 100 ? "..." : ""}`,
      )
      if (params && params.length > 0) {
        console.log(`Transaction Query ${i + 1} params: ${JSON.stringify(params)}`)
      }

      const result = await sql.query(query, params)
      results.push(...(result.rows as T[]))
      const queryDuration = Date.now() - queryStartTime
      console.log(
        `Transaction query ${i + 1} executed successfully. (Duration: ${queryDuration}ms, Rows: ${result.rowCount})`,
      )
    }

    await sql`COMMIT`
    const transactionDuration = Date.now() - transactionStartTime
    console.log(`Transaction COMMIT successful. (Total Duration: ${transactionDuration}ms)`)
    return results
  } catch (error: any) {
    const transactionDuration = Date.now() - transactionStartTime
    console.error(`Transaction error. (Duration: ${transactionDuration}ms)`)
    console.error("Transaction Error Details:", error.message, error.stack ? `\nStack: ${error.stack}` : "")
    try {
      console.log("Attempting to ROLLBACK transaction...")
      await sql`ROLLBACK`
      console.log("Transaction ROLLBACK successful.")
    } catch (rollbackError: any) {
      console.error("Failed to ROLLBACK transaction:", rollbackError.message)
    }
    throw new AppError(`Transaction failed: ${error.message}`, 500, false, "high")
  }
}
