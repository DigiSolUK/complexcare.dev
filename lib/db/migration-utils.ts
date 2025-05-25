// Simple migration utilities without external dependencies
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function executeMigration(
  migrationSql: string,
  description: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await sql.raw(migrationSql)
    return {
      success: true,
      message: `✅ Migration successful: ${description}`,
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Migration failed: ${description}\nError: ${error}`,
    }
  }
}

export async function checkColumnExists(table: string, column: string): Promise<boolean> {
  const result = await sql`
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = ${table}
    AND column_name = ${column}
  `

  return result.length > 0
}
