import type { NeonDatabase } from "@neondatabase/serverless"

export async function up(sql: NeonDatabase): Promise<void> {
  // Check if the column already exists to make the migration idempotent
  const columnExists = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'appointments'
      AND column_name = 'duration'
    ) as exists
  `

  if (!columnExists[0].exists) {
    // Add the duration column with a default value of 30 minutes
    await sql`
      ALTER TABLE appointments 
      ADD COLUMN duration INTEGER DEFAULT 30 NOT NULL;
    `

    // Add a comment to the column for documentation
    await sql`
      COMMENT ON COLUMN appointments.duration IS 'Duration of the appointment in minutes';
    `

    console.log("✅ Added duration column to appointments table")
  } else {
    console.log("ℹ️ Duration column already exists in appointments table")
  }
}

export async function down(sql: NeonDatabase): Promise<void> {
  // Check if the column exists before trying to drop it
  const columnExists = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'appointments'
      AND column_name = 'duration'
    ) as exists
  `

  if (columnExists[0].exists) {
    // Remove the duration column
    await sql`
      ALTER TABLE appointments 
      DROP COLUMN duration;
    `
    console.log("✅ Removed duration column from appointments table")
  } else {
    console.log("ℹ️ Duration column does not exist in appointments table")
  }
}
