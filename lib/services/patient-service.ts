import { neon } from "@neondatabase/serverless"
import type { Patient } from "@/types"
import { buildUpdateQuery } from "@/lib/db-utils"

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
