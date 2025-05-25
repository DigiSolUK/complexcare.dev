import type { NeonDatabase } from "@neondatabase/serverless"

export async function up(sql: NeonDatabase): Promise<void> {
  // Add compliance_status column to credentials table
  await sql`
    ALTER TABLE credentials 
    ADD COLUMN IF NOT EXISTS compliance_status VARCHAR(50) DEFAULT 'pending'
  `

  // Add index for better query performance
  await sql`
    CREATE INDEX IF NOT EXISTS idx_credentials_compliance_status 
    ON credentials(compliance_status)
  `
}

export async function down(sql: NeonDatabase): Promise<void> {
  // Drop the index
  await sql`
    DROP INDEX IF EXISTS idx_credentials_compliance_status
  `

  // Remove the column
  await sql`
    ALTER TABLE credentials 
    DROP COLUMN IF EXISTS compliance_status
  `
}
