import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { tenantQuery } from "@/lib/db-utils"

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

const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const careProfessionalId = params.id

    // Get care professional details
    const careProfessionals = await tenantQuery(
      DEFAULT_TENANT_ID,
      `SELECT id, first_name, last_name, title, email, phone, role, specialization
       FROM care_professionals 
       WHERE id = $1`,
      [careProfessionalId],
    )

    if (careProfessionals.length === 0) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    return NextResponse.json(careProfessionals[0])
  } catch (error) {
    console.error("Error fetching care professional:", error)
    return NextResponse.json({ error: "Failed to fetch care professional" }, { status: 500 })
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

    // Check if the care professional exists
    const existingRecord = await sql.query("SELECT id FROM care_professionals WHERE id = $1 AND tenant_id = $2", [
      id,
      tenantId,
    ])

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    // Use the correct SQL syntax with the new API
    const result = await sql.query(
      `UPDATE care_professionals
      SET 
        first_name = COALESCE($3, first_name),
        last_name = COALESCE($4, last_name),
        email = COALESCE($5, email),
        phone = COALESCE($6, phone),
        role = COALESCE($7, role),
        specialization = COALESCE($8, specialization),
        qualification = COALESCE($9, qualification),
        license_number = COALESCE($10, license_number),
        employment_status = COALESCE($11, employment_status),
        start_date = COALESCE($12, start_date),
        is_active = COALESCE($13, is_active),
        updated_at = NOW()
      WHERE id = $1 AND tenant_id = $2
      RETURNING *`,
      [
        id,
        tenantId,
        body.first_name,
        body.last_name,
        body.email,
        body.phone,
        body.role,
        body.specialization,
        body.qualification,
        body.license_number,
        body.employment_status,
        body.start_date,
        body.is_active,
      ],
    )

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

    // Check if the care professional exists
    const existingRecord = await sql.query("SELECT id FROM care_professionals WHERE id = $1 AND tenant_id = $2", [
      id,
      tenantId,
    ])

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    // Instead of deleting, set is_active to false (soft delete)
    const result = await sql.query(
      "UPDATE care_professionals SET is_active = false, updated_at = NOW() WHERE id = $1 AND tenant_id = $2 RETURNING id, is_active, updated_at",
      [id, tenantId],
    )

    return NextResponse.json({
      message: "Care professional deactivated successfully",
      data: result[0],
    })
  } catch (error) {
    console.error("Error deactivating care professional:", error)
    return NextResponse.json({ error: "Failed to deactivate care professional" }, { status: 500 })
  }
}
