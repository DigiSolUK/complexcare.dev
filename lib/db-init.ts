import { sql } from "./db-manager"

export async function initializeDatabase() {
  try {
    // Check if the database is accessible
    const result = await sql.query("SELECT 1 as health_check")

    if (result.rows && result.rows.length > 0) {
      console.log("Database connection successful")
      return true
    } else {
      console.error("Database query returned no results")
      return false
    }
  } catch (error) {
    console.error("Database initialization failed:", error)
    return false
  }
}
