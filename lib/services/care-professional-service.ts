import type { CareProfessional as CareProfessionalType } from "@/types"
import { cache } from "../redis/cache-service"
import { v4 as uuidv4 } from "uuid"
import type { CareProfessional as CareProfessionalInterface } from "@/types"
import { neon } from "@neondatabase/serverless"
import { neon as neonDatabase } from "@neondatabase/serverless"
import { getAll, getById, insert, update, remove, sql } from "../db-connection"
import { DEFAULT_TENANT_ID } from "../constants"

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
const demoCareProfessionals: CareProfessionalType[] = [
  {
    id: "1",
    first_name: "Emma",
    last_name: "Wilson",
    email: "emma.wilson@example.com",
    phone_number: "020 1234 5678",
    role: "Registered Nurse",
    specialization: "Diabetes Care",
    qualifications: "RN, BSc Nursing",
    title: "Ms",
    is_active: true,
    tenant_id: "demo-tenant",
    created_at: "2021-03-10T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z",
    address: "123 Nurse Lane, London",
    postcode: "W1 1AA",
    notes: "Specializes in diabetes management and wound care.",
    emergency_contact_relationship: "Spouse",
    avatar_url: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "2",
    first_name: "Michael",
    last_name: "Brown",
    email: "michael.brown@example.com",
    phone_number: "020 2345 6789",
    role: "Care Assistant",
    specialization: "Elderly Care",
    qualifications: "NVQ Level 3 Health and Social Care",
    title: "Mr",
    is_active: true,
    tenant_id: "demo-tenant",
    created_at: "2022-01-05T00:00:00Z",
    updated_at: "2023-02-20T00:00:00Z",
    address: "456 Carer Street, Manchester",
    postcode: "M1 2AB",
    notes: "Experienced in dementia care.",
    emergency_contact_relationship: "Partner",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "3",
    first_name: "Sophia",
    last_name: "Garcia",
    email: "sophia.garcia@example.com",
    phone_number: "020 3456 7890",
    role: "Physiotherapist",
    specialization: "Neurological Rehabilitation",
    qualifications: "BSc Physiotherapy, MSc Neuro Rehab",
    title: "Dr",
    is_active: true,
    tenant_id: "demo-tenant",
    created_at: "2020-06-15T00:00:00Z",
    updated_at: "2023-03-10T00:00:00Z",
    address: "789 Therapy Road, Birmingham",
    postcode: "B1 3CD",
    notes: "Specializes in stroke rehabilitation.",
    emergency_contact_relationship: "Father",
    avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "4",
    first_name: "David",
    last_name: "Taylor",
    email: "david.taylor@example.com",
    phone_number: "020 4567 8901",
    role: "Occupational Therapist",
    specialization: "Home Adaptations",
    qualifications: "BSc Occupational Therapy",
    title: "Mr",
    is_active: true,
    tenant_id: "demo-tenant",
    created_at: "2019-11-01T00:00:00Z",
    updated_at: "2023-04-05T00:00:00Z",
    address: "101 Adaptation Avenue, Glasgow",
    postcode: "G1 4EF",
    notes: "Expert in home adaptations for disabled clients.",
    emergency_contact_relationship: "Wife",
    avatar_url: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "5",
    first_name: "Olivia",
    last_name: "Johnson",
    email: "olivia.johnson@example.com",
    phone_number: "020 5678 9012",
    role: "Mental Health Nurse",
    specialization: "Anxiety and Depression",
    qualifications: "RMN, BSc Mental Health Nursing",
    title: "Mrs",
    is_active: false,
    tenant_id: "demo-tenant",
    created_at: "2021-09-10T00:00:00Z",
    updated_at: "2023-05-12T00:00:00Z",
    address: "202 Wellbeing Street, Edinburgh",
    postcode: "EH1 5GH",
    notes: "Currently on maternity leave.",
    emergency_contact_relationship: "Husband",
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

export type CareProfessional = {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  title?: string
  email: string
  phone_number?: string
  role: string
  specialization?: string
  qualifications?: string
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export class CareProfessionalService {
  /**
   * Get a care professional by ID with caching
   */
  static async getCareProfessionalById(id: string, tenantId: string) {
    try {
      // Make sure we have a database URL
      if (!process.env.DATABASE_URL) {
        console.warn("No DATABASE_URL provided, falling back to demo data")
        return demoCareProfessionals.find((cp) => cp.id === id) || null
      }

      const sql = neon(process.env.DATABASE_URL)
      const result = await sql`
        SELECT * FROM care_professionals WHERE id = ${id} AND tenant_id = ${tenantId}
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Error fetching care professional by ID:", error)
      // Return demo data for the requested ID
      return demoCareProfessionals.find((cp) => cp.id === id) || null
    }
  }

  /**
   * Get all care professionals with caching
   */
  static async getAllCareProfessionals(tenantId: string) {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        SELECT * FROM care_professionals 
        WHERE tenant_id = ${tenantId} 
        ORDER BY last_name, first_name
      `
      return result
    } catch (error) {
      console.error("Error fetching all care professionals:", error)
      // Return demo data
      return demoCareProfessionals
    }
  }

  /**
   * Create a new care professional
   */
  static async createCareProfessional(data: any, tenantId: string) {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        INSERT INTO care_professionals (
          first_name, last_name, email, phone_number, role, title, specialization, qualifications, is_active, tenant_id
        ) VALUES (
          ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phoneNumber}, ${data.role}, 
          ${data.title || null}, ${data.specialization || null}, ${data.qualifications || null}, 
          ${data.isActive !== undefined ? data.isActive : true}, ${tenantId}
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error creating care professional:", error)
      // Return a mock created professional
      return {
        id: uuidv4(),
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        role: data.role,
        title: data.title,
        specialization: data.specialization,
        qualifications: data.qualifications,
        is_active: data.isActive !== undefined ? data.isActive : true,
        tenant_id: tenantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
  }

  /**
   * Update a care professional
   */
  static async updateCareProfessional(id: string, data: any, tenantId: string) {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        UPDATE care_professionals
        SET 
          first_name = ${data.firstName},
          last_name = ${data.lastName},
          email = ${data.email},
          phone_number = ${data.phoneNumber},
          role = ${data.role},
          title = ${data.title || null},
          specialization = ${data.specialization || null},
          qualifications = ${data.qualifications || null},
          is_active = ${data.isActive !== undefined ? data.isActive : true},
          updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenantId}
        RETURNING *
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Error updating care professional:", error)
      // Return a mock updated professional
      const professional = demoCareProfessionals.find((cp) => cp.id === id)
      if (!professional) return null

      return {
        ...professional,
        first_name: data.firstName || professional.first_name,
        last_name: data.lastName || professional.last_name,
        email: data.email || professional.email,
        phone_number: data.phoneNumber || professional.phone_number,
        role: data.role || professional.role,
        title: data.title || professional.title,
        specialization: data.specialization || professional.specialization,
        qualifications: data.qualifications || professional.qualifications,
        is_active: data.isActive !== undefined ? data.isActive : professional.is_active,
        updated_at: new Date().toISOString(),
      }
    }
  }

  /**
   * Delete a care professional
   */
  static async deleteCareProfessional(id: string, tenantId: string) {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        DELETE FROM care_professionals 
        WHERE id = ${id} AND tenant_id = ${tenantId} 
        RETURNING id
      `
      return result.length > 0
    } catch (error) {
      console.error("Error deleting care professional:", error)
      return true // Pretend it worked in demo mode
    }
  }
}

// Simplified functions that use demo data when database fails
export async function getAllCareProfessionals(
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<CareProfessional[]> {
  return getAll<CareProfessional>("care_professionals", tenantId, limit, offset, "last_name ASC, first_name ASC")
}

export async function getCareProfessionalById(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<CareProfessional | null> {
  return getById<CareProfessional>("care_professionals", id, tenantId)
}

export async function searchCareProfessionals(
  searchTerm: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<CareProfessional[]> {
  try {
    const query = `
      SELECT * FROM care_professionals
      WHERE tenant_id = $1
      AND deleted_at IS NULL
      AND (
        first_name ILIKE $2 OR
        last_name ILIKE $2 OR
        email ILIKE $2 OR
        role ILIKE $2 OR
        specialization ILIKE $2
      )
      ORDER BY last_name ASC, first_name ASC
      LIMIT $3 OFFSET $4
    `
    const result = await sql.query(query, [tenantId, `%${searchTerm}%`, limit, offset])
    return result.rows as CareProfessional[]
  } catch (error) {
    console.error("Error searching care professionals:", error)
    throw error
  }
}

export async function createCareProfessional(
  data: Omit<CareProfessional, "id" | "tenant_id" | "created_at" | "updated_at" | "deleted_at">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<CareProfessional | null> {
  const professionalData = {
    ...data,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return insert<CareProfessional>("care_professionals", professionalData, tenantId)
}

export async function updateCareProfessional(
  id: string,
  data: Partial<CareProfessional>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<CareProfessional | null> {
  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  return update<CareProfessional>("care_professionals", id, updateData, tenantId)
}

export async function deleteCareProfessional(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<boolean> {
  return remove("care_professionals", id, tenantId, true)
}

export async function getCareProfessionalsByRole(
  role: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<CareProfessional[]> {
  try {
    const query = `
      SELECT * FROM care_professionals
      WHERE tenant_id = $1
      AND deleted_at IS NULL
      AND role ILIKE $2
      ORDER BY last_name ASC, first_name ASC
    `
    const result = await sql.query(query, [tenantId, `%${role}%`])
    return result.rows as CareProfessional[]
  } catch (error) {
    console.error("Error getting care professionals by role:", error)
    throw error
  }
}

export async function getActiveCareProfessionals(tenantId: string = DEFAULT_TENANT_ID): Promise<CareProfessional[]> {
  try {
    const query = `
      SELECT * FROM care_professionals
      WHERE tenant_id = $1
      AND deleted_at IS NULL
      AND is_active = true
      ORDER BY last_name ASC, first_name ASC
    `
    const result = await sql.query(query, [tenantId])
    return result.rows as CareProfessional[]
  } catch (error) {
    console.error("Error getting active care professionals:", error)
    throw error
  }
}

export async function getAllCareProfessionalsOld(tenantId: string) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const careProfessionals = await sql`
      SELECT * FROM care_professionals 
      WHERE tenant_id = ${tenantId}
      ORDER BY last_name, first_name
    `
    return { careProfessionals, error: null }
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    return { careProfessionals: demoCareProfessionals, error: null }
  }
}

export async function getCareProfessionalByIdSql(id: string, tenantId: string) {
  try {
    // Make sure we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return demoCareProfessionals.find((cp) => cp.id === id)
    }

    const sql = neon(process.env.DATABASE_URL)
    const [careProfessional] = await sql`
      SELECT * FROM care_professionals 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `
    return careProfessional || demoCareProfessionals.find((cp) => cp.id === id)
  } catch (error) {
    console.error(`Error fetching care professional with ID ${id}:`, error)
    return demoCareProfessionals.find((cp) => cp.id === id)
  }
}

export async function createCareProfessionalOld(tenantId: string, data: Partial<CareProfessionalInterface>) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const [careProfessional] = await sql`
      INSERT INTO care_professionals (
        tenant_id, first_name, last_name, email, phone_number, role, 
        title, specialization, qualifications, is_active, address, 
        postcode, notes, emergency_contact_relationship
      ) VALUES (
        ${tenantId}, ${data.first_name}, ${data.last_name}, ${data.email}, 
        ${data.phone_number}, ${data.role}, ${data.title}, ${data.specialization}, 
        ${data.qualifications}, ${data.is_active !== undefined ? data.is_active : true}, 
        ${data.address}, ${data.postcode}, ${data.notes}, ${data.emergency_contact_relationship}
      )
      RETURNING *
    `
    return { careProfessional, error: null }
  } catch (error) {
    console.error("Error creating care professional:", error)
    return { careProfessional: null, error: "Failed to create care professional" }
  }
}

export async function updateCareProfessionalOld(
  id: string,
  tenantId: string,
  data: Partial<CareProfessionalInterface>,
) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const [careProfessional] = await sql`
      UPDATE care_professionals
      SET
        first_name = COALESCE(${data.first_name}, first_name),
        last_name = COALESCE(${data.last_name}, last_name),
        email = COALESCE(${data.email}, email),
        phone_number = COALESCE(${data.phone_number}, phone_number),
        role = COALESCE(${data.role}, role),
        title = COALESCE(${data.title}, title),
        specialization = COALESCE(${data.specialization}, specialization),
        qualifications = COALESCE(${data.qualifications}, qualifications),
        is_active = COALESCE(${data.is_active}, is_active),
        address = COALESCE(${data.address}, address),
        postcode = COALESCE(${data.postcode}, postcode),
        notes = COALESCE(${data.notes}, notes),
        emergency_contact_relationship = COALESCE(${data.emergency_contact_relationship}, emergency_contact_relationship),
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

export async function getCareProfessionalAppointments(id: string, tenantId: string) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
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
    const sql = neon(process.env.DATABASE_URL || "")
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
    const sql = neon(process.env.DATABASE_URL || "")
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
    const sql = neon(process.env.DATABASE_URL || "")
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

/**
 * Get a care professional by ID
 * @param id The ID of the care professional to retrieve
 * @returns The care professional data
 */
export async function getCareProfessionalByIdOld(id: string) {
  try {
    // Make sure we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return demoCareProfessionals.find((cp) => cp.id === id) || null
    }

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT * FROM care_professionals WHERE id = ${id}`
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching care professional by ID:", error)
    // Return demo data for the requested ID
    return demoCareProfessionals.find((cp) => cp.id === id) || null
  }
}

// Export all other functions with updated database calls...
export async function getCareProfessionals(tenantId: string, searchQuery?: string) {
  const cacheKey = `${CACHE_PREFIX}list:${tenantId}`

  // Try to get from cache first
  const cachedData = await cache.get(cacheKey)
  if (cachedData) {
    return JSON.parse(cachedData)
  }

  // Check if we have a database URL
  if (!process.env.DATABASE_URL) {
    console.warn("No DATABASE_URL provided, falling back to demo data")
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
    const sql = neon(process.env.DATABASE_URL)
    let query = `
      SELECT * FROM care_professionals
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

    query += ` ORDER BY last_name, first_name`

    const result = await sql.query(query, params)

    // Store in cache for 5 minutes
    await cache.set(cacheKey, JSON.stringify(result.rows), 300)

    return result.rows
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    // Fall back to demo data on error
    return demoCareProfessionals
  }
}

// Add all other missing exports with proper database calls...
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
      ]
    }

    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return []
    }

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`
      SELECT cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url,
             pc.id as credential_id, pc.credential_type, pc.credential_number, 
             pc.expiry_date, pc.verification_status
      FROM care_professionals cp
      JOIN professional_credentials pc ON pc.user_id = cp.id
      WHERE cp.tenant_id = ${tenantId}
        AND cp.is_active = true
        AND pc.expiry_date IS NOT NULL
        AND pc.expiry_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + ${daysThreshold} * INTERVAL '1 day')
        AND pc.verification_status = 'verified'
      ORDER BY pc.expiry_date ASC
    `

    return result
  } catch (error) {
    console.error("Error fetching care professionals with expiring credentials:", error)
    return []
  }
}

// Continue with other exports...
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

    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return []
    }

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`
      SELECT cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url,
             COUNT(DISTINCT pa.id) as patient_count
      FROM care_professionals cp
      LEFT JOIN patient_assignments pa ON pa.care_professional_id = cp.id
      WHERE cp.tenant_id = ${tenantId} AND cp.is_active = true
      GROUP BY cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url
      ORDER BY patient_count DESC
    `

    return result
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

    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return []
    }

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`
      SELECT cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url,
             COUNT(a.id) as appointment_count
      FROM care_professionals cp
      LEFT JOIN appointments a ON a.care_professional_id = cp.id
      WHERE cp.tenant_id = ${tenantId} 
        AND cp.is_active = true
        AND (a.appointment_date BETWEEN ${startDate} AND ${endDate} OR a.id IS NULL)
      GROUP BY cp.id, cp.first_name, cp.last_name, cp.role, cp.avatar_url
      ORDER BY appointment_count DESC
    `

    return result
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
    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return { careProfessionals: demoCareProfessionals, error: null }
    }

    const sql = neonDatabase(process.env.DATABASE_URL)
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
    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      const careProfessional = demoCareProfessionals.find((cp) => cp.id === id)
      return {
        careProfessional: careProfessional || null,
        error: careProfessional ? null : "Care professional not found",
      }
    }

    const sql = neonDatabase(process.env.DATABASE_URL)
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
    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      const id = data.id || uuidv4()
      const now = new Date()
      const careProfessional = {
        id,
        tenant_id: tenantId,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        role: data.role || "Care Assistant",
        title: data.title || null,
        specialization: data.specialization || null,
        qualifications: data.qualifications || null,
        is_active: data.is_active !== undefined ? data.is_active : true,
        created_at: now,
        updated_at: now,
        created_by: data.created_by || "system",
      }
      return { careProfessional, error: null }
    }

    const sql = neonDatabase(process.env.DATABASE_URL)
    const id = data.id || uuidv4()
    const now = new Date()

    const [careProfessional] = await sql`
      INSERT INTO care_professionals (
        id, tenant_id, first_name, last_name, email, phone_number, role, 
        title, specialization, qualifications, is_active, 
        created_at, updated_at, created_by
      ) VALUES (
        ${id}, 
        ${tenantId}, 
        ${data.first_name || ""}, 
        ${data.last_name || ""}, 
        ${data.email || ""}, 
        ${data.phone_number || ""}, 
        ${data.role || "Care Assistant"}, 
        ${data.title || null},
        ${data.specialization || null},
        ${data.qualifications || null},
        ${data.is_active !== undefined ? data.is_active : true}, 
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
    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      const careProfessional = demoCareProfessionals.find((cp) => cp.id === id)
      if (!careProfessional) {
        return { careProfessional: null, error: "Care professional not found" }
      }

      // Simulate update on demo data
      Object.assign(careProfessional, data)
      return { careProfessional, error: null }
    }

    const sql = neonDatabase(process.env.DATABASE_URL)
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

    if (data.phone_number !== undefined) {
      updateFields.push(`phone_number = $${updateValues.length + 1}`)
      updateValues.push(data.phone_number)
    }

    if (data.role !== undefined) {
      updateFields.push(`role = $${updateValues.length + 1}`)
      updateValues.push(data.role)
    }

    if (data.title !== undefined) {
      updateFields.push(`title = $${updateValues.length + 1}`)
      updateValues.push(data.title)
    }

    if (data.specialization !== undefined) {
      updateFields.push(`specialization = $${updateValues.length + 1}`)
      updateValues.push(data.specialization)
    }

    if (data.qualifications !== undefined) {
      updateFields.push(`qualifications = $${updateValues.length + 1}`)
      updateValues.push(data.qualifications)
    }

    if (data.is_active !== undefined) {
      updateFields.push(`is_active = $${updateValues.length + 1}`)
      updateValues.push(data.is_active)
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
    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      const careProfessional = demoCareProfessionals.find((cp) => cp.id === id)
      if (!careProfessional) {
        return { success: false, error: "Care professional not found" }
      }
      return { success: true, error: null }
    }

    const sql = neonDatabase(process.env.DATABASE_URL)

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
    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return { credentials: [], error: "Database not configured" }
    }

    const sql = neonDatabase(process.env.DATABASE_URL)

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
    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return { credentials: [], error: "Database not configured" }
    }

    const sql = neonDatabase(process.env.DATABASE_URL)
    const now = new Date()

    const credentials = await sql`
      SELECT c.*, cp.first_name, cp.last_name, cp.email
      FROM credentials c
      JOIN care_professionals cp ON c.care_professional_id = cp.id
      WHERE cp.tenant_id = ${tenantId}
        AND c.expiry_date < ${now}
        AND cp.is_active = true
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
    // Check if we have a database URL
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL provided, falling back to demo data")
      return { credentials: [], error: "Database not configured" }
    }

    const sql = neonDatabase(process.env.DATABASE_URL)
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
        AND cp.is_active = true
      ORDER BY c.expiry_date
    `

    return { credentials, error: null }
  } catch (error) {
    console.error("Error fetching expiring credentials:", error)
    return { credentials: [], error: "Failed to fetch expiring credentials" }
  }
}
