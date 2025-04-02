import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"

export type Appointment = {
  id: string
  tenant_id: string
  patient_id: string
  care_professional_id: string | null
  title: string
  description: string | null
  start_time: string
  end_time: string
  location: string | null
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"
  notes: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

// Get all appointments for a tenant
export async function getAppointments(tenantId: string): Promise<Appointment[]> {
  return tenantQuery<Appointment>(tenantId, `SELECT * FROM appointments ORDER BY start_time DESC`)
}

// Get appointment count for a tenant
export async function getAppointmentCount(tenantId: string): Promise<number> {
  const result = await tenantQuery<{ count: number }>(tenantId, `SELECT COUNT(*) as count FROM appointments`)
  return result[0]?.count || 0
}

// Get appointments for a patient
export async function getAppointmentsForPatient(tenantId: string, patientId: string): Promise<Appointment[]> {
  return tenantQuery<Appointment>(
    tenantId,
    `SELECT * FROM appointments WHERE patient_id = $1 ORDER BY start_time DESC`,
    [patientId],
  )
}

// Get appointments for a care professional
export async function getAppointmentsForCareProfessional(
  tenantId: string,
  careProfessionalId: string,
): Promise<Appointment[]> {
  return tenantQuery<Appointment>(
    tenantId,
    `SELECT * FROM appointments WHERE care_professional_id = $1 ORDER BY start_time DESC`,
    [careProfessionalId],
  )
}

// Get upcoming appointments
export async function getUpcomingAppointments(tenantId: string, limit = 5): Promise<Appointment[]> {
  const now = new Date().toISOString()
  return tenantQuery<Appointment>(
    tenantId,
    `SELECT * FROM appointments 
     WHERE start_time > $1 
     AND status IN ('scheduled', 'confirmed') 
     ORDER BY start_time ASC 
     LIMIT $2`,
    [now, limit],
  )
}

// Get an appointment by ID
export async function getAppointmentById(tenantId: string, appointmentId: string): Promise<Appointment | null> {
  const appointments = await tenantQuery<Appointment>(tenantId, `SELECT * FROM appointments WHERE id = $1`, [
    appointmentId,
  ])
  return appointments.length > 0 ? appointments[0] : null
}

// Create a new appointment
export async function createAppointment(
  tenantId: string,
  appointmentData: Omit<Appointment, "id" | "tenant_id" | "created_at" | "updated_at">,
  userId: string,
): Promise<Appointment> {
  const now = new Date().toISOString()
  const appointments = await tenantInsert<Appointment>(tenantId, "appointments", {
    ...appointmentData,
    created_at: now,
    updated_at: now,
    created_by: userId,
    updated_by: userId,
  })
  return appointments[0]
}

// Update an appointment
export async function updateAppointment(
  tenantId: string,
  appointmentId: string,
  appointmentData: Partial<Appointment>,
  userId: string,
): Promise<Appointment | null> {
  const now = new Date().toISOString()
  const appointments = await tenantUpdate<Appointment>(tenantId, "appointments", appointmentId, {
    ...appointmentData,
    updated_at: now,
    updated_by: userId,
  })
  return appointments.length > 0 ? appointments[0] : null
}

// Delete an appointment
export async function deleteAppointment(tenantId: string, appointmentId: string): Promise<Appointment | null> {
  const appointments = await tenantDelete<Appointment>(tenantId, "appointments", appointmentId)
  return appointments.length > 0 ? appointments[0] : null
}

