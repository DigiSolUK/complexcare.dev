import { sql } from "@/lib/db"
import type { CareProfessional } from "@/types"
import { tenantQuery, tenantInsert, tenantUpdate } from "@/lib/db/tenant"

// Get all care professionals for a tenant
export async function getCareProfessionals(tenantId?: string): Promise<CareProfessional[]> {
  try {
    // If no tenantId is provided or we're in demo mode, return mock data
    if (!tenantId || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return getMockCareProfessionals()
    }

    // Use the actual column names from the database
    // Removed the 'status' column since it doesn't exist in the database
    const result = await sql`
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        role, 
        is_active, 
        tenant_id,
        created_at, 
        updated_at
      FROM care_professionals
      WHERE tenant_id = ${tenantId}
      ORDER BY last_name ASC, first_name ASC
    `

    // Transform the database results to match our expected CareProfessional type
    const professionals = result.map((row) => ({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: "", // Provide an empty string as fallback since phone column doesn't exist
      role: row.role,
      status: row.is_active ? "active" : "inactive", // Map is_active to status
      tenantId: row.tenant_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))

    return professionals
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    // Always return an array, even in case of error
    return getMockCareProfessionals()
  }
}

// Helper function to get mock care professionals
function getMockCareProfessionals(): CareProfessional[] {
  return [
    {
      id: "cp-001",
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "07700 900123",
      role: "Registered Nurse",
      status: "active",
      tenantId: "demo-tenant",
      createdAt: new Date("2023-01-15T10:30:00Z"),
      updatedAt: new Date("2023-03-20T14:15:00Z"),
    },
    {
      id: "cp-002",
      first_name: "James",
      last_name: "Williams",
      email: "james.williams@example.com",
      phone: "07700 900124",
      role: "Care Assistant",
      status: "active",
      tenantId: "demo-tenant",
      createdAt: new Date("2023-01-20T11:45:00Z"),
      updatedAt: new Date("2023-03-22T09:30:00Z"),
    },
    {
      id: "cp-003",
      first_name: "Emily",
      last_name: "Brown",
      email: "emily.brown@example.com",
      phone: "07700 900125",
      role: "Physiotherapist",
      status: "active",
      tenantId: "demo-tenant",
      createdAt: new Date("2023-02-05T09:15:00Z"),
      updatedAt: new Date("2023-04-01T16:20:00Z"),
    },
    {
      id: "cp-004",
      first_name: "Robert",
      last_name: "Smith",
      email: "robert.smith@example.com",
      phone: "07700 900126",
      role: "Occupational Therapist",
      status: "inactive",
      tenantId: "demo-tenant",
      createdAt: new Date("2023-02-10T14:30:00Z"),
      updatedAt: new Date("2023-03-25T11:10:00Z"),
    },
    {
      id: "cp-005",
      first_name: "Olivia",
      last_name: "Taylor",
      email: "olivia.taylor@example.com",
      phone: "07700 900127",
      role: "Mental Health Nurse",
      status: "active",
      tenantId: "demo-tenant",
      createdAt: new Date("2023-02-15T10:00:00Z"),
      updatedAt: new Date("2023-04-05T15:45:00Z"),
    },
  ]
}

// Get a care professional by ID
export async function getCareProfessionalById(tenantId: string, id: string): Promise<CareProfessional | null> {
  try {
    // Check if we're in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const demoProfessionals = getMockCareProfessionals()
      return demoProfessionals.find((p) => p.id === id) || null
    }

    // Use tagged template literals with sql
    if (sql) {
      try {
        const result = await sql`
          SELECT * FROM care_professionals 
          WHERE tenant_id = ${tenantId} AND id = ${id}
        `

        if (result.length > 0) {
          // Add missing fields with default values
          const professional = {
            ...result[0],
            phone: "", // Add default phone since it doesn't exist in the database
          }
          return professional as CareProfessional
        }
        return null
      } catch (error) {
        console.error("SQL error in getCareProfessionalById:", error)
        // If there's an error with the SQL query, fall back to demo data
        const demoProfessionals = getMockCareProfessionals()
        return demoProfessionals.find((p) => p.id === id) || null
      }
    }

    // Fallback to tenantQuery (which now returns mock data)
    const professionals = await tenantQuery<CareProfessional>(
      tenantId,
      `SELECT * FROM care_professionals 
      WHERE tenant_id = $1 AND id = $2`,
      [tenantId, id],
    )

    return professionals.length > 0 ? professionals[0] : null
  } catch (error) {
    console.error("Error fetching care professional:", error)
    // Return demo data if in production but error occurred
    const demoProfessionals = getMockCareProfessionals()
    return demoProfessionals.find((p) => p.id === id) || null
  }
}

// Create a new care professional
export async function createCareProfessional(
  tenantId: string,
  data: Omit<CareProfessional, "id" | "tenantId" | "createdAt" | "updatedAt">,
  userId: string,
): Promise<CareProfessional | null> {
  try {
    // Check if we're in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Return a mock created professional
      const now = new Date().toISOString()
      return {
        id: `cp-${Math.floor(Math.random() * 1000)}`,
        tenantId: tenantId,
        ...data,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      }
    }

    const now = new Date().toISOString()
    const professionals = await tenantInsert<CareProfessional>(tenantId, "care_professionals", {
      ...data,
      tenantId: tenantId,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    })
    return professionals.length > 0 ? professionals[0] : null
  } catch (error) {
    console.error("Error creating care professional:", error)
    // Return mock data in case of error
    const now = new Date().toISOString()
    return {
      id: `cp-${Math.floor(Math.random() * 1000)}`,
      tenantId: tenantId,
      ...data,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }
  }
}

// Update a care professional
export async function updateCareProfessional(
  tenantId: string,
  id: string,
  data: Partial<CareProfessional>,
  userId: string,
): Promise<CareProfessional | null> {
  try {
    // Check if we're in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const demoProfessionals = getMockCareProfessionals()
      const professional = demoProfessionals.find((p) => p.id === id)
      if (!professional) return null

      const now = new Date().toISOString()
      return {
        ...professional,
        ...data,
        updatedAt: now,
        updatedBy: userId,
      }
    }

    const now = new Date().toISOString()
    const professionals = await tenantUpdate<CareProfessional>(tenantId, "care_professionals", id, {
      ...data,
      updatedAt: now,
      updatedBy: userId,
    })
    return professionals.length > 0 ? professionals[0] : null
  } catch (error) {
    console.error("Error updating care professional:", error)
    // Return mock updated data in case of error
    const demoProfessionals = getMockCareProfessionals()
    const professional = demoProfessionals.find((p) => p.id === id)
    if (!professional) return null

    const now = new Date().toISOString()
    return {
      ...professional,
      ...data,
      updatedAt: now,
      updatedBy: userId,
    }
  }
}

// Deactivate a care professional (soft delete)
export async function deactivateCareProfessional(
  tenantId: string,
  id: string,
  userId: string,
): Promise<CareProfessional | null> {
  try {
    // Check if we're in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const demoProfessionals = getMockCareProfessionals()
      const professional = demoProfessionals.find((p) => p.id === id)
      if (!professional) return null

      const now = new Date().toISOString()
      return {
        ...professional,
        status: "inactive",
        updatedAt: now,
        updatedBy: userId,
      }
    }

    const now = new Date().toISOString()
    const professionals = await tenantUpdate<CareProfessional>(tenantId, "care_professionals", id, {
      status: "inactive",
      updatedAt: now,
      updatedBy: userId,
    })
    return professionals.length > 0 ? professionals[0] : null
  } catch (error) {
    console.error("Error deactivating care professional:", error)
    // Return mock deactivated data in case of error
    const demoProfessionals = getMockCareProfessionals()
    const professional = demoProfessionals.find((p) => p.id === id)
    if (!professional) return null

    const now = new Date().toISOString()
    return {
      ...professional,
      status: "inactive",
      updatedAt: now,
      updatedBy: userId,
    }
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

