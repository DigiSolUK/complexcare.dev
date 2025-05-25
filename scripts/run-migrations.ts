// Simple migration runner without commander
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function runMigrations() {
  console.log("Running database migrations...")

  try {
    // Add duration column to appointments
    await sql`
      DO $$
      BEGIN
         IF NOT EXISTS (
             SELECT 1
             FROM information_schema.columns
             WHERE table_name = 'appointments'
             AND column_name = 'duration'
         ) THEN
             ALTER TABLE appointments 
             ADD COLUMN duration INTEGER DEFAULT 30 NOT NULL;
             COMMENT ON COLUMN appointments.duration IS 'Duration of the appointment in minutes';
             RAISE NOTICE 'Duration column added to appointments table';
         ELSE
             RAISE NOTICE 'Duration column already exists in appointments table';
         END IF;
      END $$;
    `
    console.log("✓ Added duration column to appointments table")

    // Add status column to clinical_notes
    await sql`
      DO $$
      BEGIN
         IF NOT EXISTS (
             SELECT 1
             FROM information_schema.columns
             WHERE table_name = 'clinical_notes'
             AND column_name = 'status'
         ) THEN
             ALTER TABLE clinical_notes 
             ADD COLUMN status VARCHAR(50) DEFAULT 'draft' NOT NULL;
             COMMENT ON COLUMN clinical_notes.status IS 'Status of the clinical note (draft, submitted, approved, etc.)';
             RAISE NOTICE 'Status column added to clinical_notes table';
         ELSE
             RAISE NOTICE 'Status column already exists in clinical_notes table';
         END IF;
      END $$;
    `
    console.log("✓ Added status column to clinical_notes table")

    // Add priority column to tasks
    await sql`
      DO $$
      BEGIN
         IF NOT EXISTS (
             SELECT 1
             FROM information_schema.columns
             WHERE table_name = 'tasks'
             AND column_name = 'priority'
         ) THEN
             ALTER TABLE tasks 
             ADD COLUMN priority VARCHAR(20) DEFAULT 'medium' NOT NULL;
             COMMENT ON COLUMN tasks.priority IS 'Priority level of the task (low, medium, high, urgent)';
             RAISE NOTICE 'Priority column added to tasks table';
         ELSE
             RAISE NOTICE 'Priority column already exists in tasks table';
         END IF;
      END $$;
    `
    console.log("✓ Added priority column to tasks table")

    console.log("\n✅ All migrations completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
}

export { runMigrations }
