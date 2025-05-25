// Simple migration runner without external dependencies
import { executeMigration, checkColumnExists } from "../lib/db/migration-utils"

async function runMigrations() {
  console.log("Running database migrations...")

  // Add duration column to appointments
  const durationExists = await checkColumnExists("appointments", "duration")
  if (!durationExists) {
    const result = await executeMigration(
      `
      ALTER TABLE appointments 
      ADD COLUMN duration INTEGER DEFAULT 30 NOT NULL;
      COMMENT ON COLUMN appointments.duration IS 'Duration of the appointment in minutes';
    `,
      "Add duration column to appointments",
    )

    console.log(result.message)
  } else {
    console.log("✓ Duration column already exists in appointments table")
  }

  // Add status column to clinical_notes
  const statusExists = await checkColumnExists("clinical_notes", "status")
  if (!statusExists) {
    const result = await executeMigration(
      `
      ALTER TABLE clinical_notes 
      ADD COLUMN status VARCHAR(50) DEFAULT 'draft' NOT NULL;
      COMMENT ON COLUMN clinical_notes.status IS 'Status of the clinical note (draft, submitted, approved, etc.)';
    `,
      "Add status column to clinical_notes",
    )

    console.log(result.message)
  } else {
    console.log("✓ Status column already exists in clinical_notes table")
  }

  // Add priority column to tasks
  const priorityExists = await checkColumnExists("tasks", "priority")
  if (!priorityExists) {
    const result = await executeMigration(
      `
      ALTER TABLE tasks 
      ADD COLUMN priority VARCHAR(20) DEFAULT 'medium' NOT NULL;
      COMMENT ON COLUMN tasks.priority IS 'Priority level of the task (low, medium, high, urgent)';
    `,
      "Add priority column to tasks",
    )

    console.log(result.message)
  } else {
    console.log("✓ Priority column already exists in tasks table")
  }

  console.log("\n✅ Migration check completed!")
}

// Run migrations
runMigrations().catch((error) => {
  console.error("Migration script failed:", error)
})
