import { db } from "../db"
import { PatientCache } from "../redis/patient-cache"
import { withErrorHandling, tryCatchAsync } from "@/lib/error-utils"
import { captureException } from "@/lib/services/error-logging-service"
import { neon } from "@neondatabase/serverless"
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
      return Number.parseInt(cachedCount)
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

// Add the missing exported functions
export async function getPatients(tenantId: string = DEFAULT_TENANT_ID, limit = 10): Promise<Patient[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM patients 
      WHERE tenant_id = ${tenantId} 
      AND deleted_at IS NULL 
      ORDER BY updated_at DESC 
      LIMIT ${limit}
    `

    return result as Patient[]
  } catch (error) {
    console.error("Error fetching patients:", error)
    return []
  }
}

export async function validatePatientsTable(): Promise<boolean> {
  try {
    await db.query("SELECT COUNT(*) FROM patients LIMIT 1")
    return true
  } catch (error) {
    return false
  }
}

export async function countAllPatients(): Promise<number> {
  try {
    const result = await db.query("SELECT COUNT(*) as total FROM patients")
    return Number.parseInt(result.rows[0].total, 10)
  } catch (error) {
    console.error("Error counting patients:", error)
    return 0
  }
}

export async function getTenantsWithPatients(): Promise<any[]> {
  try {
    const result = await db.query(`
      SELECT tenant_id, COUNT(*) as patient_count 
      FROM patients 
      GROUP BY tenant_id
      ORDER BY patient_count DESC
    `)
    return result.rows
  } catch (error) {
    console.error("Error getting tenants with patients:", error)
    return []
  }
}

export async function createTestPatient(tenantId: string): Promise<any> {
  try {
    const result = await db.query(
      `
      INSERT INTO patients (
        tenant_id, first_name, last_name, date_of_birth, gender, 
        address, phone, email, created_at, updated_at
      ) VALUES (
        $1, 'Test', 'Patient', '2000-01-01', 'Other',
        '123 Test Street', '555-1234', 'test@example.com', NOW(), NOW()
      ) RETURNING *
    `,
      [tenantId],
    )

    return result.rows[0]
  } catch (error) {
    console.error("Error creating test patient:", error)
    throw error
  }
}

// Wrap the getPatient function with error handling
export const getPatientSafe = withErrorHandling(
  async (id: string) => {
    // Original implementation
    const response = await fetch(`/api/patients/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch patient with ID ${id}`)
    }
    return await response.json()
  },
  { service: "PatientService", method: "getPatient" },
)

// Example of a function using the tryCatchAsync utility
export async function getPatientWithFallback(patientId: string) {
  const result = await tryCatchAsync(
    async () => {
      const response = await fetch(`/api/patients/${patientId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch patient: ${response.status}`)
      }
      return await response.json()
    },
    // Fallback data if the API call fails
    {
      id: patientId,
      name: "Unknown Patient",
      status: "error",
      message: "Could not load patient data",
    },
  )

  return result.data
}

// Example of a function that will propagate errors to be caught by error boundaries
export async function getPatientByIdWithErrorHandling(patientId: string) {
  try {
    const response = await fetch(`/api/patients/${patientId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch patient: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    // Log the error but still throw it to be caught by error boundaries
    captureException(error, { patientId, operation: "getPatientById" })
    throw error
  }
}

export async function getPatientById(patientId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Patient | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM patients 
      WHERE id = ${patientId} 
      AND tenant_id = ${tenantId} 
      AND deleted_at IS NULL
    `

    return result.length > 0 ? (result[0] as Patient) : null
  } catch (error) {
    console.error("Error fetching patient:", error)
    return null
  }
}
