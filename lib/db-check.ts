import { sql } from "./db"

/**
 * Checks if the database connection is working
 * @returns {Promise<boolean>} True if the connection is working, false otherwise
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Try a simple query to check if the connection works
    await sql.query("SELECT 1")
    return true
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
  }
}

/**
 * Gets detailed information about the database connection
 * @returns {Promise<object>} Object with connection details
 */
export async function getDatabaseInfo(): Promise<{
  connected: boolean
  version?: string
  currentDatabase?: string
  error?: string
  missingEnvVars?: boolean
}> {
  try {
    const versionResult = await sql.query("SELECT version()")
    const dbNameResult = await sql.query("SELECT current_database()")

    return {
      connected: true,
      version: versionResult.rows[0]?.version,
      currentDatabase: dbNameResult.rows[0]?.current_database,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const missingEnvVars =
      errorMessage.includes("No database connection string") ||
      errorMessage.includes("not available") ||
      errorMessage.includes("environment variable has not been set")

    return {
      connected: false,
      error: errorMessage,
      missingEnvVars,
    }
  }
}
