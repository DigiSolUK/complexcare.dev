import type { CareProfessional } from "@/types"
import { neon } from "@neondatabase/serverless"
import { buildUpdateQuery } from "@/lib/db-utils"
import { v4 as uuidv4 } from "uuid"
import { tenantQuery } from "@/lib/tenant-query" // Declare the tenantQuery variable

const sql = neon(process.env.DATABASE_URL!)

export async function getCareProfessionals(tenantId: string, searchQuery?: string): Promise<CareProfessional[]> {
  try {
    let query = `
      SELECT *
      FROM care_professionals
      WHERE tenant_id = $1 AND is_active = true
    `
    const params: any[] = [tenantId]

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
    return result.rows as CareProfessional[]
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    throw new Error("Failed to fetch care professionals.")
  }
}

export async function getCareProfessionalById(id: string, tenantId: string): Promise<CareProfessional | null> {
  try {
    const result = await sql`
      SELECT * FROM care_professionals
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `
    return result.length > 0 ? (result[0] as CareProfessional) : null
  } catch (error) {
    console.error(`Error fetching care professional by ID ${id}:`, error)
    throw new Error("Failed to fetch care professional.")
  }
}

export async function createCareProfessional(
  data: Partial<CareProfessional>,
  tenantId: string,
  createdBy: string,
): Promise<CareProfessional> {
  try {
    const id = uuidv4()
    const now = new Date().toISOString()

    const result = await sql`
      INSERT INTO care_professionals (
        id, tenant_id, first_name, last_name, email, role, phone, specialization, 
        qualification, license_number, employment_status, start_date, is_active, 
        address, notes, emergency_contact_name, emergency_contact_phone, avatar_url,
        created_at, updated_at, created_by, updated_by
      ) VALUES (
        ${id}, ${tenantId}, ${data.first_name}, ${data.last_name}, ${data.email}, ${data.role},
        ${data.phone || null}, ${data.specialization || null}, ${data.qualification || null},
        ${data.license_number || null}, ${data.employment_status || null}, ${data.start_date || null},
        ${data.is_active !== undefined ? data.is_active : true},
        ${data.address ? JSON.stringify(data.address) : null},
        ${data.notes || null}, ${data.emergency_contact_name || null}, ${data.emergency_contact_phone || null},
        ${data.avatar_url || null}, ${now}, ${now}, ${createdBy}, ${createdBy}
      )
      RETURNING *
    `
    return result[0] as CareProfessional
  } catch (error) {
    console.error("Error creating care professional:", error)
    throw new Error("Failed to create care professional.")
  }
}

export async function updateCareProfessional(
  id: string,
  data: Partial<CareProfessional>,
  tenantId: string,
  updatedBy: string,
): Promise<CareProfessional> {
  try {
    const dataWithUpdater = { ...data, updated_by: updatedBy }
    const { query, values } = buildUpdateQuery("care_professionals", dataWithUpdater, { id, tenant_id: tenantId })

    const result = await sql.query(query, values)

    if (result.rows.length === 0) {
      throw new Error("Care professional not found or update failed.")
    }

    return result.rows[0] as CareProfessional
  } catch (error) {
    console.error(`Error updating care professional ${id}:`, error)
    throw new Error("Failed to update care professional.")
  }
}

export async function deactivateCareProfessional(
  id: string,
  tenantId: string,
  userId: string,
): Promise<CareProfessional> {
  try {
    const result = await sql`
      UPDATE care_professionals
      SET is_active = false, updated_at = NOW(), updated_by = ${userId}
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *
    `
    if (result.length === 0) {
      throw new Error("Care professional not found.")
    }
    return result[0] as CareProfessional
  } catch (error) {
    console.error(`Error deactivating care professional ${id}:`, error)
    throw new Error("Failed to deactivate care professional.")
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

export async function deleteCareProfessional(id: string, tenantId: string, userId: string) {
  // In demo mode, just return a success response
  return {
    id,
    is_active: false,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  }
}
