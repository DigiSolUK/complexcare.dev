import { neon } from "@/lib/db"
import { tenantQuery } from "@/lib/db-utils"

export interface PatientAssignment {
  id: string
  tenant_id: string
  patient_id: string
  care_professional_id: string
  assignment_type: string
  start_date: string
  end_date?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
  created_by?: string | null
  updated_by?: string | null

  // Joined fields from patients table
  patient_first_name?: string
  patient_last_name?: string
  date_of_birth?: string
  gender?: string
  contact_number?: string
  email?: string
  avatar_url?: string
}

// Get all patient assignments for a care professional
export async function getPatientAssignmentsByCareProfessional(
  tenantId: string,
  careProfessionalId: string,
  includeEnded = false,
): Promise<{ assignments: PatientAssignment[]; error: string | null }> {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    let query = `
      SELECT pa.*, 
             p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             p.date_of_birth, p.gender, p.contact_number, p.email,
             COALESCE(p.avatar_url, '/placeholder.svg?height=40&width=40&query=patient') AS avatar_url
      FROM patient_assignments pa
      JOIN patients p ON pa.patient_id = p.id
      WHERE pa.care_professional_id = $1
      AND pa.tenant_id = $2
    `

    if (!includeEnded) {
      query += ` AND (pa.end_date IS NULL OR pa.end_date >= CURRENT_DATE)`
    }

    query += ` ORDER BY p.last_name, p.first_name`

    const assignments = await tenantQuery(tenantId, query, [careProfessionalId, tenantId])

    return { assignments, error: null }
  } catch (error) {
    console.error("Error fetching patient assignments:", error)
    return { assignments: [], error: "Failed to fetch patient assignments" }
  }
}

// Get all care professionals assigned to a patient
export async function getCareProvidersForPatient(
  tenantId: string,
  patientId: string,
  includeEnded = false,
): Promise<{ careProviders: any[]; error: string | null }> {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    let query = `
      SELECT pa.*, 
             cp.first_name, cp.last_name, cp.role, cp.title,
             cp.specialization, cp.avatar_url
      FROM patient_assignments pa
      JOIN care_professionals cp ON pa.care_professional_id = cp.id
      WHERE pa.patient_id = $1
      AND pa.tenant_id = $2
    `

    if (!includeEnded) {
      query += ` AND (pa.end_date IS NULL OR pa.end_date >= CURRENT_DATE)`
    }

    query += ` ORDER BY cp.last_name, cp.first_name`

    const careProviders = await tenantQuery(tenantId, query, [patientId, tenantId])

    return { careProviders, error: null }
  } catch (error) {
    console.error("Error fetching care providers for patient:", error)
    return { careProviders: [], error: "Failed to fetch care providers" }
  }
}

// Create a new patient assignment
export async function createPatientAssignment(
  tenantId: string,
  data: {
    patientId: string
    careProfessionalId: string
    assignmentType: string
    startDate: string
    endDate?: string | null
    notes?: string | null
    createdBy: string
  },
): Promise<{ assignment: PatientAssignment | null; error: string | null }> {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    // Check for existing active assignment of the same type
    const existingQuery = `
      SELECT * FROM patient_assignments
      WHERE tenant_id = $1
      AND patient_id = $2
      AND care_professional_id = $3
      AND assignment_type = $4
      AND (end_date IS NULL OR end_date >= $5)
    `

    const existingAssignments = await tenantQuery(tenantId, existingQuery, [
      tenantId,
      data.patientId,
      data.careProfessionalId,
      data.assignmentType,
      data.startDate,
    ])

    if (existingAssignments.length > 0) {
      return {
        assignment: null,
        error: "An active assignment already exists for this patient and care professional with the same type",
      }
    }

    // Create the new assignment
    const insertQuery = `
      INSERT INTO patient_assignments (
        tenant_id, patient_id, care_professional_id, assignment_type, 
        start_date, end_date, notes, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `

    const [assignment] = await tenantQuery(tenantId, insertQuery, [
      tenantId,
      data.patientId,
      data.careProfessionalId,
      data.assignmentType,
      data.startDate,
      data.endDate,
      data.notes,
      data.createdBy,
    ])

    // Get patient details
    const patientQuery = `
      SELECT first_name, last_name, date_of_birth, gender, contact_number, email,
             COALESCE(avatar_url, '/placeholder.svg?height=40&width=40&query=patient') AS avatar_url
      FROM patients
      WHERE id = $1 AND tenant_id = $2
    `

    const [patient] = await tenantQuery(tenantId, patientQuery, [data.patientId, tenantId])

    return {
      assignment: {
        ...assignment,
        patient_first_name: patient?.first_name,
        patient_last_name: patient?.last_name,
        date_of_birth: patient?.date_of_birth,
        gender: patient?.gender,
        contact_number: patient?.contact_number,
        email: patient?.email,
        avatar_url: patient?.avatar_url,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error creating patient assignment:", error)
    return { assignment: null, error: "Failed to create patient assignment" }
  }
}

// Update a patient assignment
export async function updatePatientAssignment(
  tenantId: string,
  assignmentId: string,
  data: {
    assignmentType?: string
    startDate?: string
    endDate?: string | null
    notes?: string | null
    updatedBy: string
  },
): Promise<{ assignment: PatientAssignment | null; error: string | null }> {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    // Build the update query
    const updateFields = []
    const params = [assignmentId, tenantId]
    let paramIndex = 3

    if (data.assignmentType !== undefined) {
      updateFields.push(`assignment_type = $${paramIndex++}`)
      params.push(data.assignmentType)
    }

    if (data.startDate !== undefined) {
      updateFields.push(`start_date = $${paramIndex++}`)
      params.push(data.startDate)
    }

    if (data.endDate !== undefined) {
      updateFields.push(`end_date = $${paramIndex++}`)
      params.push(data.endDate)
    }

    if (data.notes !== undefined) {
      updateFields.push(`notes = $${paramIndex++}`)
      params.push(data.notes)
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    updateFields.push(`updated_by = $${paramIndex++}`)
    params.push(data.updatedBy)

    const updateQuery = `
      UPDATE patient_assignments
      SET ${updateFields.join(", ")}
      WHERE id = $1
      AND tenant_id = $2
      RETURNING *, 
               (SELECT p.first_name FROM patients p WHERE p.id = patient_assignments.patient_id) as patient_first_name,
               (SELECT p.last_name FROM patients p WHERE p.id = patient_assignments.patient_id) as patient_last_name
    `

    const [updatedAssignment] = await tenantQuery(tenantId, updateQuery, params)

    if (!updatedAssignment) {
      return { assignment: null, error: "Assignment not found" }
    }

    return { assignment: updatedAssignment, error: null }
  } catch (error) {
    console.error("Error updating patient assignment:", error)
    return { assignment: null, error: "Failed to update patient assignment" }
  }
}

// End a patient assignment (set end date to today)
export async function endPatientAssignment(
  tenantId: string,
  assignmentId: string,
  updatedBy: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    const updateQuery = `
      UPDATE patient_assignments
      SET 
        end_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP,
        updated_by = $3
      WHERE id = $1
      AND tenant_id = $2
      AND (end_date IS NULL OR end_date > CURRENT_DATE)
      RETURNING id
    `

    const result = await tenantQuery(tenantId, updateQuery, [assignmentId, tenantId, updatedBy])

    if (result.length === 0) {
      return { success: false, error: "Assignment not found or already ended" }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error ending patient assignment:", error)
    return { success: false, error: "Failed to end patient assignment" }
  }
}

// Delete a patient assignment
export async function deletePatientAssignment(
  tenantId: string,
  assignmentId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

    const deleteQuery = `
      DELETE FROM patient_assignments
      WHERE id = $1
      AND tenant_id = $2
      RETURNING id
    `

    const result = await tenantQuery(tenantId, deleteQuery, [assignmentId, tenantId])

    if (result.length === 0) {
      return { success: false, error: "Assignment not found" }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting patient assignment:", error)
    return { success: false, error: "Failed to delete patient assignment" }
  }
}

// Get assignment types (could be from a lookup table or hardcoded)
export function getAssignmentTypes() {
  return [
    { value: "primary_care", label: "Primary Care Provider" },
    { value: "nursing", label: "Nursing Care" },
    { value: "physiotherapy", label: "Physiotherapy" },
    { value: "occupational_therapy", label: "Occupational Therapy" },
    { value: "speech_therapy", label: "Speech Therapy" },
    { value: "mental_health", label: "Mental Health Support" },
    { value: "social_care", label: "Social Care" },
    { value: "respite_care", label: "Respite Care" },
    { value: "specialist_care", label: "Specialist Care" },
    { value: "home_care", label: "Home Care" },
  ]
}
