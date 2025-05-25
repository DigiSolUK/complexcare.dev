import { createMigration } from "../lib/db/migration-framework"
import { program } from "commander"

program
  .name("create-migration")
  .description("Create a new migration file")
  .argument("<name>", "Migration name")
  .action(async (name) => {
    try {
      const filePath = await createMigration(name)
      console.log(`✓ Created migration: ${filePath}`)
    } catch (error) {
      console.error("Failed to create migration:", error)
      process.exit(1)
    }
  })

program.parse()
