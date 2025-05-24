import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    // Get all tables in the database
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `

    // Get column information for each table
    const tableSchemas: Record<string, any[]> = {}

    for (const table of tables) {
      const columns = await sql`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = ${table.table_name}
        ORDER BY ordinal_position
      `

      tableSchemas[table.table_name] = columns
    }

    // Get foreign key relationships
    const foreignKeys = await sql`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    `

    return NextResponse.json({
      tables: tables.map((t) => t.table_name),
      schemas: tableSchemas,
      foreignKeys,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching database schema:", error)
    return NextResponse.json(
      { error: "Failed to fetch database schema", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
