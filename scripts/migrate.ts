import { MigrationRunner } from "../lib/db/migration-framework"
import { program } from "commander"

const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is required")
  process.exit(1)
}

const runner = new MigrationRunner(databaseUrl)

program.name("migrate").description("Database migration tool for ComplexCare CRM").version("1.0.0")

program
  .command("up")
  .description("Run all pending migrations")
  .option("--dry-run", "Show what would be executed without making changes")
  .action(async (options) => {
    try {
      await runner.runPendingMigrations(options.dryRun)
    } catch (error) {
      console.error("Migration failed:", error)
      process.exit(1)
    }
  })

program
  .command("down")
  .description("Rollback the last migration")
  .option("--dry-run", "Show what would be rolled back without making changes")
  .action(async (options) => {
    try {
      await runner.rollbackLastMigration(options.dryRun)
    } catch (error) {
      console.error("Rollback failed:", error)
      process.exit(1)
    }
  })

program
  .command("status")
  .description("Show migration status")
  .action(async () => {
    try {
      const status = await runner.getStatus()

      console.log("\nExecuted migrations:")
      if (status.executed.length === 0) {
        console.log("  None")
      } else {
        status.executed.forEach((m) => {
          console.log(`  ✓ ${m.id} (executed at ${m.executed_at})`)
        })
      }

      console.log("\nPending migrations:")
      if (status.pending.length === 0) {
        console.log("  None")
      } else {
        status.pending.forEach((m) => {
          console.log(`  - ${m.id}`)
        })
      }

      if (status.locked) {
        console.log("\n⚠️  Migrations are currently locked")
      }
    } catch (error) {
      console.error("Failed to get status:", error)
      process.exit(1)
    }
  })

program
  .command("validate")
  .description("Validate migration checksums")
  .action(async () => {
    try {
      const result = await runner.validateChecksums()

      if (result.valid) {
        console.log("✓ All migration checksums are valid")
      } else {
        console.error("✗ Migration checksum mismatches found:")
        result.mismatches.forEach((m) => console.error(`  - ${m}`))
        process.exit(1)
      }
    } catch (error) {
      console.error("Validation failed:", error)
      process.exit(1)
    }
  })

program.parse()
