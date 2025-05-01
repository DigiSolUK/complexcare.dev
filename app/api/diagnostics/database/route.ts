import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  const results = {
    connection: false,
    tables: [] as string[],
    patientTableExists: false,
    patientColumns: [] as string[],
    samplePatients: [] as any[],
    tenants: [] as any[],
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
    const testConnection = await sql`SELECT 1 as connection_test`
    results.connection = testConnection[0]?.connection_test === 1

    // Get list of tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    results.tables = tables.map((t: any) => t.table_name)

    // Check if patients table exists
    results.patientTableExists = results.tables.includes("patients")

    // If patients table exists, get its columns
    if (results.patientTableExists) {
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'patients'
        ORDER BY ordinal_position
      `
      results.patientColumns = columns.map((c: any) => `${c.column_name} (${c.data_type})`)

      // Get a sample of patients (limit 5) regardless of tenant
      const samplePatients = await sql`
        SELECT * FROM patients LIMIT 5
      `
      results.samplePatients = samplePatients
    }

    // Get list of tenants
    const tenants = await sql`
      SELECT * FROM tenants LIMIT 10
    `
    results.tenants = tenants

    return NextResponse.json(results)
  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error)
    return NextResponse.json(results)
  }
}
