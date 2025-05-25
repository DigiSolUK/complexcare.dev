import { MigrationRunner } from "../lib/db/migration-framework"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required")
    process.exit(1)
  }

  try {
    console.log("Running migration to add duration column to appointments table...")
    const runner = new MigrationRunner(databaseUrl)

    // Ensure migrations table exists
    await runner.ensureMigrationsTable()

    // Run the specific migration
    const migrations = await runner.loadMigrations()
    const durationMigration = migrations.find((m) => m.id.includes("add_duration_to_appointments"))

    if (!durationMigration) {
      throw new Error("Duration migration not found")
    }

    await runner.runMigration(durationMigration)

    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

runMigration()
