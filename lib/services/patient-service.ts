import { db } from "../db"
import { PatientCache } from "../redis/patient-cache"

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

    return cacheResult.data
  }

  /**
   * Create a new patient and invalidate caches
   */
  static async createPatient(patientData: any, tenantId: string) {
    const { firstName, lastName, dateOfBirth, gender, address, phone, email } = patientData

    const result = await db.query(
      `INSERT INTO patients 
       (first_name, last_name, date_of_birth, gender, address, phone, email, tenant_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [firstName, lastName, dateOfBirth, gender, address, phone, email, tenantId],
    )

    // Invalidate the patients list cache
    await PatientCache.invalidatePatientList()

    return result.rows[0]
  }

  /**
   * Update a patient and update cache
   */
  static async updatePatient(id: string, patientData: any, tenantId: string) {
    const { firstName, lastName, dateOfBirth, gender, address, phone, email } = patientData

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

    return updatedPatient
  }

  /**
   * Delete a patient and invalidate caches
   */
  static async deletePatient(id: string, tenantId: string) {
    const result = await db.query("DELETE FROM patients WHERE id = $1 AND tenant_id = $2 RETURNING *", [id, tenantId])

    // Delete the patient from cache
    await PatientCache.deletePatient(id)

    return result.rows[0]
  }

  /**
   * Get patient count with caching
   */
  static async getPatientCount(tenantId: string) {
    const cachedCount = await PatientCache.getPatientCount()

    if (cachedCount !== null) {
      return cachedCount
    }

    const result = await db.query("SELECT COUNT(*) as count FROM patients WHERE tenant_id = $1", [tenantId])

    const count = Number.parseInt(result.rows[0].count)

    // Cache the count
    await PatientCache.setPatientCount(count)

    return count
  }

  /**
   * Search patients by name with caching when possible
   */
  static async searchPatients(searchTerm: string, tenantId: string) {
    // Try to get from cache first for common searches
    const cachedResults = await PatientCache.searchPatientsByPattern(searchTerm)

    if (cachedResults) {
      return cachedResults
    }

    // Fall back to database search
    const result = await db.query(
      `SELECT * FROM patients 
       WHERE tenant_id = $1 AND 
       (first_name ILIKE $2 OR last_name ILIKE $2) 
       ORDER BY last_name ASC`,
      [tenantId, `%${searchTerm}%`],
    )

    return result.rows
  }

  /**
   * Get patients with pagination and caching
   */
  static async getPaginatedPatients(page: number, pageSize: number, tenantId: string) {
    const offset = (page - 1) * pageSize

    // For pagination, we generally need to hit the database
    const result = await db.query(
      `SELECT * FROM patients 
       WHERE tenant_id = $1 
       ORDER BY last_name ASC 
       LIMIT $2 OFFSET $3`,
      [tenantId, pageSize, offset],
    )

    // Cache individual patients for future direct access
    const patientsMap = new Map()
    for (const patient of result.rows) {
      patientsMap.set(patient.id, patient)
    }

    await PatientCache.bulkSetPatients(patientsMap)

    return result.rows
  }

  /**
   * Get patients by care professional ID with caching
   */
  static async getPatientsByCareProfessionalId(careProfessionalId: string, tenantId: string) {
    const cacheKey = `care_professional:${careProfessionalId}:patients`
    const cachedPatients = await PatientCache.getPatient(cacheKey)

    if (cachedPatients) {
      return cachedPatients
    }

    const result = await db.query(
      `SELECT p.* FROM patients p
       JOIN care_professional_patients cpp ON p.id = cpp.patient_id
       WHERE cpp.care_professional_id = $1 AND p.tenant_id = $2
       ORDER BY p.last_name ASC`,
      [careProfessionalId, tenantId],
    )

    // Cache the results
    await PatientCache.setPatient(cacheKey, result.rows)

    return result.rows
  }

  /**
   * Clear all patient caches - useful for admin operations
   */
  static async clearAllPatientCaches() {
    await PatientCache.clearAllPatientCaches()
  }

  /**
   * Warm up the cache with frequently accessed patients
   */
  static async warmupPatientCache(tenantId: string) {
    // Get the most recently accessed patients
    const result = await db.query(
      `SELECT * FROM patients 
       WHERE tenant_id = $1 
       ORDER BY last_accessed_at DESC 
       LIMIT 100`,
      [tenantId],
    )

    // Cache all these patients
    const patientsMap = new Map()
    for (const patient of result.rows) {
      patientsMap.set(patient.id, patient)
    }

    await PatientCache.bulkSetPatients(patientsMap)

    // Also cache the full list
    await PatientCache.setAllPatients(result.rows)

    return result.rows.length
  }
}
