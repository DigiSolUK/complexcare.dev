import { addComplianceStatusColumn } from "../lib/db/migrations/add-compliance-status"

async function runMigrations() {
  console.log("Running database migrations...")

  // Run the compliance status column migration
  const result = await addComplianceStatusColumn()
  console.log(result.message)

  console.log("All migrations completed")
}

runMigrations().catch((error) => {
  console.error("Migration script failed:", error)
  process.exit(1)
})
