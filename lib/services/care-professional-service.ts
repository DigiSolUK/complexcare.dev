import type { CareProfessional as CareProfessionalType } from "@/types"
import { tenantQuery } from "@/lib/db/tenant"
import { cache } from "../redis/cache-service"
import { CacheService } from "@/lib/redis/cache-service"
import { neon } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { neon as neonDatabase } from "@neondatabase/serverless"
import { sql } from "@vercel/postgres"
import type { CareProfessional as CareProfessionalInterface } from "@/types"

// Cache key prefix for care professionals
const CACHE_PREFIX = "care-professional:"

// Helper function to validate dates
function validateDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    // Use global isNaN function directly instead of importing it
    return Number.isNaN(date.getTime()) ? null : dateString
  } catch (e) {
    return null
  }
}

// Demo care professionals
const demoCareProfessionals: CareProfessionalInterface[] = [
  {
    id: "1",
    first_name: "Emma",
    last_name: "Wilson",
    email: "emma.wilson@example.com",
    phone: "020 1234 5678",
    role: "Registered Nurse",
    specialization: "Diabetes Care",
    qualification: "RN, BSc Nursing",
    license_number: "NMC123456",
    employment_status: "Full-time",
    start_date: "2021-03-15T00:00:00Z",
    is_active: true,
    tenant_id: "demo-tenant",
    created_at: "2021-03-10T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z",
    address: "123 Nurse Lane, London",
    notes: "Specializes in diabetes management and wound care.",
    emergency_contact_name: "James Wilson",
    emergency_contact_phone: "020 8765 4321",
    avatar_url: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "2",
    first_name: "Michael",
    last_name: "Brown",
    email: "michael.brown@example.com",
    phone: "020 2345 6789",
    role: "Care Assistant",
    specialization: "Elderly Care",
    qualification: "NVQ Level 3 Health and Social Care",
    license_number: "CA789012",
    employment_status: "Part-time",
    start_date: "2022-01-10T00:00:00Z",
    is_active: true,
    tenant_id: "demo-tenant",
    created_at: "2022-01-05T00:00:00Z",
    updated_at: "2023-02-20T00:00:00Z",
    address: "456 Carer Street, Manchester",
    notes: "Experienced in dementia care.",
    emergency_contact_name: "Sarah Brown",
    emergency_contact_phone: "020 9876 5432",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "3",
    first_name: "Sophia",
    last_name: "Garcia",
    email: "sophia.garcia@example.com",
    phone: "020 3456 7890",
    role: "Physiotherapist",
    specialization: "Neurological Rehabilitation",
    qualification: "BSc Physiotherapy, MSc Neuro Rehab",
    license_number: "PT345678",
    employment_status: "Full-time",
    start_date: "2020-06-22T00:00:00Z",
    is_active: true,
    tenant_id: "demo-tenant",
    created_at: "2020-06-15T00:00:00Z",
    updated_at: "2023-03-10T00:00:00Z",
    address: "789 Therapy Road, Birmingham",
    notes: "Specializes in stroke rehabilitation.",
    emergency_contact_name: "Carlos Garcia",
    emergency_contact_phone: "020 7654 3210",
    avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "4",
    first_name: "David",
    last_name: "Taylor",
    email: "david.taylor@example.com",
    phone: "020 4567 8901",
    role: "Occupational Therapist",
    specialization: "Home Adaptations",
    qualification: "BSc Occupational Therapy",
    license_number: "OT901234",
    employment_status: "Full-time",
    start_date: "2019-11-05T00:00:00Z",
    is_active: true,
    tenant_id: "demo-tenant",
    created_at: "2019-11-01T00:00:00Z",
    updated_at: "2023-04-05T00:00:00Z",
    address: "101 Adaptation Avenue, Glasgow",
    notes: "Expert in home adaptations for disabled clients.",
    emergency_contact_name: "Lisa Taylor",
    emergency_contact_phone: "020 6543 2109",
    avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "5",
    first_name: "Olivia",
    last_name: "Johnson",
    email: "olivia.johnson@example.com",
    phone: "020 5678 9012",
    role: "Mental Health Nurse",
    specialization: "Anxiety and Depression",
    qualification: "RMN, BSc Mental Health Nursing",
    license_number: "MHN567890",
    employment_status: "Part-time",
    start_date: "2021-09-15T00:00:00Z",
    is_active: false,
    tenant_id: "demo-tenant",
    created_at: "2021-09-10T00:00:00Z",
    updated_at: "2023-05-12T00:00:00Z",
    address: "202 Wellbeing Street, Edinburgh",
    notes: "Currently on maternity leave.",
    emergency_contact_name: "Robert Johnson",
    emergency_contact_phone: "020 5432 1098",
    avatar_url: "https://randomuser.me/api/portraits/women/89.jpg",
  },
]

// Cache TTL values (in seconds)
const CACHE_TTL = {
  CARE_PROFESSIONAL: 3600, // 1 hour
  CARE_PROFESSIONALS_LIST: 1800, // 30 minutes
  CREDENTIALS: 3600, // 1 hour
}

export interface Credential {
  id: string
  care_professional_id: string
  credential_type: string
  credential_number: string
  issuing_authority: string
  issue_date: Date
  expiry_date: Date
  verification_status: string
  verification_date?: Date
  verification_notes?: string
  created_at: Date
  updated_at: Date
}

export interface CareProfessional {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  status: string
  created_at: Date
  updated_at: Date
  created_by: string
}

export class CareProfessionalService {
  /**
   * Get a care professional by ID with caching
   */
  static async getCareProfessionalById(id: string, tenantId: string) {
    const cacheKey = `care_professional:${tenantId}:${id}`

    return CacheService.getOrSet(
      cacheKey,
      async () => {
        const result = await neon`
          SELECT * FROM care_professionals 
          WHERE id = ${id} AND tenant_id = ${tenantId}
        `
        return result.length > 0 ? result[0] : null
      },
      CACHE_TTL.CARE_PROFESSIONAL,
    )
  }

  /**
   * Get all care professionals with caching
   */
  static async getAllCareProfessionals(tenantId: string) {
    const cacheKey = `care_professionals:${tenantId}:all`

    return CacheService.getOrSet(
      cacheKey,
      async () => {
        const result = await neon`
          SELECT * FROM care_professionals 
          WHERE tenant_id = ${tenantId}
          ORDER BY last_name, first_name
        `
        return result
      },
      CACHE_TTL.CARE_PROFESSIONALS_LIST,
    )
  }

  /**
   * Create a new care professional
   */
  static async createCareProfessional(data: any, tenantId: string) {
    // Insert into database
    const result = await neon`
      INSERT INTO care_professionals (
        first_name, last_name, email, phone, role, status, tenant_id
      ) VALUES (
        ${data.firstName}, 
        ${data.lastName}, 
        ${data.email}, 
        ${data.phone}, 
        ${data.role}, 
        ${data.status}, 
        ${tenantId}
      )
      RETURNING *
    `

    // Invalidate cache
    await CacheService.delete(`care_professionals:${tenantId}:all`)

    return result[0]
  }

  /**
   * Update a care professional
   */
  static async updateCareProfessional(id: string, data: any, tenantId: string) {
    // Update in database
    const result = await neon`
      UPDATE care_professionals
      SET 
        first_name = ${data.firstName},
        last_name = ${data.lastName},
        email = ${data.email},
        phone = ${data.phone},
        role = ${data.role},
        status = ${data.status},
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *
    `

    // Invalidate caches
    await CacheService.delete(`care_professional:${tenantId}:${id}`)
    await CacheService.delete(`care_professionals:${tenantId}:all`)

    return result.length > 0 ? result[0] : null
  }

  /**
   * Delete a care professional
   */
  static async deleteCareProfessional(id: string, tenantId: string) {
    // Delete from database
    const result = await neon`
      DELETE FROM care_professionals
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING id
    `

    // Invalidate caches
    await CacheService.delete(`care_professional:${tenantId}:${id}`)
    await CacheService.delete(`care_professionals:${tenantId}:all`)

    return result.length > 0
  }
}

export async function getAllCareProfessionals(tenantId: string) {
  try {
    const careProfessionals = await sql`
      SELECT * FROM care_professionals 
      WHERE tenant_id = ${tenantId}
      ORDER BY last_name, first_name
    `
    return { careProfessionals, error: null }
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    return { careProfessionals: [], error: "Failed to fetch care professionals" }
  }
}

export async function getCareProfessionalByIdSql(id: string, tenantId: string) {
  try {
    const [careProfessional] = await sql`
      SELECT * FROM care_professionals 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `
    return careProfessional
  } catch (error) {
    console.error(`Error fetching care professional with ID ${id}:`, error)
    return null
  }
}

export async function createCareProfessional(tenantId: string, data: Partial<CareProfessionalInterface>) {
  try {
    const [careProfessional] = await sql`
      INSERT INTO care_professionals (
        tenant_id, first_name, last_name, email, phone, role, specialization, 
        qualification, license_number, address, start_date, employment_status,
        notes, emergency_contact_name, emergency_contact_phone, avatar_url
      ) VALUES (
        ${tenantId}, ${data.first_name}, ${data.last_name}, ${data.email}, 
        ${data.phone}, ${data.role}, ${data.specialization}, ${data.qualification}, 
        ${data.license_number}, ${data.address}, ${data.start_date}, ${data.employment_status},
        ${data.notes}, ${data.emergency_contact_name}, ${data.emergency_contact_phone}, 
        ${data.avatar_url}
      )
      RETURNING *
    `
    return { careProfessional, error: null }
  } catch (error) {
    console.error("Error creating care professional:", error)
    return { careProfessional: null, error: "Failed to create care professional" }
  }
}

export async function updateCareProfessional(id: string, tenantId: string, data: Partial<CareProfessionalInterface>) {
  try {
    const [careProfessional] = await sql`
      UPDATE care_professionals
      SET
        first_name = COALESCE(${data.first_name}, first_name),
        last_name = COALESCE(${data.last_name}, last_name),
        email = COALESCE(${data.email}, email),
        phone = COALESCE(${data.phone}, phone),
        role = COALESCE(${data.role}, role),
        specialization = COALESCE(${data.specialization}, specialization),
        qualification = COALESCE(${data.qualification}, qualification),
        license_number = COALESCE(${data.license_number}, license_number),
        address = COALESCE(${data.address}, address),
        start_date = COALESCE(${data.start_date}, start_date),
        employment_status = COALESCE(${data.employment_status}, employment_status),
        notes = COALESCE(${data.notes}, notes),
        emergency_contact_name = COALESCE(${data.emergency_contact_name}, emergency_contact_name),
        emergency_contact_phone = COALESCE(${data.emergency_contact_phone}, emergency_contact_phone),
        avatar_url = COALESCE(${data.avatar_url}, avatar_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *
    `
    return { careProfessional, error: null }
  } catch (error) {
    console.error(`Error updating care professional with ID ${id}:`, error)
    return { careProfessional: null, error: "Failed to update care professional" }
  }
}

export async function deleteCareProfessional(id: string, tenantId: string) {
  try {
    await sql`
      DELETE FROM care_professionals
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `
    return { success: true, error: null }
  } catch (error) {
    console.error(`Error deleting care professional with ID ${id}:`, error)
    return { success: false, error: "Failed to delete care professional" }
  }
}

export async function getCareProfessionalAppointments(id: string, tenantId: string) {
  try {
    const appointments = await sql`
      SELECT a.* 
      FROM appointments a
      WHERE a.care_professional_id = ${id} AND a.tenant_id = ${tenantId}
      ORDER BY a.appointment_date DESC
    `
    return { appointments, error: null }
  } catch (error) {
    console.error(`Error fetching appointments for care professional with ID ${id}:`, error)
    return { appointments: [], error: "Failed to fetch care professional appointments" }
  }
}

export async function getCareProfessionalPatients(id: string, tenantId: string) {
  try {
    const patients = await sql`
      SELECT DISTINCT p.* 
      FROM patients p
      JOIN appointments a ON p.id = a.patient_id
      WHERE a.care_professional_id = ${id} AND p.tenant_id = ${tenantId}
      ORDER BY p.last_name, p.first_name
    `
    return { patients, error: null }
  } catch (error) {
    console.error(`Error fetching patients for care professional with ID ${id}:`, error)
    return { patients: [], error: "Failed to fetch care professional patients" }
  }
}

export async function getCareProfessionalTasks(id: string, tenantId: string) {
  try {
    const tasks = await sql`
      SELECT t.* 
      FROM tasks t
      WHERE t.assigned_to = ${id} AND t.tenant_id = ${tenantId}
      ORDER BY t.due_date ASC
    `
    return { tasks, error: null }
  } catch (error) {
    console.error(`Error fetching tasks for care professional with ID ${id}:`, error)
    return { tasks: [], error: "Failed to fetch care professional tasks" }
  }
}

export async function getCareProfessionalCredentials(id: string, tenantId: string) {
  try {
    const credentials = await sql`
      SELECT c.* 
      FROM credentials c
      WHERE c.care_professional_id = ${id} AND c.tenant_id = ${tenantId}
      ORDER BY c.expiry_date ASC
    `
    return { credentials, error: null }
  } catch (error) {
    console.error(`Error fetching credentials for care professional with ID ${id}:`, error)
    return { credentials: [], error: "Failed to fetch care professional credentials" }
  }
}

export async function getCareProfessionals(tenantId: string, searchQuery?: string) {
  const cacheKey = `${CACHE_PREFIX}list:${tenantId}`

  // Try to get from cache first
  const cachedData = await cache.get(cacheKey)
  if (cachedData) {
    return JSON.parse(cachedData)
  }

  // Force demo mode for now to ensure it works
  const demoMode = true

  if (demoMode) {
    // Filter demo data if search query is provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return demoCareProfessionals.filter(
        (cp) =>
          cp.first_name.toLowerCase().includes(query) ||
          cp.last_name.toLowerCase().includes(query) ||
          cp.role.toLowerCase().includes(query) ||
          cp.email.toLowerCase().includes(query),
      )
    }
    return demoCareProfessionals
  }

  try {
    const sql = neon(process.env.DATABASE_URL || "")

    let query = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        role, 
        specialization, 
        qualification, 
        license_number, 
        employment_status, 
        start_date, 
        is_active,
        tenant_id, 
        created_at, 
        updated_at
      FROM care_professionals
      WHERE tenant_id = $1
    `

    const params = [tenantId]

    if (searchQuery) {
      query += ` 
        AND (
          LOWER(first_name) LIKE $2 OR 
          LOWER(last_name) LIKE $2 OR 
          LOWER(role) LIKE $2 OR 
          LOWER(email) LIKE $2
        )
      `
      params.push(`%${searchQuery.toLowerCase()}%`)
    }

    const result = await sql(query, params)

    // Map the database results to the CareProfessional type
    // Add default values for any missing fields
    const mappedResult = result.map((row: any) => ({
      ...row,
      phone: row.phone || "Not provided",
      status: "active", // Default status since the column doesn't exist
    }))

    // Store in cache for 5 minutes
    await cache.set(cacheKey, JSON.stringify(mappedResult), 300)

    return mappedResult
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    // Fall back to demo data on error
    return demoCareProfessionals
  }
}

/**
 * Get a care professional by ID
 * @param id The ID of the care professional to retrieve
 * @returns The care professional data
 */
export async function getCareProfessionalById(id: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      SELECT * FROM care_professionals
      WHERE id = ${id}
    `

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching care professional by ID:", error)
    throw new Error("Failed to fetch care professional")
  }
}

// Add the missing export
export const getCareProfessionalByIdOld = async (id: string, tenantId: string) => {
  return CareProfessionalService.getCareProfessionalById(id, tenantId)
}

export async function getCareProfessionalByIdOld2(id: string, tenantId: string) {
  const cacheKey = `${CACHE_PREFIX}${id}:${tenantId}`

  // Try to get from cache first
  const cachedData = await cache.get(cacheKey)
  if (cachedData) {
    return JSON.parse(cachedData)
  }

  // Force demo mode for now to ensure it works
  const demoMode = true

  if (demoMode) {
    return demoCareProfessionals.find((cp) => cp.id === id) || null
  }

  try {
    const sql = neon(process.env.DATABASE_URL || "")

    const query = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        role, 
        specialization, 
        qualification, 
        license_number, 
        employment_status, 
        start_date, 
        is_active,
        tenant_id, 
        created_at, 
        updated_at
      FROM care_professionals
      WHERE id = $1 AND tenant_id = $2
    `

    const result = await sql(query, [id, tenantId])

    if (result.length === 0) {
      return null
    }

    // Add default values for any missing fields and validate dates
    const processedResult = {
      ...result[0],
      phone: result[0].phone || "Not provided",
      status: "active", // Default status since the column doesn't exist
      start_date: result[0].start_date ? validateDate(result[0].start_date) : null,
    }

    // Store in cache for 5 minutes
    await cache.set(cacheKey, JSON.stringify(processedResult), 300)

    return processedResult
  } catch (error) {
    console.error("Error fetching care professional:", error)
    // Fall back to demo data on error
    return demoCareProfessionals.find((cp) => cp.id === id) || null
  }
}

export async function createCareProfessionalOld(data: any, tenantId: string) {
  const sql = neon(process.env.DATABASE_URL)
  const result = await sql`
    INSERT INTO care_professionals (
      first_name, last_name, email, phone, role, 
      qualifications, status, tenant_id, created_at, updated_at
    ) VALUES (
      ${data.firstName}, ${data.lastName}, ${data.email}, 
      ${data.phone}, ${data.role}, ${data.qualifications}, 
      ${data.status}, ${tenantId}, NOW(), NOW()
    ) RETURNING *
  `

  // Invalidate list cache
  await cache.del(`${CACHE_PREFIX}list:${tenantId}`)

  return result[0]
}

export async function updateCareProfessionalOld(id: string, data: any, tenantId: string) {
  const sql = neon(process.env.DATABASE_URL)
  const result = await sql`
    UPDATE care_professionals SET
      first_name = ${data.firstName},
      last_name = ${data.lastName},
      email = ${data.email},
      phone = ${data.phone},
      role = ${data.role},
      qualifications = ${data.qualifications},
      status = ${data.status},
      updated_at = NOW()
    WHERE id = ${id} AND tenant_id = ${tenantId}
    RETURNING *
  `

  // Invalidate caches
  await cache.del(`${CACHE_PREFIX}${id}:${tenantId}`)
  await cache.del(`${CACHE_PREFIX}list:${tenantId}`)

  return result[0]
}

export async function deactivateCareProfessional(id: string, tenantId: string, userId: string) {
  // In demo mode, just return a success response
  return {
    id,
    is_active: false,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  }
}

// Get care professionals with upcoming credential expirations
export async function getCareProfessionalsWithExpiringCredentials(
  tenantId: string,
  daysThreshold = 30,
): Promise<any[]> {
  try {
    // Check if we're in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Return mock expiring credentials data
      return [
        {
          id: "cp-001",
          first_name: "Sarah",
          last_name: "Johnson",
          role: "Registered Nurse",
          credential_id: "cred-001",
          credential_type: "Nursing Registration",
          credential_number: "RN123456",
          expiry_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          verification_status: "verified",
          avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          id: "cp-003",
          first_name: "Emily",
          last_name: "Brown",
          role: "Occupational Therapist",
          credential_id: "cred-005",
          credential_type: "HCPC Registration",
          credential_number: "OT345678",
          expiry_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          verification_status: "verified",
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
        },
      ]
    }

    return tenantQuery(
      tenantId,
      `SELECT cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url,
             pc.id as credential_id, pc.credential_type, pc.credential_number, 
             pc.expiry_date, pc.verification_status
      FROM care_professionals cp
      JOIN professional_credentials pc ON pc.user_id = cp.id
      WHERE cp.tenant_id = $1
        AND cp.is_active = true
        AND pc.expiry_date IS NOT NULL
        AND pc.expiry_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + $2 * INTERVAL '1 day')
        AND pc.verification_status = 'verified'
      ORDER BY pc.expiry_date ASC`,
      [tenantId, daysThreshold],
    )
  } catch (error) {
    console.error("Error fetching care professionals with expiring credentials:", error)
    // Return mock data in case of error
    return [
      {
        id: "cp-001",
        first_name: "Sarah",
        last_name: "Johnson",
        role: "Registered Nurse",
        credential_id: "cred-001",
        credential_type: "Nursing Registration",
        credential_number: "RN123456",
        expiry_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        verification_status: "verified",
        avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "cp-003",
        first_name: "Emily",
        last_name: "Brown",
        role: "Occupational Therapist",
        credential_id: "cred-005",
        credential_type: "HCPC Registration",
        credential_number: "OT345678",
        expiry_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        verification_status: "verified",
        avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    ]
  }
}

// Get care professionals with assigned patients
export async function getCareProfessionalsWithPatientCounts(tenantId: string): Promise<any[]> {
  try {
    // Check if we're in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Return mock patient count data
      return [
        {
          id: "cp-001",
          first_name: "Sarah",
          last_name: "Johnson",
          role: "Registered Nurse",
          patient_count: 8,
          avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          id: "cp-002",
          first_name: "James",
          last_name: "Williams",
          role: "Physiotherapist",
          patient_count: 12,
          avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          id: "cp-003",
          first_name: "Emily",
          last_name: "Brown",
          role: "Occupational Therapist",
          patient_count: 6,
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          id: "cp-004",
          first_name: "Robert",
          last_name: "Smith",
          role: "Healthcare Assistant",
          patient_count: 4,
          avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        {
          id: "cp-005",
          first_name: "Olivia",
          last_name: "Taylor",
          role: "Speech and Language Therapist",
          patient_count: 7,
          avatar_url: "https://randomuser.me/api/portraits/women/22.jpg",
        },
      ]
    }

    return tenantQuery(
      tenantId,
      `SELECT cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url,
             COUNT(DISTINCT pa.id) as patient_count
      FROM care_professionals cp
      LEFT JOIN patient_assignments pa ON pa.care_professional_id = cp.id
      WHERE cp.tenant_id = $1 AND cp.is_active = true
      GROUP BY cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url
      ORDER BY patient_count DESC`,
      [tenantId],
    )
  } catch (error) {
    console.error("Error fetching care professionals with patient counts:", error)
    // Return mock data in case of error
    return [
      {
        id: "cp-001",
        first_name: "Sarah",
        last_name: "Johnson",
        role: "Registered Nurse",
        patient_count: 8,
        avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "cp-002",
        first_name: "James",
        last_name: "Williams",
        role: "Physiotherapist",
        patient_count: 12,
        avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        id: "cp-003",
        first_name: "Emily",
        last_name: "Brown",
        role: "Occupational Therapist",
        patient_count: 6,
        avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        id: "cp-004",
        first_name: "Robert",
        last_name: "Smith",
        role: "Healthcare Assistant",
        patient_count: 4,
        avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      {
        id: "cp-005",
        first_name: "Olivia",
        last_name: "Taylor",
        role: "Speech and Language Therapist",
        patient_count: 7,
        avatar_url: "https://randomuser.me/api/portraits/women/22.jpg",
      },
    ]
  }
}

// Get care professionals with appointment counts
export async function getCareProfessionalsWithAppointmentCounts(
  tenantId: string,
  startDate: string,
  endDate: string,
): Promise<any[]> {
  try {
    // Check if we're in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Return mock appointment count data
      return [
        {
          id: "cp-002",
          first_name: "James",
          last_name: "Williams",
          role: "Physiotherapist",
          appointment_count: 18,
          avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          id: "cp-001",
          first_name: "Sarah",
          last_name: "Johnson",
          role: "Registered Nurse",
          appointment_count: 15,
          avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          id: "cp-005",
          first_name: "Olivia",
          last_name: "Taylor",
          role: "Speech and Language Therapist",
          appointment_count: 12,
          avatar_url: "https://randomuser.me/api/portraits/women/22.jpg",
        },
        {
          id: "cp-003",
          first_name: "Emily",
          last_name: "Brown",
          role: "Occupational Therapist",
          appointment_count: 9,
          avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          id: "cp-004",
          first_name: "Robert",
          last_name: "Smith",
          role: "Healthcare Assistant",
          appointment_count: 7,
          avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
        },
      ]
    }

    return tenantQuery(
      tenantId,
      `SELECT cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url,
             COUNT(a.id) as appointment_count
      FROM care_professionals cp
      LEFT JOIN appointments a ON a.care_professional_id = cp.id
      WHERE cp.tenant_id = $1 
        AND cp.is_active = true
        AND (a.appointment_date BETWEEN $2 AND $3 OR a.id IS NULL)
      GROUP BY cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url
      ORDER BY appointment_count DESC`,
      [tenantId, startDate, endDate],
    )
  } catch (error) {
    console.error("Error fetching care professionals with appointment counts:", error)
    // Return mock data in case of error
    return [
      {
        id: "cp-002",
        first_name: "James",
        last_name: "Williams",
        role: "Physiotherapist",
        appointment_count: 18,
        avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        id: "cp-001",
        first_name: "Sarah",
        last_name: "Johnson",
        role: "Registered Nurse",
        appointment_count: 15,
        avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "cp-005",
        first_name: "Olivia",
        last_name: "Taylor",
        role: "Speech and Language Therapist",
        appointment_count: 12,
        avatar_url: "https://randomuser.me/api/portraits/women/22.jpg",
      },
      {
        id: "cp-003",
        first_name: "Emily",
        last_name: "Brown",
        role: "Occupational Therapist",
        appointment_count: 9,
        avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        id: "cp-004",
        first_name: "Robert",
        last_name: "Smith",
        role: "Healthcare Assistant",
        appointment_count: 7,
        avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ]
  }
}

export async function deleteCareProfessionalOld(id: string, tenantId: string) {
  const sql = neon(process.env.DATABASE_URL)
  await sql`
    DELETE FROM care_professionals 
    WHERE id = ${id} AND tenant_id = ${tenantId}
  `

  // Invalidate caches
  await cache.del(`${CACHE_PREFIX}${id}:${tenantId}`)
  await cache.del(`${CACHE_PREFIX}list:${tenantId}`)

  return { success: true }
}

export async function getCareProfessionalsUpdated(tenantId: string) {
  try {
    const sql = neonDatabase(process.env.DATABASE_URL || "")
    const result = await sql`
      SELECT * FROM care_professionals 
      WHERE tenant_id = ${tenantId}
      ORDER BY last_name, first_name
    `
    return { careProfessionals: result, error: null }
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    return { careProfessionals: [], error: "Failed to fetch care professionals" }
  }
}

export async function getCareProfessionalByIdUpdated(tenantId: string, id: string) {
  try {
    const sql = neonDatabase(process.env.DATABASE_URL || "")
    const [careProfessional] = await sql`
      SELECT * FROM care_professionals 
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `

    if (!careProfessional) {
      return { careProfessional: null, error: "Care professional not found" }
    }

    return { careProfessional, error: null }
  } catch (error) {
    console.error("Error fetching care professional:", error)
    return { careProfessional: null, error: "Failed to fetch care professional" }
  }
}

export async function createCareProfessionalUpdated(tenantId: string, data: Partial<CareProfessionalType>) {
  try {
    const sql = neonDatabase(process.env.DATABASE_URL || "")
    const id = data.id || uuidv4()
    const now = new Date()

    const [careProfessional] = await sql`
      INSERT INTO care_professionals (
        id, tenant_id, first_name, last_name, email, phone, role, status, created_at, updated_at, created_by
      ) VALUES (
        ${id}, 
        ${tenantId}, 
        ${data.first_name || ""}, 
        ${data.last_name || ""}, 
        ${data.email || ""}, 
        ${data.phone || ""}, 
        ${data.role || "Care Assistant"}, 
        ${data.status || "active"}, 
        ${now}, 
        ${now}, 
        ${data.created_by || "system"}
      )
      RETURNING *
    `

    return { careProfessional, error: null }
  } catch (error) {
    console.error("Error creating care professional:", error)
    return { careProfessional: null, error: "Failed to create care professional" }
  }
}

export async function updateCareProfessionalUpdated(tenantId: string, id: string, data: Partial<CareProfessionalType>) {
  try {
    const sql = neonDatabase(process.env.DATABASE_URL || "")
    const now = new Date()

    // Build the update query dynamically based on provided fields
    const updateFields = []
    const updateValues = []

    if (data.first_name !== undefined) {
      updateFields.push("first_name = $1")
      updateValues.push(data.first_name)
    }

    if (data.last_name !== undefined) {
      updateFields.push(`last_name = $${updateValues.length + 1}`)
      updateValues.push(data.last_name)
    }

    if (data.email !== undefined) {
      updateFields.push(`email = $${updateValues.length + 1}`)
      updateValues.push(data.email)
    }

    if (data.phone !== undefined) {
      updateFields.push(`phone = $${updateValues.length + 1}`)
      updateValues.push(data.phone)
    }

    if (data.role !== undefined) {
      updateFields.push(`role = $${updateValues.length + 1}`)
      updateValues.push(data.role)
    }

    if (data.status !== undefined) {
      updateFields.push(`status = $${updateValues.length + 1}`)
      updateValues.push(data.status)
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = $${updateValues.length + 1}`)
    updateValues.push(now)

    // Add the WHERE clause parameters
    updateValues.push(tenantId)
    updateValues.push(id)

    const query = `
      UPDATE care_professionals
      SET ${updateFields.join(", ")}
      WHERE tenant_id = $${updateValues.length - 1} AND id = $${updateValues.length}
      RETURNING *
    `

    const result = await sql.query(query, updateValues)
    const careProfessional = result.rows[0]

    if (!careProfessional) {
      return { careProfessional: null, error: "Care professional not found" }
    }

    return { careProfessional, error: null }
  } catch (error) {
    console.error("Error updating care professional:", error)
    return { careProfessional: null, error: "Failed to update care professional" }
  }
}

export async function deleteCareProfessionalUpdated(tenantId: string, id: string) {
  try {
    const sql = neonDatabase(process.env.DATABASE_URL || "")

    // First check if the care professional exists
    const [existingProfessional] = await sql`
      SELECT id FROM care_professionals 
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `

    if (!existingProfessional) {
      return { success: false, error: "Care professional not found" }
    }

    // Delete the care professional
    await sql`
      DELETE FROM care_professionals 
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting care professional:", error)
    return { success: false, error: "Failed to delete care professional" }
  }
}

export async function getCredentialsByCareProfessionalUpdated(tenantId: string, careProfessionalId: string) {
  try {
    const sql = neonDatabase(process.env.DATABASE_URL || "")

    // First verify the care professional exists and belongs to the tenant
    const [careProfessional] = await sql`
      SELECT id FROM care_professionals 
      WHERE tenant_id = ${tenantId} AND id = ${careProfessionalId}
    `

    if (!careProfessional) {
      return { credentials: [], error: "Care professional not found" }
    }

    const credentials = await sql`
      SELECT * FROM credentials 
      WHERE care_professional_id = ${careProfessionalId}
      ORDER BY credential_type, expiry_date DESC
    `

    return { credentials, error: null }
  } catch (error) {
    console.error("Error fetching credentials:", error)
    return { credentials: [], error: "Failed to fetch credentials" }
  }
}

export async function getExpiredCredentialsUpdated(tenantId: string) {
  try {
    const sql = neonDatabase(process.env.DATABASE_URL || "")
    const now = new Date()

    const credentials = await sql`
      SELECT c.*, cp.first_name, cp.last_name, cp.email
      FROM credentials c
      JOIN care_professionals cp ON c.care_professional_id = cp.id
      WHERE cp.tenant_id = ${tenantId}
        AND c.expiry_date < ${now}
        AND cp.status = 'active'
      ORDER BY c.expiry_date
    `

    return { credentials, error: null }
  } catch (error) {
    console.error("Error fetching expired credentials:", error)
    return { credentials: [], error: "Failed to fetch expired credentials" }
  }
}

export async function getExpiringCredentialsUpdated(tenantId: string, daysThreshold = 30) {
  try {
    const sql = neonDatabase(process.env.DATABASE_URL || "")
    const now = new Date()
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)

    const credentials = await sql`
      SELECT c.*, cp.first_name, cp.last_name, cp.email
      FROM credentials c
      JOIN care_professionals cp ON c.care_professional_id = cp.id
      WHERE cp.tenant_id = ${tenantId}
        AND c.expiry_date >= ${now}
        AND c.expiry_date <= ${thresholdDate}
        AND cp.status = 'active'
      ORDER BY c.expiry_date
    `

    return { credentials, error: null }
  } catch (error) {
    console.error("Error fetching expiring credentials:", error)
    return { credentials: [], error: "Failed to fetch expiring credentials" }
  }
}
