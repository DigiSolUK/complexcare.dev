import { sql } from "@/lib/db" // Corrected import path
import type { Patient, NewPatient } from "@/types"
import { v4 as uuidv4 } from "uuid"

export async function getPatients(tenantId: string): Promise<Patient[]> {
  try {
    const result = await sql`
      SELECT * FROM patients
      WHERE tenant_id = ${tenantId}
      ORDER BY last_name ASC;
    `
    return result.rows as Patient[]
  } catch (error) {
    console.error("Error fetching patients:", error)
    throw new Error("Failed to fetch patients.")
  }
}

export async function getPatientById(id: string, tenantId: string): Promise<Patient | null> {
  try {
    const result = await sql`
      SELECT * FROM patients
      WHERE id = ${id} AND tenant_id = ${tenantId};
    `
    return (result.rows[0] as Patient) || null
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error)
    throw new Error(`Failed to fetch patient with ID ${id}.`)
  }
}

export async function createPatient(patient: NewPatient, tenantId: string): Promise<Patient> {
  try {
    const result = await sql`
      INSERT INTO patients (
        tenant_id, first_name, last_name, date_of_birth, gender, address, phone, email,
        nhs_number, medical_history, allergies, current_medications,
        emergency_contact_name, emergency_contact_phone, notes, created_at, updated_at
      ) VALUES (
        ${tenantId}, ${patient.first_name}, ${patient.last_name}, ${patient.date_of_birth},
        ${patient.gender}, ${patient.address}, ${patient.phone}, ${patient.email},
        ${patient.nhs_number}, ${patient.medical_history}, ${patient.allergies},
        ${patient.current_medications}, ${patient.emergency_contact_name},
        ${patient.emergency_contact_phone}, ${patient.notes}, NOW(), NOW()
      )
      RETURNING *;
    `
    return result.rows[0] as Patient
  } catch (error) {
    console.error("Error creating patient:", error)
    throw new Error("Failed to create patient.")
  }
}

export async function updatePatient(id: string, patient: Partial<Patient>, tenantId: string): Promise<Patient> {
  try {
    const result = await sql`
      UPDATE patients
      SET
        first_name = COALESCE(${patient.first_name}, first_name),
        last_name = COALESCE(${patient.last_name}, last_name),
        date_of_birth = COALESCE(${patient.date_of_birth}, date_of_birth),
        gender = COALESCE(${patient.gender}, gender),
        address = COALESCE(${patient.address}, address),
        phone = COALESCE(${patient.phone}, phone),
        email = COALESCE(${patient.email}, email),
        nhs_number = COALESCE(${patient.nhs_number}, nhs_number),
        medical_history = COALESCE(${patient.medical_history}, medical_history),
        allergies = COALESCE(${patient.allergies}, allergies),
        current_medications = COALESCE(${patient.current_medications}, current_medications),
        emergency_contact_name = COALESCE(${patient.emergency_contact_name}, emergency_contact_name),
        emergency_contact_phone = COALESCE(${patient.emergency_contact_phone}, emergency_contact_phone),
        notes = COALESCE(${patient.notes}, notes),
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *;
    `
    if (result.rows.length === 0) {
      throw new Error("Patient not found or not authorized.")
    }
    return result.rows[0] as Patient
  } catch (error) {
    console.error(`Error updating patient with ID ${id}:`, error)
    throw new Error(`Failed to update patient with ID ${id}.`)
  }
}

export async function deletePatient(id: string, tenantId: string): Promise<void> {
  try {
    const result = await sql`
      DELETE FROM patients
      WHERE id = ${id} AND tenant_id = ${tenantId};
    `
    if (result.count === 0) {
      throw new Error("Patient not found or not authorized.")
    }
  } catch (error) {
    console.error(`Error deleting patient with ID ${id}:`, error)
    throw new Error(`Failed to delete patient with ID ${id}.`)
  }
}

export async function deactivatePatient(tenantId: string, patientId: string, updatedBy: string): Promise<Patient> {
  try {
    const result = await sql`
      UPDATE patients
      SET status = 'inactive', updated_at = NOW(), updated_by = ${updatedBy}
      WHERE id = ${patientId} AND tenant_id = ${tenantId}
      RETURNING id, status
    `
    if (result.length === 0) {
      throw new Error("Patient not found")
    }
    return result[0] as Patient
  } catch (error) {
    console.error(`Error deactivating patient ${patientId}:`, error)
    throw new Error("Failed to deactivate patient")
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

    const localSql = sql // Use the imported sql client

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

    const localSql = sql // Use the imported sql client

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

    const localSql = sql // Use the imported sql client

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

    const localSql = sql // Use the imported sql client

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
      address: {}, // JSONB field
      medical_record_number: `TEST${Date.now()}`,
      status: "active",
      created_at: now,
      updated_at: now,
      created_by: "system",
      primary_care_provider: "Dr. Test Provider",
      avatar_url: "/placeholder.svg",
      medical_history: {},
      allergies: [],
      chronic_conditions: [],
      past_surgeries: [],
      family_medical_history: {},
      immunizations: [],
      nhs_number: "1234567890",
      current_medications: [],
      emergency_contact_name: "Emergency Contact",
      emergency_contact_phone: "07700 900001",
      notes: "This is a test patient.",
    }

    // Insert the test patient
    await localSql`
      INSERT INTO patients (
        id, tenant_id, first_name, last_name, date_of_birth, gender,
        address, phone, email, nhs_number, medical_history, allergies,
        current_medications, emergency_contact_name, emergency_contact_phone,
        notes, created_at, updated_at, created_by, primary_care_provider, avatar_url,
        medical_record_number, status
      ) VALUES (
        ${testPatient.id}, ${testPatient.tenant_id}, ${testPatient.first_name}, ${testPatient.last_name},
        ${testPatient.date_of_birth}, ${testPatient.gender}, ${JSON.stringify(testPatient.address)}::jsonb,
        ${testPatient.phone}, ${testPatient.email}, ${testPatient.nhs_number},
        ${JSON.stringify(testPatient.medical_history)}::jsonb, ${JSON.stringify(testPatient.allergies)}::jsonb,
        ${JSON.stringify(testPatient.current_medications)}::jsonb, ${testPatient.emergency_contact_name},
        ${testPatient.emergency_contact_phone}, ${testPatient.notes}, ${testPatient.created_at}, ${testPatient.updated_at},
        ${testPatient.created_by}, ${testPatient.primary_care_provider}, ${testPatient.avatar_url},
        ${testPatient.medical_record_number}, ${testPatient.status}
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
