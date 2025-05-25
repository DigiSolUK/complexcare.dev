import { executeQuery } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

// Care Professional data fetching functions
export async function fetchCareProfessionalById(id: string, tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT * FROM care_professionals
      WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
    `
    const result = await executeQuery(query, [id, tenantId])
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching care professional:", error)
    throw new Error("Failed to fetch care professional")
  }
}

export async function fetchAppointmentsForCareProfessional(careProfessionalId: string, tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT a.*, p.first_name as patient_first_name, p.last_name as patient_last_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.care_professional_id = $1 
      AND a.tenant_id = $2 
      AND a.deleted_at IS NULL
      ORDER BY a.start_time ASC
    `
    const result = await executeQuery(query, [careProfessionalId, tenantId])
    return result
  } catch (error) {
    console.error("Error fetching appointments for care professional:", error)
    throw new Error("Failed to fetch appointments")
  }
}

export async function fetchCredentialsForCareProfessional(careProfessionalId: string, tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT * FROM credentials
      WHERE care_professional_id = $1 
      AND tenant_id = $2 
      AND deleted_at IS NULL
      ORDER BY expiry_date ASC
    `
    const result = await executeQuery(query, [careProfessionalId, tenantId])
    return result
  } catch (error) {
    console.error("Error fetching credentials for care professional:", error)
    throw new Error("Failed to fetch credentials")
  }
}

export async function fetchTasksForCareProfessional(careProfessionalId: string, tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT t.*, p.first_name as patient_first_name, p.last_name as patient_last_name
      FROM tasks t
      LEFT JOIN patients p ON t.patient_id = p.id
      WHERE t.assigned_to = $1 
      AND t.tenant_id = $2 
      AND t.deleted_at IS NULL
      ORDER BY t.due_date ASC
    `
    const result = await executeQuery(query, [careProfessionalId, tenantId])
    return result
  } catch (error) {
    console.error("Error fetching tasks for care professional:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function fetchPatientsForCareProfessional(careProfessionalId: string, tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT DISTINCT p.*
      FROM patients p
      JOIN appointments a ON p.id = a.patient_id
      WHERE a.care_professional_id = $1 
      AND p.tenant_id = $2 
      AND p.deleted_at IS NULL
      ORDER BY p.last_name, p.first_name
    `
    const result = await executeQuery(query, [careProfessionalId, tenantId])
    return result
  } catch (error) {
    console.error("Error fetching patients for care professional:", error)
    throw new Error("Failed to fetch patients")
  }
}

// Additional helper functions for data fetching
export async function fetchAllCareProfessionals(tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT * FROM care_professionals
      WHERE tenant_id = $1 AND deleted_at IS NULL
      ORDER BY last_name, first_name
    `
    const result = await executeQuery(query, [tenantId])
    return result
  } catch (error) {
    console.error("Error fetching all care professionals:", error)
    throw new Error("Failed to fetch care professionals")
  }
}

export async function fetchAllPatients(tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT * FROM patients
      WHERE tenant_id = $1 AND deleted_at IS NULL
      ORDER BY last_name, first_name
    `
    const result = await executeQuery(query, [tenantId])
    return result
  } catch (error) {
    console.error("Error fetching all patients:", error)
    throw new Error("Failed to fetch patients")
  }
}

export async function fetchAllAppointments(tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT a.*, 
        p.first_name as patient_first_name, 
        p.last_name as patient_last_name,
        cp.first_name as care_professional_first_name,
        cp.last_name as care_professional_last_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN care_professionals cp ON a.care_professional_id = cp.id
      WHERE a.tenant_id = $1 AND a.deleted_at IS NULL
      ORDER BY a.start_time ASC
    `
    const result = await executeQuery(query, [tenantId])
    return result
  } catch (error) {
    console.error("Error fetching all appointments:", error)
    throw new Error("Failed to fetch appointments")
  }
}

export async function fetchAllTasks(tenantId = DEFAULT_TENANT_ID) {
  try {
    const query = `
      SELECT t.*, 
        p.first_name as patient_first_name, 
        p.last_name as patient_last_name,
        cp.first_name as assigned_to_first_name,
        cp.last_name as assigned_to_last_name
      FROM tasks t
      LEFT JOIN patients p ON t.patient_id = p.id
      LEFT JOIN care_professionals cp ON t.assigned_to = cp.id
      WHERE t.tenant_id = $1 AND t.deleted_at IS NULL
      ORDER BY t.due_date ASC
    `
    const result = await executeQuery(query, [tenantId])
    return result
  } catch (error) {
    console.error("Error fetching all tasks:", error)
    throw new Error("Failed to fetch tasks")
  }
}
