import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  const results = {
    connection: false,
    databaseInfo: null as any,
    tables: [] as any[],
    relationships: [] as any[],
    missingTables: [] as string[],
    missingColumns: [] as any[],
    recommendations: [] as string[],
    error: null as string | null,
  }

  try {
    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

    if (!databaseUrl) {
      results.error = "DATABASE_URL environment variable is not set"
      return NextResponse.json(results)
    }

    // Create a SQL client
    const sql = neon(databaseUrl)

    // Test connection
    const testConnection = await sql`SELECT version() as db_version, current_database() as db_name`
    results.connection = true
    results.databaseInfo = testConnection[0]

    // Get list of tables with row counts
    const tables = await sql`
      SELECT 
        t.table_name,
        pg_catalog.obj_description(pgc.oid, 'pg_class') as table_description,
        (SELECT COUNT(*) FROM ${sql.unsafe(t.table_name)}) as row_count
      FROM information_schema.tables t
      JOIN pg_catalog.pg_class pgc ON pgc.relname = t.table_name
      WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name
    `

    // Get column information for each table
    for (const table of tables) {
      const columns = await sql`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = ${table.table_name}
        ORDER BY ordinal_position
      `

      results.tables.push({
        name: table.table_name,
        description: table.table_description,
        rowCount: table.row_count,
        columns: columns,
      })
    }

    // Get foreign key relationships
    const relationships = await sql`
      SELECT
        tc.table_name as source_table,
        kcu.column_name as source_column,
        ccu.table_name AS target_table,
        ccu.column_name AS target_column,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `
    results.relationships = relationships

    // Check for expected tables in a healthcare CRM
    const expectedTables = [
      "patients",
      "care_professionals",
      "appointments",
      "medications",
      "clinical_notes",
      "tasks",
      "care_plans",
      "invoices",
      "credentials",
      "tenants",
      "users",
    ]

    const existingTableNames = results.tables.map((t) => t.name)
    results.missingTables = expectedTables.filter((t) => !existingTableNames.includes(t))

    // Check for expected columns in key tables
    const expectedColumns = {
      patients: ["id", "tenant_id", "first_name", "last_name", "date_of_birth", "nhs_number"],
      care_professionals: ["id", "tenant_id", "first_name", "last_name", "role"],
      appointments: ["id", "tenant_id", "patient_id", "care_professional_id", "appointment_date"],
      clinical_notes: ["id", "tenant_id", "patient_id", "author_id", "content"],
    }

    for (const [tableName, expectedCols] of Object.entries(expectedColumns)) {
      const table = results.tables.find((t) => t.name === tableName)
      if (table) {
        const existingColumns = table.columns.map((c) => c.column_name)
        const missingColumns = expectedCols.filter((c) => !existingColumns.includes(c))

        if (missingColumns.length > 0) {
          results.missingColumns.push({
            table: tableName,
            missingColumns: missingColumns,
          })
        }
      }
    }

    // Generate recommendations
    if (results.missingTables.length > 0) {
      results.recommendations.push(`Create missing tables: ${results.missingTables.join(", ")}`)
    }

    if (results.missingColumns.length > 0) {
      for (const item of results.missingColumns) {
        results.recommendations.push(`Add missing columns to ${item.table}: ${item.missingColumns.join(", ")}`)
      }
    }

    // Check for tables without foreign key relationships
    const tablesWithoutRelationships = results.tables
      .filter((t) => !results.relationships.some((r) => r.source_table === t.name || r.target_table === t.name))
      .map((t) => t.name)

    if (tablesWithoutRelationships.length > 0) {
      results.recommendations.push(
        `Tables without relationships that might need foreign keys: ${tablesWithoutRelationships.join(", ")}`,
      )
    }

    return NextResponse.json(results)
  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error)
    return NextResponse.json(results)
  }
}
