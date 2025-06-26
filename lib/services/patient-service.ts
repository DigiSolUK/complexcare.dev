import { tenantQuery } from "@/lib/db-utils"
import { neon } from "@neondatabase/serverless"
import type { Patient } from "@/types" // Import Patient type from types/index.ts

// Update the getPatients function to use the correct column names
export async function getPatients(tenantId: string, limit = 100): Promise<Patient[]> {
  try {
    console.log(`Getting patients for tenant ${tenantId} with limit ${limit}`)

    const sql = neon(process.env.DATABASE_URL || "")
    const result = await sql`
      SELECT
        id,
        first_name,
        last_name,
        email,
        contact_number, -- Corrected column name
        date_of_birth,
        gender,
        address,
        medical_record_number, -- Corrected column name
        status, -- Added status from schema
        created_at,
        updated_at,
        avatar_url, -- Corrected column name
        primary_care_provider -- Added primary_care_provider from schema
      FROM patients
      WHERE tenant_id = ${tenantId}
      LIMIT ${limit}
    `

    console.log(`Retrieved ${result.length} patients`)
    return result as Patient[]
  } catch (error) {
    console.error("Error getting patients:", error)
    // Return empty array instead of throwing to prevent UI errors
    return []
  }
}

// Get a patient by ID
export async function getPatientById(tenantId: string, patientId: string): Promise<Patient | null> {
  try {
    const patients = await tenantQuery<Patient>(tenantId, `SELECT * FROM patients WHERE id = $1 AND tenant_id = $2`, [
      patientId,
      tenantId,
    ])
    return patients && patients.length > 0 ? patients[0] : null
  } catch (error) {
    console.error(`Error getting patient ${patientId}:`, error)
    return null
  }
}

// Get patient count
export async function getPatientCount(tenantId: string): Promise<number> {
  try {
    const result = await tenantQuery<{ count: number }>(
      tenantId,
      `SELECT COUNT(*) as count FROM patients WHERE tenant_id = $1`,
      [tenantId],
    )
    return result && result.length > 0 ? Number(result[0].count) : 0
  } catch (error) {
    console.error("Error counting patients:", error)
    return 0
  }
}

// Validation functions

// Check if patients table exists and has the expected structure
export async function validatePatientsTable(): Promise<{
  exists: boolean
  columns: string[]
  error: string | null
}> {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

    if (!databaseUrl) {
      return {
        exists: false,
        columns: [],
        error: "DATABASE_URL environment variable is not set",
      }
    }

    const sql = neon(databaseUrl)

    // Check if table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'patients'
      ) as exists
    `

    const exists = tableCheck[0]?.exists === true

    if (!exists) {
      return {
        exists: false,
        columns: [],
        error: "Patients table does not exist",
      }
    }

    // Get columns
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'patients'
      ORDER BY ordinal_position
    `

    return {
      exists: true,
      columns: columns.map((c: any) => `${c.column_name} (${c.data_type})`),
      error: null,
    }
  } catch (error) {
    return {
      exists: false,
      columns: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Count all patients in the database (regardless of tenant)
export async function countAllPatients(): Promise<{
  count: number
  error: string | null
}> {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

    if (!databaseUrl) {
      return {
        count: 0,
        error: "DATABASE_URL environment variable is not set",
      }
    }

    const sql = neon(databaseUrl)

    const result = await sql`SELECT COUNT(*) as count FROM patients`

    return {
      count: Number(result[0]?.count || 0),
      error: null,
    }
  } catch (error) {
    return {
      count: 0,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Get a list of all tenant IDs that have patients
export async function getTenantsWithPatients(): Promise<{
  tenants: string[]
  error: string | null
}> {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

    if (!databaseUrl) {
      return {
        tenants: [],
        error: "DATABASE_URL environment variable is not set",
      }
    }

    const sql = neon(databaseUrl)

    const result = await sql`
      SELECT DISTINCT tenant_id
      FROM patients
      ORDER BY tenant_id
    `

    return {
      tenants: result.map((r: any) => r.tenant_id),
      error: null,
    }
  } catch (error) {
    return {
      tenants: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Create a test patient for a given tenant
export async function createTestPatient(tenantId: string): Promise<{
  success: boolean
  patient: Patient | null
  error: string | null
}> {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.production_DATABASE_URL

    if (!databaseUrl) {
      return {
        success: false,
        patient: null,
        error: "DATABASE_URL environment variable is not set",
      }
    }

    const sql = neon(databaseUrl)

    const now = new Date().toISOString()
    const testPatient = {
      id: `test-${Date.now()}`,
      tenant_id: tenantId,
      first_name: "Test",
      last_name: "Patient",
      date_of_birth: "1990-01-01",
      gender: "Other",
      email: "test.patient@example.com",
      contact_number: "07700 900000", // Corrected column name
      address: {}, // JSONB field
      medical_record_number: `TEST${Date.now()}`, // Corrected column name, made unique
      status: "active",
      created_at: now,
      updated_at: now,
      created_by: "system",
      primary_care_provider: "Dr. Test Provider", // Added from schema
      avatar_url: "/placeholder.svg", // Corrected column name
    }

    // Insert the test patient
    await sql`
      INSERT INTO patients (
        id, tenant_id, first_name, last_name, date_of_birth, gender,
        contact_number, email, address, medical_record_number, status,
        created_at, updated_at, created_by, primary_care_provider, avatar_url
      ) VALUES (
        ${testPatient.id}, ${testPatient.tenant_id}, ${testPatient.first_name}, ${testPatient.last_name},
        ${testPatient.date_of_birth}, ${testPatient.gender}, ${testPatient.contact_number},
        ${testPatient.email}, ${JSON.stringify(testPatient.address)}, ${testPatient.medical_record_number},
        ${testPatient.status}, ${testPatient.created_at}, ${testPatient.updated_at},
        ${testPatient.created_by}, ${testPatient.primary_care_provider}, ${testPatient.avatar_url}
      )
    `

    return {
      success: true,
      patient: testPatient as Patient,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      patient: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
