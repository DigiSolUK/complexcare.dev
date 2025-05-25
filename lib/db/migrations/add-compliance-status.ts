import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

export async function addComplianceStatusColumn() {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    console.log("Starting migration: Adding compliance_status column to credentials table")

    // Read the SQL file
    const migrationSql = fs.readFileSync(
      path.join(process.cwd(), "migrations", "002-add-compliance-status-column.sql"),
      "utf8",
    )

    // Execute the migration
    await sql.query(migrationSql)

    console.log("Migration completed successfully")
    return { success: true, message: "Migration completed successfully" }
  } catch (error) {
    console.error("Migration failed:", error)
    return { success: false, message: `Migration failed: ${error instanceof Error ? error.message : String(error)}` }
  }
}
