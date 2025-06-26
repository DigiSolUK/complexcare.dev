import { sql } from "@/lib/db"
import type { Patient, NewPatient } from "@/types"
import { buildUpdateQuery } from "@/lib/db-utils"
import { v4 as uuidv4 } from "uuid"

export async function getPatients(tenantId: string): Promise<Patient[]> {
  try {
    const { rows } = await sql`
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
        updated_at,
        created_by,
        updated_by
      FROM patients
      WHERE tenant_id = ${tenantId}
      ORDER BY last_name ASC
    `
    return rows.map((row) => ({
      ...row,
      address: row.address ? JSON.parse(row.address) : null,
      medical_history: row.medical_history ? JSON.parse(row.medical_history) : null,
      allergies: row.allergies ? JSON.parse(row.allergies) : null,
      chronic_conditions: row.chronic_conditions ? JSON.parse(row.chronic_conditions) : null,
      past_surgeries: row.past_surgeries ? JSON.parse(row.past_surgeries) : null,
      family_medical_history: row.family_medical_history ? JSON.parse(row.family_medical_history) : null,
      immunizations: row.immunizations ? JSON.parse(row.immunizations) : null,
    })) as Patient[]
  } catch (error) {
    console.error("Error fetching patients:", error)
    throw new Error("Failed to fetch patients")
  }
}

export async function getPatientById(id: string, tenantId: string): Promise<Patient | null> {
  try {
    const { rows } = await sql`
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
        updated_at,
        created_by,
        updated_by
      FROM patients
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `
    if (rows.length === 0) return null
    const row = rows[0]
    return {
      ...row,
      address: row.address ? JSON.parse(row.address) : null,
      medical_history: row.medical_history ? JSON.parse(row.medical_history) : null,
      allergies: row.allergies ? JSON.parse(row.allergies) : null,
      chronic_conditions: row.chronic_conditions ? JSON.parse(row.chronic_conditions) : null,
      past_surgeries: row.past_surgeries ? JSON.parse(row.past_surgeries) : null,
      family_medical_history: row.family_medical_history ? JSON.parse(row.family_medical_history) : null,
      immunizations: row.immunizations ? JSON.parse(row.immunizations) : null,
    } as Patient
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error)
    throw new Error(`Failed to fetch patient with ID ${id}.`)
  }
}

export async function createPatient(patientData: NewPatient, tenantId: string, createdBy: string): Promise<Patient> {
  try {
    const { rows } = await sql`
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
        created_at,
        updated_at,
        created_by
      ) VALUES (
        ${tenantId},
        ${patientData.first_name},
        ${patientData.last_name},
        ${patientData.date_of_birth},
        ${patientData.gender || null},
        ${patientData.contact_number || null},
        ${patientData.email || null},
        ${patientData.address ? JSON.stringify(patientData.address) : null}::jsonb,
        ${patientData.medical_record_number || null},
        ${patientData.primary_care_provider || null},
        ${patientData.avatar_url || null},
        ${patientData.status || "active"},
        ${patientData.medical_history ? JSON.stringify(patientData.medical_history) : null}::jsonb,
        ${patientData.allergies ? JSON.stringify(patientData.allergies) : null}::jsonb,
        ${patientData.chronic_conditions ? JSON.stringify(patientData.chronic_conditions) : null}::jsonb,
        ${patientData.past_surgeries ? JSON.stringify(patientData.past_surgeries) : null}::jsonb,
        ${patientData.family_medical_history ? JSON.stringify(patientData.family_medical_history) : null}::jsonb,
        ${patientData.immunizations ? JSON.stringify(patientData.immunizations) : null}::jsonb,
        NOW(),
        NOW(),
        ${createdBy}
      )
      RETURNING *;
    `
    const row = rows[0]
    return {
      ...row,
      address: row.address ? JSON.parse(row.address) : null,
      medical_history: row.medical_history ? JSON.parse(row.medical_history) : null,
      allergies: row.allergies ? JSON.parse(row.allergies) : null,
      chronic_conditions: row.chronic_conditions ? JSON.parse(row.chronic_conditions) : null,
      past_surgeries: row.past_surgeries ? JSON.parse(row.past_surgeries) : null,
      family_medical_history: row.family_medical_history ? JSON.parse(row.family_medical_history) : null,
      immunizations: row.immunizations ? JSON.parse(row.immunizations) : null,
    } as Patient
  } catch (error) {
    console.error("Error creating patient:", error)
    throw new Error("Failed to create patient.")
  }
}

export async function updatePatient(
  id: string,
  patientData: Partial<Omit<Patient, "id" | "created_at" | "updated_at">>,
  tenantId: string,
  updatedBy: string,
): Promise<Patient> {
  try {
    const dataToUpdate: Record<string, any> = { ...patientData, updated_by: updatedBy, updated_at: new Date() }

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

    const { query, values } = buildUpdateQuery("patients", dataToUpdate, { id, tenant_id: tenantId })

    const { rows } = await sql.unsafe(query, values)

    if (rows.length === 0) {
      throw new Error("Patient not found or update failed")
    }

    const row = rows[0]
    return {
      ...row,
      address: row.address ? JSON.parse(row.address) : null,
      medical_history: row.medical_history ? JSON.parse(row.medical_history) : null,
      allergies: row.allergies ? JSON.parse(row.allergies) : null,
      chronic_conditions: row.chronic_conditions ? JSON.parse(row.chronic_conditions) : null,
      past_surgeries: row.past_surgeries ? JSON.parse(row.past_surgeries) : null,
      family_medical_history: row.family_medical_history ? JSON.parse(row.family_medical_history) : null,
      immunizations: row.immunizations ? JSON.parse(row.immunizations) : null,
    } as Patient
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

    const exists = tableCheck.rows[0]?.exists === true

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
      columns: columns.rows.map((c: any) => `${c.column_name} (${c.data_type})`),
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
    // Use the imported sql client
    const localSql = sql

    const result = await localSql`SELECT COUNT(*) as count FROM patients`

    return {
      count: Number(result.rows[0]?.count || 0),
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
    // Use the imported sql client
    const localSql = sql

    const result = await localSql`
      SELECT DISTINCT tenant_id
      FROM patients
      ORDER BY tenant_id
    `

    return {
      tenants: result.rows.map((r: any) => r.tenant_id),
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
    const { rows } = await localSql`
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
      RETURNING *
    `

    const createdPatient = rows[0]
    return {
      success: true,
      patient: {
        ...createdPatient,
        address: createdPatient.address ? JSON.parse(createdPatient.address) : null,
        medical_history: createdPatient.medical_history ? JSON.parse(createdPatient.medical_history) : null,
        allergies: createdPatient.allergies ? JSON.parse(createdPatient.allergies) : null,
        chronic_conditions: createdPatient.chronic_conditions ? JSON.parse(createdPatient.chronic_conditions) : null,
        past_surgeries: createdPatient.past_surgeries ? JSON.parse(createdPatient.past_surgeries) : null,
        family_medical_history: createdPatient.family_medical_history
          ? JSON.parse(createdPatient.family_medical_history)
          : null,
        immunizations: createdPatient.immunizations ? JSON.parse(createdPatient.immunizations) : null,
      } as Patient,
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
