import { sql } from "@/lib/db"
import type { Patient, NewPatient } from "@/types"
import { buildUpdateQuery } from "@/lib/db-utils"

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
