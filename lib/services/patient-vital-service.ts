import { neon } from "@neondatabase/serverless"
import type { PatientVital } from "@/types"
import { buildUpdateQuery, tenantQuery } from "@/lib/db-utils"

const sql = neon(process.env.DATABASE_URL!)

export async function getPatientVitals(tenantId: string, patientId: string): Promise<PatientVital[]> {
  try {
    const vitals = await tenantQuery(
      sql`
      SELECT
        pv.id,
        pv.tenant_id,
        pv.patient_id,
        pv.recorded_at,
        pv.blood_pressure_systolic,
        pv.blood_pressure_diastolic,
        pv.heart_rate,
        pv.temperature,
        pv.respiratory_rate,
        pv.oxygen_saturation,
        pv.weight,
        pv.height,
        pv.bmi,
        pv.notes,
        pv.created_by,
        pv.updated_by,
        pv.created_at,
        pv.updated_at,
        u.name AS created_by_name
      FROM patient_vitals pv
      LEFT JOIN users u ON pv.created_by = u.id
      WHERE pv.tenant_id = ${tenantId} AND pv.patient_id = ${patientId}
      ORDER BY pv.recorded_at DESC
    `,
    )
    return vitals as PatientVital[]
  } catch (error) {
    console.error(`Error fetching patient vitals for patient ${patientId}:`, error)
    throw new Error("Failed to fetch patient vitals")
  }
}

export async function getPatientVitalById(tenantId: string, vitalId: string): Promise<PatientVital | null> {
  try {
    const result = await tenantQuery(
      sql`
      SELECT
        pv.id,
        pv.tenant_id,
        pv.patient_id,
        pv.recorded_at,
        pv.blood_pressure_systolic,
        pv.blood_pressure_diastolic,
        pv.heart_rate,
        pv.temperature,
        pv.respiratory_rate,
        pv.oxygen_saturation,
        pv.weight,
        pv.height,
        pv.bmi,
        pv.notes,
        pv.created_by,
        pv.updated_by,
        pv.created_at,
        pv.updated_at,
        u.name AS created_by_name
      FROM patient_vitals pv
      LEFT JOIN users u ON pv.created_by = u.id
      WHERE pv.id = ${vitalId} AND pv.tenant_id = ${tenantId}
    `,
    )
    return (result[0] as PatientVital) || null
  } catch (error) {
    console.error(`Error fetching patient vital ${vitalId}:`, error)
    throw new Error("Failed to fetch patient vital")
  }
}

export async function createPatientVital(
  tenantId: string,
  patientId: string,
  vitalData: Partial<PatientVital>,
  createdBy: string,
): Promise<PatientVital> {
  try {
    const {
      recorded_at,
      blood_pressure_systolic,
      blood_pressure_diastolic,
      heart_rate,
      temperature,
      respiratory_rate,
      oxygen_saturation,
      weight,
      height,
      notes,
    } = vitalData

    // Calculate BMI if weight and height are provided
    let bmi: number | null = null
    if (weight && height && height > 0) {
      // BMI formula: weight (kg) / (height (m))^2
      // Convert height from cm to meters
      const heightInMeters = height / 100
      bmi = Number.parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2))
    }

    const result = await tenantQuery(
      sql`
      INSERT INTO patient_vitals (
        tenant_id,
        patient_id,
        recorded_at,
        blood_pressure_systolic,
        blood_pressure_diastolic,
        heart_rate,
        temperature,
        respiratory_rate,
        oxygen_saturation,
        weight,
        height,
        bmi,
        notes,
        created_by
      ) VALUES (
        ${tenantId},
        ${patientId},
        ${recorded_at || new Date().toISOString()},
        ${blood_pressure_systolic || null},
        ${blood_pressure_diastolic || null},
        ${heart_rate || null},
        ${temperature || null},
        ${respiratory_rate || null},
        ${oxygen_saturation || null},
        ${weight || null},
        ${height || null},
        ${bmi || null},
        ${notes || null},
        ${createdBy}
      )
      RETURNING *
    `,
    )
    return result[0] as PatientVital
  } catch (error) {
    console.error("Error creating patient vital:", error)
    throw new Error("Failed to create patient vital")
  }
}

export async function updatePatientVital(
  tenantId: string,
  vitalId: string,
  vitalData: Partial<PatientVital>,
  updatedBy: string,
): Promise<PatientVital> {
  try {
    const dataToUpdate: Record<string, any> = { ...vitalData }

    // Recalculate BMI if weight or height are being updated
    if (
      (dataToUpdate.weight !== undefined && dataToUpdate.weight !== null) ||
      (dataToUpdate.height !== undefined && dataToUpdate.height !== null)
    ) {
      // Fetch current vital data to get existing weight/height if not provided in update
      const currentVital = await getPatientVitalById(tenantId, vitalId)
      const currentWeight = dataToUpdate.weight !== undefined ? dataToUpdate.weight : currentVital?.weight
      const currentHeight = dataToUpdate.height !== undefined ? dataToUpdate.height : currentVital?.height

      if (currentWeight && currentHeight && currentHeight > 0) {
        const heightInMeters = currentHeight / 100
        dataToUpdate.bmi = Number.parseFloat((currentWeight / (heightInMeters * heightInMeters)).toFixed(2))
      } else {
        dataToUpdate.bmi = null // Clear BMI if weight/height are insufficient
      }
    }

    const dataWithUpdater = { ...dataToUpdate, updated_by: updatedBy }

    const { query, values } = buildUpdateQuery("patient_vitals", dataWithUpdater, { id: vitalId, tenant_id: tenantId })

    const result = await tenantQuery(query, values)

    if (result.length === 0) {
      throw new Error("Patient vital not found or update failed")
    }

    return result[0] as PatientVital
  } catch (error) {
    console.error(`Error updating patient vital ${vitalId}:`, error)
    throw new Error("Failed to update patient vital")
  }
}

export async function deletePatientVital(tenantId: string, vitalId: string): Promise<void> {
  try {
    const result = await tenantQuery(
      sql`
      DELETE FROM patient_vitals
      WHERE id = ${vitalId} AND tenant_id = ${tenantId}
      RETURNING id
    `,
    )
    if (result.length === 0) {
      throw new Error("Patient vital not found or delete failed")
    }
  } catch (error) {
    console.error(`Error deleting patient vital ${vitalId}:`, error)
    throw new Error("Failed to delete patient vital")
  }
}
