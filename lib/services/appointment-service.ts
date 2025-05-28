import { v4 as uuidv4 } from "uuid"
import { getAll, getById, insert, update, remove, sql } from "../db-connection"
import { DEFAULT_TENANT_ID } from "../constants"

export type Appointment = {
  id: string
  tenant_id: string
  patient_id: string
  care_professional_id: string
  appointment_date: string
  appointment_time: string
  end_time: string
  duration_minutes: number
  status: string
  appointment_type: string
  location: string
  notes?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export async function getAllAppointments(
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<Appointment[]> {
  return getAll<Appointment>("appointments", tenantId, limit, offset, "appointment_date DESC, appointment_time DESC")
}

export async function getAppointmentById(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment | null> {
  return getById<Appointment>("appointments", id, tenantId)
}

export async function getAppointmentsByPatient(
  patientId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<Appointment[]> {
  try {
    const query = `
      SELECT * FROM appointments
      WHERE tenant_id = $1
      AND patient_id = $2
      AND deleted_at IS NULL
      ORDER BY appointment_date DESC, appointment_time DESC
      LIMIT $3 OFFSET $4
    `
    const result = await sql.query(query, [tenantId, patientId, limit, offset])
    return result.rows as Appointment[]
  } catch (error) {
    console.error("Error getting appointments by patient:", error)
    throw error
  }
}

export async function getAppointmentsByCareProfessional(
  careProfessionalId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<Appointment[]> {
  try {
    const query = `
      SELECT * FROM appointments
      WHERE tenant_id = $1
      AND care_professional_id = $2
      AND deleted_at IS NULL
      ORDER BY appointment_date DESC, appointment_time DESC
      LIMIT $3 OFFSET $4
    `
    const result = await sql.query(query, [tenantId, careProfessionalId, limit, offset])
    return result.rows as Appointment[]
  } catch (error) {
    console.error("Error getting appointments by care professional:", error)
    throw error
  }
}

export async function getUpcomingAppointments(
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 10,
): Promise<Appointment[]> {
  try {
    const today = new Date().toISOString().split("T")[0]
    const query = `
      SELECT * FROM appointments
      WHERE tenant_id = $1
      AND deleted_at IS NULL
      AND appointment_date >= $2
      AND status = 'scheduled'
      ORDER BY appointment_date ASC, appointment_time ASC
      LIMIT $3
    `
    const result = await sql.query(query, [tenantId, today, limit])
    return result.rows as Appointment[]
  } catch (error) {
    console.error("Error getting upcoming appointments:", error)
    throw error
  }
}

export async function createAppointment(
  data: Omit<Appointment, "id" | "tenant_id" | "created_at" | "updated_at" | "deleted_at">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment | null> {
  const appointmentData = {
    ...data,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return insert<Appointment>("appointments", appointmentData, tenantId)
}

export async function updateAppointment(
  id: string,
  data: Partial<Appointment>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment | null> {
  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  return update<Appointment>("appointments", id, updateData, tenantId)
}

export async function deleteAppointment(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<boolean> {
  return remove("appointments", id, tenantId, true)
}

export async function getAppointmentsByDateRange(
  startDate: string,
  endDate: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<Appointment[]> {
  try {
    const query = `
      SELECT * FROM appointments
      WHERE tenant_id = $1
      AND deleted_at IS NULL
      AND appointment_date >= $2
      AND appointment_date <= $3
      ORDER BY appointment_date ASC, appointment_time ASC
    `
    const result = await sql.query(query, [tenantId, startDate, endDate])
    return result.rows as Appointment[]
  } catch (error) {
    console.error("Error getting appointments by date range:", error)
    throw error
  }
}
