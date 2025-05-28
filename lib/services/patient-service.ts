import { db } from "../db"
import { PatientCache } from "../redis/patient-cache"
import { logActivity } from "./activity-log-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export interface Patient {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  email: string
  status: string
  date_of_birth: string
  gender: string
  contact_number: string
  address: string
  medical_record_number: string
  primary_care_provider: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export class PatientService {
  /**
   * Get all patients with caching
   */
  static async getAllPatients(tenantId: string) {
    const cacheResult = await PatientCache.getOrSetAllPatients(async () => {
      const result = await db.query("SELECT * FROM patients WHERE tenant_id = $1 ORDER BY last_name ASC", [tenantId])
      return result.rows
    })

    return cacheResult.data
  }

  /**
   * Get a patient by ID with caching
   */
  static async getPatientById(id: string, tenantId: string) {
    const cacheResult = await PatientCache.getOrSetPatient(id, async () => {
      const result = await db.query("SELECT * FROM patients WHERE id = $1 AND tenant_id = $2", [id, tenantId])
      return result.rows[0]
    })

    // Log patient viewed activity
    await logActivity({
      tenantId,
      activityType: "patient_viewed",
      description: `Patient profile viewed`,
      patientId: id,
    })

    return cacheResult.data
  }

  /**
   * Create a new patient and invalidate caches
   */
  static async createPatient(patientData: any, tenantId: string, userId?: string) {
    const { firstName, lastName, dateOfBirth, gender, address, phone, email } = patientData

    const result = await db.query(
      `INSERT INTO patients 
      (first_name, last_name, date_of_birth, gender, address, phone, email, tenant_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [firstName, lastName, dateOfBirth, gender, address, phone, email, tenantId],
    )

    const newPatient = result.rows[0]

    // Invalidate the patients list cache
    await PatientCache.invalidatePatientList()

    // Log patient creation activity
    await logActivity({
      tenantId,
      activityType: "patient_created",
      description: `New patient created: ${firstName} ${lastName}`,
      patientId: newPatient.id,
      userId,
      metadata: {
        patientName: `${firstName} ${lastName}`,
        dateOfBirth: dateOfBirth,
        gender: gender,
      },
    })

    return newPatient
  }

  /**
   * Update a patient and update cache
   */
  static async updatePatient(id: string, patientData: any, tenantId: string, userId?: string) {
    const { firstName, lastName, dateOfBirth, gender, address, phone, email } = patientData

    // Get original patient data for comparison
    const originalPatient = await PatientService.getPatientById(id, tenantId)

    const result = await db.query(
      `UPDATE patients 
      SET first_name = $1, last_name = $2, date_of_birth = $3, 
          gender = $4, address = $5, phone = $6, email = $7 
      WHERE id = $8 AND tenant_id = $9 
      RETURNING *`,
      [firstName, lastName, dateOfBirth, gender, address, phone, email, id, tenantId],
    )

    const updatedPatient = result.rows[0]

    // Update the patient in cache
    if (updatedPatient) {
      await PatientCache.updatePatient(id, updatedPatient)
    }

    // Determine which fields were updated
    const updatedFields = []
    if (originalPatient.first_name !== firstName || originalPatient.last_name !== lastName) updatedFields.push("name")
    if (originalPatient.date_of_birth !== dateOfBirth) updatedFields.push("date_of_birth")
    if (originalPatient.gender !== gender) updatedFields.push("gender")
    if (originalPatient.address !== address) updatedFields.push("address")
    if (originalPatient.phone !== phone) updatedFields.push("phone")
    if (originalPatient.email !== email) updatedFields.push("email")

    // Log patient update activity
    await logActivity({
      tenantId,
      activityType: "patient_updated",
      description: `Patient information updated: ${updatedFields.join(", ")}`,
      patientId: id,
      userId,
      metadata: {
        updatedFields,
        patientName: `${firstName} ${lastName}`,
      },
    })

    return updatedPatient
  }

  /**
   * Delete a patient and invalidate caches
   */
  static async deletePatient(id: string, tenantId: string, userId?: string) {
    // Get patient details before deletion
    const patient = await PatientService.getPatientById(id, tenantId)

    const result = await db.query("DELETE FROM patients WHERE id = $1 AND tenant_id = $2 RETURNING *", [id, tenantId])

    // Delete the patient from cache
    await PatientCache.deletePatient(id)

    // Log patient deletion activity
    if (patient) {
      await logActivity({
        tenantId,
        activityType: "patient_deleted",
        description: `Patient deleted: ${patient.first_name} ${patient.last_name}`,
        userId,
        metadata: {
          patientName: `${patient.first_name} ${patient.last_name}`,
          patientId: id,
        },
      })
    }

    return result.rows[0]
  }

  // Other methods remain unchanged...
}

// Add the missing exports
export const getPatients = async (tenantId: string = DEFAULT_TENANT_ID) => {
  return PatientService.getAllPatients(tenantId)
}

export const getPatientById = async (id: string, tenantId: string = DEFAULT_TENANT_ID) => {
  return PatientService.getPatientById(id, tenantId)
}

export const validatePatientsTable = async () => {
  try {
    const result = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'patients'
      )
    `)
    return result.rows[0].exists
  } catch (error) {
    console.error("Error validating patients table:", error)
    return false
  }
}

export const countAllPatients = async (tenantId: string = DEFAULT_TENANT_ID) => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM patients WHERE tenant_id = $1", [tenantId])
    return Number.parseInt(result.rows[0].count, 10)
  } catch (error) {
    console.error("Error counting patients:", error)
    return 0
  }
}

export const getTenantsWithPatients = async () => {
  try {
    const result = await db.query(`
      SELECT DISTINCT tenant_id, COUNT(*) as patient_count
      FROM patients
      GROUP BY tenant_id
    `)
    return result.rows
  } catch (error) {
    console.error("Error getting tenants with patients:", error)
    return []
  }
}

export const createTestPatient = async (tenantId: string = DEFAULT_TENANT_ID) => {
  try {
    const testPatient = {
      firstName: "Test",
      lastName: `Patient ${Date.now()}`,
      dateOfBirth: "1990-01-01",
      gender: "Other",
      address: "123 Test Street",
      phone: "07700900000",
      email: `test.patient.${Date.now()}@example.com`,
    }

    return await PatientService.createPatient(testPatient, tenantId)
  } catch (error) {
    console.error("Error creating test patient:", error)
    return null
  }
}
