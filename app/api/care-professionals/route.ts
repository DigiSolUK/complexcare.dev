import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Demo data for care professionals
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

export async function GET(request: NextRequest) {
  try {
    // Get tenant ID from request headers
    const tenantId =
      request.headers.get("x-tenant-id") ||
      request.nextUrl.searchParams.get("tenantId") ||
      process.env.DEFAULT_TENANT_ID

    // In demo mode, return demo data
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json(demoCareProfessionals)
    }

    // Use the correct SQL syntax with the new API
    const result = await sql.query(
      "SELECT * FROM care_professionals WHERE tenant_id = $1 ORDER BY last_name, first_name",
      [tenantId],
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    return NextResponse.json({ error: "Failed to fetch care professionals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get tenant ID from request headers
    const tenantId =
      request.headers.get("x-tenant-id") ||
      request.nextUrl.searchParams.get("tenantId") ||
      process.env.DEFAULT_TENANT_ID

    // Parse the request body
    const body = await request.json()

    // In demo mode, just return a success response
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json(
        {
          id: Math.random().toString(36).substring(7),
          ...body,
          tenant_id: tenantId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { status: 201 },
      )
    }

    // Use the correct SQL syntax with the new API
    const result = await sql.query(
      `INSERT INTO care_professionals (
        tenant_id,
        first_name,
        last_name,
        email,
        phone,
        role,
        specialization,
        qualification,
        license_number,
        employment_status,
        start_date,
        is_active,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
      )
      RETURNING *`,
      [
        tenantId,
        body.first_name,
        body.last_name,
        body.email || null,
        body.phone || null,
        body.role,
        body.specialization || null,
        body.qualification || null,
        body.license_number || null,
        body.employment_status || "Full-time",
        body.start_date || new Date().toISOString().split("T")[0],
        body.is_active !== undefined ? body.is_active : true,
      ],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating care professional:", error)
    return NextResponse.json({ error: "Failed to create care professional" }, { status: 500 })
  }
}
