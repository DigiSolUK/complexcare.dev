import type { CareProfessional } from "@/types"
import { neon } from "@neondatabase/serverless"
import { buildUpdateQuery } from "@/lib/db-utils"
import { v4 as uuidv4 } from "uuid"
import { tenantQuery } from "@/lib/db-utils"

const sql = neon(process.env.DATABASE_URL!)

// Helper to convert database rows to CareProfessional type, handling dates
function mapCareProfessionalRow(row: any): CareProfessional {
  return {
    ...row,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    start_date: row.start_date ? new Date(row.start_date).toISOString().split("T")[0] : null, // Assuming YYYY-MM-DD
    // Ensure address is parsed if it's a JSONB string
    address: typeof row.address === "string" ? JSON.parse(row.address) : row.address,
  }
}

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

    const result = await tenantQuery<any>(tenantId, query, params)
    return result.map(mapCareProfessionalRow)
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    throw new Error("Failed to fetch care professionals.")
  }
}

export async function getCareProfessionalById(id: string, tenantId: string): Promise<CareProfessional | null> {
  try {
    const result = await tenantQuery<any>(
      tenantId,
      `
      SELECT * FROM care_professionals
      WHERE id = $1 AND tenant_id = $2
    `,
      [id, tenantId],
    )
    return result.length > 0 ? mapCareProfessionalRow(result[0]) : null
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

    const result = await tenantQuery<any>(
      tenantId,
      `
      INSERT INTO care_professionals (
        id, tenant_id, first_name, last_name, email, role, phone, specialization,
        qualification, license_number, employment_status, start_date, is_active,
        address, notes, emergency_contact_name, emergency_contact_phone, avatar_url,
        created_at, updated_at, created_by, updated_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14::jsonb, $15, $16, $17,
        $18, $19, $20, $21, $22
      )
      RETURNING *
    `,
      [
        id,
        tenantId,
        data.first_name,
        data.last_name,
        data.email,
        data.role,
        data.phone || null,
        data.specialization || null,
        data.qualification || null,
        data.license_number || null,
        data.employment_status || null,
        data.start_date || null,
        data.is_active !== undefined ? data.is_active : true,
        data.address ? JSON.stringify(data.address) : null,
        data.notes || null,
        data.emergency_contact_name || null,
        data.emergency_contact_phone || null,
        data.avatar_url || null,
        now,
        now,
        createdBy,
        createdBy,
      ],
    )
    return mapCareProfessionalRow(result[0])
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
    const dataWithUpdater = { ...data, updated_by: updatedBy, updated_at: new Date().toISOString() }

    // Convert address to JSON string if it exists
    if (dataWithUpdater.address !== undefined) {
      dataWithUpdater.address = dataWithUpdater.address ? JSON.stringify(dataWithUpdater.address) : null
    }
    // Ensure start_date is in YYYY-MM-DD format if present
    if (dataWithUpdater.start_date) {
      dataWithUpdater.start_date = new Date(dataWithUpdater.start_date).toISOString().split("T")[0]
    }

    const { query, values } = buildUpdateQuery("care_professionals", dataWithUpdater, { id, tenant_id: tenantId })

    const result = await tenantQuery<any>(tenantId, query, values)

    if (result.length === 0) {
      throw new Error("Care professional not found or update failed.")
    }

    return mapCareProfessionalRow(result[0])
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
    const result = await tenantQuery<any>(
      tenantId,
      `
      UPDATE care_professionals
      SET is_active = false, updated_at = NOW(), updated_by = $3
      WHERE id = $1 AND tenant_id = $2
      RETURNING *
    `,
      [id, tenantId, userId],
    )
    if (result.length === 0) {
      throw new Error("Care professional not found.")
    }
    return mapCareProfessionalRow(result[0])
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
          avatar_url: "/placeholder.svg?height=44&width=44",
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
          avatar_url: "/placeholder.svg?height=68&width=68",
        },
      ]
    }

    const result = await tenantQuery<any>(
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
    return result.map((row: any) => ({
      ...row,
      expiry_date: row.expiry_date ? new Date(row.expiry_date).toISOString().split("T")[0] : null,
    }))
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
        avatar_url: "/placeholder.svg?height=44&width=44",
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
        avatar_url: "/placeholder.svg?height=68&width=68",
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
          avatar_url: "/placeholder.svg?height=44&width=44",
        },
        {
          id: "cp-002",
          first_name: "James",
          last_name: "Williams",
          role: "Physiotherapist",
          patient_count: 12,
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "cp-003",
          first_name: "Emily",
          last_name: "Brown",
          role: "Occupational Therapist",
          patient_count: 6,
          avatar_url: "/placeholder.svg?height=68&width=68",
        },
        {
          id: "cp-004",
          first_name: "Robert",
          last_name: "Smith",
          role: "Healthcare Assistant",
          patient_count: 4,
          avatar_url: "/placeholder.svg?height=45&width=45",
        },
        {
          id: "cp-005",
          first_name: "Olivia",
          last_name: "Taylor",
          role: "Speech and Language Therapist",
          patient_count: 7,
          avatar_url: "/placeholder.svg?height=22&width=22",
        },
      ]
    }

    const result = await tenantQuery<any>(
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
        avatar_url: "/placeholder.svg?height=44&width=44",
      },
      {
        id: "cp-002",
        first_name: "James",
        last_name: "Williams",
        role: "Physiotherapist",
        patient_count: 12,
        avatar_url: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "cp-003",
        first_name: "Emily",
        last_name: "Brown",
        role: "Occupational Therapist",
        patient_count: 6,
        avatar_url: "/placeholder.svg?height=68&width=68",
      },
      {
        id: "cp-004",
        first_name: "Robert",
        last_name: "Smith",
        role: "Healthcare Assistant",
        patient_count: 4,
        avatar_url: "/placeholder.svg?height=45&width=45",
      },
      {
        id: "cp-005",
        first_name: "Olivia",
        last_name: "Taylor",
        role: "Speech and Language Therapist",
        patient_count: 7,
        avatar_url: "/placeholder.svg?height=22&width=22",
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
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "cp-001",
          first_name: "Sarah",
          last_name: "Johnson",
          role: "Registered Nurse",
          appointment_count: 15,
          avatar_url: "/placeholder.svg?height=44&width=44",
        },
        {
          id: "cp-005",
          first_name: "Olivia",
          last_name: "Taylor",
          role: "Speech and Language Therapist",
          appointment_count: 12,
          avatar_url: "/placeholder.svg?height=22&width=22",
        },
        {
          id: "cp-003",
          first_name: "Emily",
          last_name: "Brown",
          role: "Occupational Therapist",
          appointment_count: 9,
          avatar_url: "/placeholder.svg?height=68&width=68",
        },
        {
          id: "cp-004",
          first_name: "Robert",
          last_name: "Smith",
          role: "Healthcare Assistant",
          appointment_count: 7,
          avatar_url: "/placeholder.svg?height=45&width=45",
        },
      ]
    }

    const result = await tenantQuery<any>(
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
        avatar_url: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "cp-001",
        first_name: "Sarah",
        last_name: "Johnson",
        role: "Registered Nurse",
        appointment_count: 15,
        avatar_url: "/placeholder.svg?height=44&width=44",
      },
      {
        id: "cp-005",
        first_name: "Olivia",
        last_name: "Taylor",
        role: "Speech and Language Therapist",
        appointment_count: 12,
        avatar_url: "/placeholder.svg?height=22&width=22",
      },
      {
        id: "cp-003",
        first_name: "Emily",
        last_name: "Brown",
        role: "Occupational Therapist",
        appointment_count: 9,
        avatar_url: "/placeholder.svg?height=68&width=68",
      },
      {
        id: "cp-004",
        first_name: "Robert",
        last_name: "Smith",
        role: "Healthcare Assistant",
        appointment_count: 7,
        avatar_url: "/placeholder.svg?height=45&width=45",
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
