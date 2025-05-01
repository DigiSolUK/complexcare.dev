import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Demo data for care professionals (same as in the main route)
const demoCareProfessionals = [
  {
    id: "cp-001",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "07700 900123",
    role: "Registered Nurse",
    specialization: "Palliative Care",
    qualification: "RN, BSc Nursing",
    license_number: "RN123456",
    employment_status: "Full-time",
    start_date: "2021-03-15",
    is_active: true,
    created_at: "2021-03-10T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z",
    address: "123 Care Street, London",
    notes: "Specialized in complex care management",
    emergency_contact_name: "Michael Johnson",
    emergency_contact_phone: "07700 900456",
    avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "cp-002",
    first_name: "James",
    last_name: "Williams",
    email: "james.williams@example.com",
    phone: "07700 900234",
    role: "Physiotherapist",
    specialization: "Neurological Rehabilitation",
    qualification: "BSc Physiotherapy, MSc Neuro Rehab",
    license_number: "PT789012",
    employment_status: "Part-time",
    start_date: "2022-01-10",
    is_active: true,
    created_at: "2021-12-20T00:00:00Z",
    updated_at: "2023-02-05T00:00:00Z",
    address: "456 Therapy Lane, Manchester",
    notes: "Specializes in stroke rehabilitation",
    emergency_contact_name: "Emma Williams",
    emergency_contact_phone: "07700 900567",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "cp-003",
    first_name: "Emily",
    last_name: "Brown",
    email: "emily.brown@example.com",
    phone: "07700 900345",
    role: "Occupational Therapist",
    specialization: "Home Adaptations",
    qualification: "BSc Occupational Therapy",
    license_number: "OT345678",
    employment_status: "Full-time",
    start_date: "2020-06-22",
    is_active: true,
    created_at: "2020-06-15T00:00:00Z",
    updated_at: "2023-03-10T00:00:00Z",
    address: "789 Wellbeing Road, Birmingham",
    notes: "Expert in home environment assessments",
    emergency_contact_name: "David Brown",
    emergency_contact_phone: "07700 900678",
    avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "cp-004",
    first_name: "Robert",
    last_name: "Smith",
    email: "robert.smith@example.com",
    phone: "07700 900456",
    role: "Healthcare Assistant",
    specialization: "Personal Care",
    qualification: "NVQ Level 3 Health and Social Care",
    license_number: "HCA567890",
    employment_status: "Full-time",
    start_date: "2022-04-05",
    is_active: true,
    created_at: "2022-03-28T00:00:00Z",
    updated_at: "2023-01-20T00:00:00Z",
    address: "101 Support Avenue, Leeds",
    notes: "Experienced in complex care support",
    emergency_contact_name: "Jennifer Smith",
    emergency_contact_phone: "07700 900789",
    avatar_url: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "cp-005",
    first_name: "Olivia",
    last_name: "Taylor",
    email: "olivia.taylor@example.com",
    phone: "07700 900567",
    role: "Speech and Language Therapist",
    specialization: "Dysphagia Management",
    qualification: "BSc Speech and Language Therapy",
    license_number: "SLT901234",
    employment_status: "Part-time",
    start_date: "2021-09-15",
    is_active: true,
    created_at: "2021-09-01T00:00:00Z",
    updated_at: "2023-02-28T00:00:00Z",
    address: "202 Communication Street, Glasgow",
    notes: "Specializes in swallowing assessments",
    emergency_contact_name: "William Taylor",
    emergency_contact_phone: "07700 900890",
    avatar_url: "https://randomuser.me/api/portraits/women/22.jpg",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get tenant ID from request headers
    const tenantId =
      request.headers.get("x-tenant-id") ||
      request.nextUrl.searchParams.get("tenantId") ||
      process.env.DEFAULT_TENANT_ID

    // In demo mode, return demo data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Find the care professional with the matching ID
      const careProfessional = demoCareProfessionals.find((cp) => cp.id === id)

      if (!careProfessional) {
        return NextResponse.json({ error: `Care professional with ID ${id} not found` }, { status: 404 })
      }

      return NextResponse.json(careProfessional)
    }

    // Initialize the database connection
    const sql = neon(process.env.DATABASE_URL || "")

    // Use the correct SQL syntax with tagged template literals
    const result = await sql`
      SELECT * FROM care_professionals 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching care professional:", error)
    return NextResponse.json({ error: "Failed to fetch care professional details" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get tenant ID from request headers
    const tenantId =
      request.headers.get("x-tenant-id") ||
      request.nextUrl.searchParams.get("tenantId") ||
      process.env.DEFAULT_TENANT_ID

    // Parse the request body
    const body = await request.json()

    // In demo mode, just return a success response
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({
        id,
        ...body,
        tenant_id: tenantId,
        updated_at: new Date().toISOString(),
      })
    }

    // Initialize the database connection
    const sql = neon(process.env.DATABASE_URL || "")

    // Check if the care professional exists
    const existingRecord = await sql`
      SELECT id FROM care_professionals
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    // Use the correct SQL syntax with tagged template literals
    const result = await sql`
      UPDATE care_professionals
      SET 
        first_name = ${body.first_name || existingRecord[0].first_name},
        last_name = ${body.last_name || existingRecord[0].last_name},
        email = ${body.email || existingRecord[0].email},
        phone = ${body.phone || existingRecord[0].phone},
        role = ${body.role || existingRecord[0].role},
        specialization = ${body.specialization || existingRecord[0].specialization},
        qualification = ${body.qualification || existingRecord[0].qualification},
        license_number = ${body.license_number || existingRecord[0].license_number},
        employment_status = ${body.employment_status || existingRecord[0].employment_status},
        start_date = ${body.start_date || existingRecord[0].start_date},
        is_active = ${body.is_active !== undefined ? body.is_active : existingRecord[0].is_active},
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating care professional:", error)
    return NextResponse.json({ error: "Failed to update care professional" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get tenant ID from request headers
    const tenantId =
      request.headers.get("x-tenant-id") ||
      request.nextUrl.searchParams.get("tenantId") ||
      process.env.DEFAULT_TENANT_ID

    // In demo mode, just return a success response
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({
        id,
        is_active: false,
        updated_at: new Date().toISOString(),
      })
    }

    // Initialize the database connection
    const sql = neon(process.env.DATABASE_URL || "")

    // Check if the care professional exists
    const existingRecord = await sql`
      SELECT id FROM care_professionals
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    // Instead of deleting, set is_active to false (soft delete)
    const result = await sql`
      UPDATE care_professionals
      SET is_active = false, updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING id, is_active, updated_at
    `

    return NextResponse.json({
      message: "Care professional deactivated successfully",
      data: result[0],
    })
  } catch (error) {
    console.error("Error deactivating care professional:", error)
    return NextResponse.json({ error: "Failed to deactivate care professional" }, { status: 500 })
  }
}
