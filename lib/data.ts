/**
 * Data fetching utilities for the application
 */

import { db } from "./db"
import { withErrorHandling } from "./error-utils"

// Patient data fetching
export const getPatients = withErrorHandling(async (tenantId: string) => {
  const result = await db.query(`SELECT * FROM patients WHERE tenant_id = $1 ORDER BY last_name, first_name`, [
    tenantId,
  ])
  return result.rows
})

export const getPatientById = withErrorHandling(async (id: string, tenantId: string) => {
  const result = await db.query(`SELECT * FROM patients WHERE id = $1 AND tenant_id = $2`, [id, tenantId])
  return result.rows[0]
})

// Care professional data fetching
export const getCareProfessionals = withErrorHandling(async (tenantId: string) => {
  const result = await db.query(
    `SELECT * FROM care_professionals WHERE tenant_id = $1 ORDER BY last_name, first_name`,
    [tenantId],
  )
  return result.rows
})

export const getCareProfessionalById = withErrorHandling(async (id: string, tenantId: string) => {
  const result = await db.query(`SELECT * FROM care_professionals WHERE id = $1 AND tenant_id = $2`, [id, tenantId])
  return result.rows[0]
})

// Appointment data fetching
export const getAppointments = withErrorHandling(async (tenantId: string) => {
  const result = await db.query(
    `SELECT a.*, p.first_name as patient_first_name, p.last_name as patient_last_name,
     cp.first_name as provider_first_name, cp.last_name as provider_last_name
     FROM appointments a
     JOIN patients p ON a.patient_id = p.id
     JOIN care_professionals cp ON a.provider_id = cp.id
     WHERE a.tenant_id = $1
     ORDER BY a.start_time DESC`,
    [tenantId],
  )
  return result.rows
})

// Task data fetching
export const getTasks = withErrorHandling(async (tenantId: string) => {
  const result = await db.query(
    `SELECT t.*, u.name as assigned_to_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.tenant_id = $1
     ORDER BY t.due_date ASC`,
    [tenantId],
  )
  return result.rows
})

// Dashboard data
export const getDashboardStats = withErrorHandling(async (tenantId: string) => {
  const patientCount = await db.query(`SELECT COUNT(*) as count FROM patients WHERE tenant_id = $1`, [tenantId])

  const appointmentCount = await db.query(
    `SELECT COUNT(*) as count FROM appointments 
     WHERE tenant_id = $1 AND start_time > NOW()`,
    [tenantId],
  )

  const taskCount = await db.query(
    `SELECT COUNT(*) as count FROM tasks 
     WHERE tenant_id = $1 AND status != 'completed'`,
    [tenantId],
  )

  return {
    patientCount: Number.parseInt(patientCount.rows[0].count),
    appointmentCount: Number.parseInt(appointmentCount.rows[0].count),
    pendingTaskCount: Number.parseInt(taskCount.rows[0].count),
  }
})

// Safe data fetching wrapper
export async function fetchData<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher()
  } catch (error) {
    console.error("Error fetching data:", error)
    return fallback
  }
}
