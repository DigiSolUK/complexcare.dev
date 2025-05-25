// Simple schema validator without any external dependencies
import { neon } from "@neondatabase/serverless"

// Types
export type SchemaMismatch = {
  type: string
  entity: string
  expected: string
  actual: string | null
  severity: "high" | "medium" | "low"
  suggestion: string
}

export type ValidationResult = {
  isValid: boolean
  timestamp: string
  mismatches: SchemaMismatch[]
}

// Connect to database
const sql = neon(process.env.DATABASE_URL || "")

// Validate database schema
export async function validateDatabaseSchema(): Promise<ValidationResult> {
  const timestamp = new Date().toISOString()
  const mismatches: SchemaMismatch[] = []

  try {
    // Check if required tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const tableNames = tables.map((t: any) => t.table_name)

    // Define expected tables
    const expectedTables = ["patients", "appointments", "clinical_notes", "tasks", "care_professionals", "medications"]

    // Check for missing tables
    for (const table of expectedTables) {
      if (!tableNames.includes(table)) {
        mismatches.push({
          type: "missing_table",
          entity: table,
          expected: `Table '${table}' should exist`,
          actual: null,
          severity: "high",
          suggestion: `CREATE TABLE ${table} (...)`,
        })
      }
    }

    // Check for required columns in existing tables
    for (const table of expectedTables) {
      if (tableNames.includes(table)) {
        const columns = await sql`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = ${table}
        `

        const columnNames = columns.map((c: any) => c.column_name)

        // Define expected columns for each table
        const expectedColumns: Record<string, Record<string, string>> = {
          patients: {
            id: "uuid",
            first_name: "character varying",
            last_name: "character varying",
            date_of_birth: "date",
            nhs_number: "character varying",
          },
          appointments: {
            id: "uuid",
            patient_id: "uuid",
            provider_id: "uuid",
            start_time: "timestamp with time zone",
            duration: "integer",
          },
          clinical_notes: {
            id: "uuid",
            patient_id: "uuid",
            author_id: "uuid",
            content: "text",
            created_at: "timestamp with time zone",
            status: "character varying",
          },
          tasks: {
            id: "uuid",
            title: "character varying",
            description: "text",
            due_date: "timestamp with time zone",
            priority: "character varying",
          },
          care_professionals: {
            id: "uuid",
            first_name: "character varying",
            last_name: "character varying",
            role: "character varying",
            email: "character varying",
          },
          medications: {
            id: "uuid",
            patient_id: "uuid",
            name: "character varying",
            dosage: "character varying",
            frequency: "character varying",
          },
        }

        // Check for missing columns
        if (expectedColumns[table]) {
          for (const [colName, colType] of Object.entries(expectedColumns[table])) {
            if (!columnNames.includes(colName)) {
              mismatches.push({
                type: "missing_column",
                entity: `${table}.${colName}`,
                expected: `Column '${colName}' of type '${colType}' should exist in table '${table}'`,
                actual: null,
                severity: "medium",
                suggestion: `ALTER TABLE ${table} ADD COLUMN ${colName} ${colType};`,
              })
            }
          }
        }
      }
    }

    return {
      isValid: mismatches.length === 0,
      timestamp,
      mismatches,
    }
  } catch (error) {
    console.error("Error validating schema:", error)
    return {
      isValid: false,
      timestamp,
      mismatches: [
        {
          type: "error",
          entity: "database_connection",
          expected: "Database connection should be successful",
          actual: String(error),
          severity: "high",
          suggestion: "Check database connection string and credentials",
        },
      ],
    }
  }
}

// Generate SQL to fix schema issues
export function generateFixSql(mismatches: SchemaMismatch[]): string {
  return mismatches
    .filter(
      (m) =>
        (m.suggestion && m.suggestion.trim().startsWith("ALTER TABLE")) ||
        m.suggestion.trim().startsWith("CREATE TABLE"),
    )
    .map((m) => m.suggestion)
    .join("\n\n")
}
