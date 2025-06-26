import { neon } from "@neondatabase/serverless"
import type { Patient } from "@/types"
import { buildUpdateQuery } from "@/lib/db-utils" // Ensure isValidUUID is imported
import { v4 as uuidv4 } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

export async function getPatients(tenantId: string): Promise<Patient[]> {
  try {
    const patients = await sql`
      SELECT
        id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        contact_number,
        email,
        address,
        medical_record_number,
        primary_care_provider,
        avatar_url,
        status,
        medical_history,
        allergies,
        chronic_conditions,
        past_surgeries,
        family_medical_history,
        immunizations,
        created_at,
        updated_at
      FROM patients
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `
    return patients as Patient[]
  } catch (error) {
    console.error("Error fetching patients:", error)
    throw new Error("Failed to fetch patients")
  }
}

export async function getPatientById(tenantId: string, patientId: string): Promise<Patient | null> {
  try {
    const result = await sql`
      SELECT
        id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        contact_number,
        email,
        address,
        medical_record_number,
        primary_care_provider,
        avatar_url,
        status,
        medical_history,
        allergies,
        chronic_conditions,
        past_surgeries,
        family_medical_history,
        immunizations,
        created_at,
        updated_at
      FROM patients
      WHERE id = ${patientId} AND tenant_id = ${tenantId}
    `
    return (result[0] as Patient) || null
  } catch (error) {
    console.error(`Error fetching patient ${patientId}:`, error)
    throw new Error("Failed to fetch patient")
  }
}

export async function createPatient(
  tenantId: string,
  patientData: Partial<Patient>,
  createdBy: string,
): Promise<Patient> {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact_number,
      email,
      address,
      medical_record_number,
      primary_care_provider,
      avatar_url,
      status,
      medical_history,
      allergies,
      chronic_conditions,
      past_surgeries,
      family_medical_history,
      immunizations,
    } = patientData

    const result = await sql`
      INSERT INTO patients (
        tenant_id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        contact_number,
        email,
        address,
        medical_record_number,
        primary_care_provider,
        avatar_url,
        status,
        medical_history,
        allergies,
        chronic_conditions,
        past_surgeries,
        family_medical_history,
        immunizations,
        created_by
      ) VALUES (
        ${tenantId},
        ${first_name},
        ${last_name},
        ${date_of_birth},
        ${gender},
        ${contact_number},
        ${email},
        ${address ? JSON.stringify(address) : null}::jsonb,
        ${medical_record_number},
        ${primary_care_provider},
        ${avatar_url},
        ${status},
        ${medical_history ? JSON.stringify(medical_history) : null}::jsonb,
        ${allergies ? JSON.stringify(allergies) : null}::jsonb,
        ${chronic_conditions ? JSON.stringify(chronic_conditions) : null}::jsonb,
        ${past_surgeries ? JSON.stringify(past_surgeries) : null}::jsonb,
        ${family_medical_history ? JSON.stringify(family_medical_history) : null}::jsonb,
        ${immunizations ? JSON.stringify(immunizations) : null}::jsonb,
        ${createdBy}
      )
      RETURNING *
    `
    return result[0] as Patient
  } catch (error) {
    console.error("Error creating patient:", error)
    throw new Error("Failed to create patient")
  }
}

export async function updatePatient(
  tenantId: string,
  patientId: string,
  patientData: Partial<Patient>,
  updatedBy: string,
): Promise<Patient> {
  try {
    const dataToUpdate: Record<string, any> = { ...patientData }

    // Convert array/JSONB fields to JSON strings if they exist
    if (dataToUpdate.allergies !== undefined) {
      dataToUpdate.allergies = dataToUpdate.allergies ? JSON.stringify(dataToUpdate.allergies) : null
    }
    if (dataToUpdate.chronic_conditions !== undefined) {
      dataToUpdate.chronic_conditions = dataToUpdate.chronic_conditions
        ? JSON.stringify(dataToUpdate.chronic_conditions)
        : null
    }
    if (dataToUpdate.past_surgeries !== undefined) {
      dataToUpdate.past_surgeries = dataToUpdate.past_surgeries ? JSON.stringify(dataToUpdate.past_surgeries) : null
    }
    if (dataToUpdate.immunizations !== undefined) {
      dataToUpdate.immunizations = dataToUpdate.immunizations ? JSON.stringify(dataToUpdate.immunizations) : null
    }
    if (dataToUpdate.medical_history !== undefined) {
      dataToUpdate.medical_history = dataToUpdate.medical_history ? JSON.stringify(dataToUpdate.medical_history) : null
    }
    if (dataToUpdate.family_medical_history !== undefined) {
      dataToUpdate.family_medical_history = dataToUpdate.family_medical_history
        ? JSON.stringify(dataToUpdate.family_medical_history)
        : null
    }
    if (dataToUpdate.address !== undefined) {
      dataToUpdate.address = dataToUpdate.address ? JSON.stringify(dataToUpdate.address) : null
    }

    const dataWithUpdater = { ...dataToUpdate, updated_by: updatedBy }

    const { query, values } = buildUpdateQuery("patients", dataWithUpdater, { id: patientId, tenant_id: tenantId })

    const result = await sql.query(query, values)

    if (result.rows.length === 0) {
      throw new Error("Patient not found or update failed")
    }

    return result.rows[0] as Patient
  } catch (error) {
    console.error(`Error updating patient ${patientId}:`, error)
    throw new Error("Failed to update patient")
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

    const localSql = neon(databaseUrl) // Use a local sql client for this specific check

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

    const localSql = neon(databaseUrl)

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

    const localSql = neon(databaseUrl)

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

    const localSql = neon(databaseUrl)

    const now = new Date().toISOString()
    const testPatient = {
      id: uuidv4(), // Use UUID for consistency
      tenant_id: tenantId,
      first_name: "Test",
      last_name: "Patient",
      date_of_birth: "1990-01-01",
      gender: "Other",
      email: `test.patient.${Date.now()}@example.com`, // Make email unique
      contact_number: "07700 900000",
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
    }

    // Insert the test patient
    await localSql`
      INSERT INTO patients (
        id, tenant_id, first_name, last_name, date_of_birth, gender,
        contact_number, email, address, medical_record_number, status,
        created_at, updated_at, created_by, primary_care_provider, avatar_url,
        medical_history, allergies, chronic_conditions, past_surgeries, family_medical_history, immunizations
      ) VALUES (
        ${testPatient.id}, ${testPatient.tenant_id}, ${testPatient.first_name}, ${testPatient.last_name},
        ${testPatient.date_of_birth}, ${testPatient.gender}, ${testPatient.contact_number},
        ${testPatient.email}, ${JSON.stringify(testPatient.address)}::jsonb, ${testPatient.medical_record_number},
        ${testPatient.status}, ${testPatient.created_at}, ${testPatient.updated_at},
        ${testPatient.created_by}, ${testPatient.primary_care_provider}, ${testPatient.avatar_url},
        ${JSON.stringify(testPatient.medical_history)}::jsonb, ${JSON.stringify(testPatient.allergies)}::jsonb,
        ${JSON.stringify(testPatient.chronic_conditions)}::jsonb, ${JSON.stringify(testPatient.past_surgeries)}::jsonb,
        ${JSON.stringify(testPatient.family_medical_history)}::jsonb, ${JSON.stringify(testPatient.immunizations)}::jsonb
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
