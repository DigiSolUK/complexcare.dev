import { neon } from "@neondatabase/serverless"
import type { Medication } from "@/types"

const sql = neon(process.env.DATABASE_URL!)

export async function getMedicationsByPatientId(tenantId: string, patientId: string): Promise<Medication[]> {
  try {
    const medications = await sql<Medication[]>`
      SELECT
        m.id,
        m.tenant_id,
        m.patient_id,
        m.name,
        m.dosage,
        m.frequency,
        m.start_date,
        m.end_date,
        m.prescribed_by,
        m.notes,
        m.created_at,
        m.updated_at,
        cp.first_name || ' ' || cp.last_name AS prescribed_by_name
      FROM medications m
      LEFT JOIN care_professionals cp ON m.prescribed_by = cp.id
      WHERE m.tenant_id = ${tenantId} AND m.patient_id = ${patientId}
      ORDER BY m.start_date DESC;
    `
    return medications
  } catch (error) {
    console.error("Database error fetching medications by patient ID:", error)
    throw new Error("Failed to retrieve medications for patient.")
  }
}

// Existing functions (createMedication, updateMedication, deleteMedication, etc.) would remain here.
// For brevity, only the new function is shown.
