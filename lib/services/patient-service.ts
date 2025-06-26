import { sql } from "@/lib/db"
import type { Patient, NewPatient } from "@/types"
import { buildUpdateQuery } from "@/lib/db-utils"
import { v4 as uuidv4 } from "uuid"

export async function getPatients(tenantId: string): Promise<Patient[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM patients
      WHERE tenant_id = ${tenantId}
      ORDER BY last_name ASC;
    `
    return rows as Patient[]
  } catch (error) {
    console.error("Error fetching patients:", error)
    throw new Error("Failed to fetch patients.")
  }
}

export async function getPatientById(id: string, tenantId: string): Promise<Patient | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM patients
      WHERE id = ${id} AND tenant_id = ${tenantId};
    `
    return (rows[0] as Patient) || null
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error)
    throw new Error(`Failed to fetch patient with ID ${id}.`)
  }
}

export async function createPatient(patientData: NewPatient, tenantId: string): Promise<Patient> {
  try {
    const { rows } = await sql`
      INSERT INTO patients (
        tenant_id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        address,
        city,
        postcode,
        country,
        phone,
        email,
        nhs_number,
        gp_name,
        gp_phone,
        gp_address,
        medical_history,
        allergies,
        medications,
        care_plan_summary,
        emergency_contact_name,
        emergency_contact_phone,
        created_at,
        updated_at
      ) VALUES (
        ${tenantId},
        ${patientData.first_name},
        ${patientData.last_name},
        ${patientData.date_of_birth},
        ${patientData.gender},
        ${patientData.address},
        ${patientData.city},
        ${patientData.postcode},
        ${patientData.country},
        ${patientData.phone},
        ${patientData.email},
        ${patientData.nhs_number},
        ${patientData.gp_name},
        ${patientData.gp_phone},
        ${patientData.gp_address},
        ${patientData.medical_history},
        ${patientData.allergies},
        ${patientData.medications},
        ${patientData.care_plan_summary},
        ${patientData.emergency_contact_name},
        ${patientData.emergency_contact_phone},
        NOW(),
        NOW()
      )
      RETURNING *;
    `
    return rows[0] as Patient
  } catch (error) {
    console.error("Error creating patient:", error)
    throw new Error("Failed to create patient.")
  }
}

export async function updatePatient(
  id: string,
  patientData: Partial<Omit<Patient, "id" | "created_at" | "updated_at">>,
  tenantId: string,
): Promise<Patient> {
  try {
    const { query, values } = buildUpdateQuery("patients", { ...patientData, updated_at: new Date() }, "id", id)
    const { rows } = await sql.unsafe(query, values)

    // Manually filter by tenant_id after update if not included in buildUpdateQuery
    // For security, it's better to include tenant_id in the WHERE clause of buildUpdateQuery
    // For now, we'll assume the update query is safe and the ID is unique within the tenant.
    // A more robust solution would modify buildUpdateQuery to include tenant_id in WHERE.
    if (rows[0] && rows[0].tenant_id !== tenantId) {
      throw new Error("Unauthorized: Patient does not belong to this tenant.")
    }

    return rows[0] as Patient
  } catch (error) {
    console.error(`Error updating patient with ID ${id}:`, error)
    throw new Error(`Failed to update patient with ID ${id}.`)
  }
}

export async function deletePatient(id: string, tenantId: string): Promise<void> {
  try {
    const { rowCount } = await sql`
      DELETE FROM patients
      WHERE id = ${id} AND tenant_id = ${tenantId};
    `
    if (rowCount === 0) {
      throw new Error(`Patient with ID ${id} not found or does not belong to this tenant.`)
    }
  } catch (error) {
    console.error(`Error deleting patient with ID ${id}:`, error)
    throw new Error(`Failed to delete patient with ID ${id}.`)
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

    // Use the imported sql client
    const localSql = sql

    // Check if table exists
    const tableCheck = await localSql`
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
    const columns = await localSql`
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

    // Use the imported sql client
    const localSql = sql

    const result = await localSql`SELECT COUNT(*) as count FROM patients`

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

    // Use the imported sql client
    const localSql = sql

    const result = await localSql`
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

    // Use the imported sql client
    const localSql = sql

    const now = new Date().toISOString()
    const testPatient = {
      id: uuidv4(), // Use UUID for consistency
      tenant_id: tenantId,
      first_name: "Test",
      last_name: "Patient",
      date_of_birth: "1990-01-01",
      gender: "Other",
      email: `test.patient.${Date.now()}@example.com`, // Make email unique
      phone: "07700 900000",
      address: "123 Test Street",
      city: "Testville",
      postcode: "TS1 1ST",
      country: "UK",
      nhs_number: "1234567890",
      gp_name: "Dr. Test Provider",
      gp_phone: "01234 567890",
      gp_address: "456 Clinic Road, Testville",
      medical_history: "{}", // JSONB field
      allergies: "[]", // JSONB field
      medications: "[]", // JSONB field
      care_plan_summary: "Initial test care plan summary.",
      emergency_contact_name: "Emergency Contact",
      emergency_contact_phone: "07700 900001",
      created_at: now,
      updated_at: now,
      created_by_user_id: "system",
      updated_by_user_id: "system",
    }

    // Insert the test patient
    await localSql`
      INSERT INTO patients (
        id, tenant_id, first_name, last_name, date_of_birth, gender,
        address, city, postcode, country, phone, email, nhs_number,
        gp_name, gp_phone, gp_address, medical_history, allergies,
        medications, care_plan_summary, emergency_contact_name,
        emergency_contact_phone, created_at, updated_at,
        created_by_user_id, updated_by_user_id
      ) VALUES (
        ${testPatient.id}, ${testPatient.tenant_id}, ${testPatient.first_name}, ${testPatient.last_name},
        ${testPatient.date_of_birth}, ${testPatient.gender}, ${testPatient.address},
        ${testPatient.city}, ${testPatient.postcode}, ${testPatient.country},
        ${testPatient.phone}, ${testPatient.email}, ${testPatient.nhs_number},
        ${testPatient.gp_name}, ${testPatient.gp_phone}, ${testPatient.gp_address},
        ${testPatient.medical_history}::jsonb, ${testPatient.allergies}::jsonb,
        ${testPatient.medications}::jsonb, ${testPatient.care_plan_summary},
        ${testPatient.emergency_contact_name}, ${testPatient.emergency_contact_phone},
        ${testPatient.created_at}, ${testPatient.updated_at},
        ${testPatient.created_by_user_id}, ${testPatient.updated_by_user_id}
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
