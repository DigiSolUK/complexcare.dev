import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

const sql = neon(process.env.DATABASE_URL!)

export async function fetchCareProfessionalById(id: string, tenantId: string = DEFAULT_TENANT_ID) {
  try {
    const result = await sql`
      SELECT * FROM care_professionals
      WHERE id = ${id}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
    `
    return result[0] || null
  } catch (error) {
    console.error("Error fetching care professional:", error)
    return null
  }
}

export async function fetchAppointmentsForCareProfessional(
  careProfessionalId: string,
  tenantId: string = DEFAULT_TENANT_ID,
) {
  try {
    const result = await sql`
      SELECT a.*, p.first_name, p.last_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE a.care_professional_id = ${careProfessionalId}
      AND a.tenant_id = ${tenantId}
      AND a.deleted_at IS NULL
      ORDER BY a.appointment_date DESC
      LIMIT 10
    `
    return result
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}

export async function fetchCredentialsForCareProfessional(
  careProfessionalId: string,
  tenantId: string = DEFAULT_TENANT_ID,
) {
  try {
    const result = await sql`
      SELECT * FROM credentials
      WHERE care_professional_id = ${careProfessionalId}
      AND tenant_id = ${tenantId}
      AND deleted_at IS NULL
      ORDER BY expiry_date ASC
    `
    return result
  } catch (error) {
    console.error("Error fetching credentials:", error)
    return []
  }
}

export async function fetchTasksForCareProfessional(careProfessionalId: string, tenantId: string = DEFAULT_TENANT_ID) {
  try {
    const result = await sql`
      SELECT t.*, p.first_name, p.last_name
      FROM tasks t
      LEFT JOIN patients p ON t.patient_id = p.id
      WHERE t.assigned_to = ${careProfessionalId}
      AND t.tenant_id = ${tenantId}
      AND t.deleted_at IS NULL
      ORDER BY t.due_date ASC
      LIMIT 10
    `
    return result
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
}

export async function fetchPatientsForCareProfessional(
  careProfessionalId: string,
  tenantId: string = DEFAULT_TENANT_ID,
) {
  try {
    const result = await sql`
      SELECT DISTINCT p.*
      FROM patients p
      INNER JOIN appointments a ON p.id = a.patient_id
      WHERE a.care_professional_id = ${careProfessionalId}
      AND p.tenant_id = ${tenantId}
      AND p.deleted_at IS NULL
      ORDER BY p.last_name, p.first_name
    `
    return result
  } catch (error) {
    console.error("Error fetching patients:", error)
    return []
  }
}
