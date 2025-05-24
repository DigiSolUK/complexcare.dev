import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-utils"

// GET: Retrieve patient assignments for a care professional
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const careProfessionalId = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || user.tenantId

    // Get all patient assignments for this care professional
    const sql = neon(process.env.DATABASE_URL || "")
    const assignments = await sql`
      SELECT pa.*, 
             p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             p.date_of_birth, p.gender, p.contact_number, p.email
      FROM patient_assignments pa
      JOIN patients p ON pa.patient_id = p.id
      WHERE pa.care_professional_id = ${careProfessionalId}
      AND pa.tenant_id = ${tenantId}
      AND (pa.end_date IS NULL OR pa.end_date >= CURRENT_DATE)
      ORDER BY p.last_name, p.first_name
    `

    return NextResponse.json({ data: assignments })
  } catch (error) {
    console.error("Error fetching patient assignments:", error)
    return NextResponse.json({ error: "Failed to fetch patient assignments" }, { status: 500 })
  }
}

// POST: Create a new patient assignment
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const careProfessionalId = params.id
    const body = await request.json()
    const { patientId, assignmentType, startDate, endDate, notes, tenantId = user.tenantId } = body

    // Validate required fields
    if (!patientId || !assignmentType || !startDate) {
      return NextResponse.json({ error: "Patient ID, assignment type, and start date are required" }, { status: 400 })
    }

    // Check for existing assignment with the same patient, professional, and type
    const sql = neon(process.env.DATABASE_URL || "")
    const existingAssignments = await sql`
      SELECT * FROM patient_assignments
      WHERE tenant_id = ${tenantId}
      AND patient_id = ${patientId}
      AND care_professional_id = ${careProfessionalId}
      AND assignment_type = ${assignmentType}
      AND (end_date IS NULL OR end_date >= ${startDate})
    `

    if (existingAssignments.length > 0) {
      return NextResponse.json(
        { error: "An active assignment already exists for this patient and care professional with the same type" },
        { status: 409 },
      )
    }

    // Create the new assignment
    const newAssignment = await sql`
      INSERT INTO patient_assignments (
        tenant_id, patient_id, care_professional_id, assignment_type, 
        start_date, end_date, notes, created_by
      )
      VALUES (
        ${tenantId}, ${patientId}, ${careProfessionalId}, ${assignmentType},
        ${startDate}, ${endDate || null}, ${notes || null}, ${user.id}
      )
      RETURNING *
    `

    // Get patient details to include in the response
    const [patient] = await sql`
      SELECT first_name, last_name, date_of_birth, gender, contact_number, email
      FROM patients
      WHERE id = ${patientId} AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      data: {
        ...newAssignment[0],
        patient_first_name: patient?.first_name,
        patient_last_name: patient?.last_name,
        date_of_birth: patient?.date_of_birth,
        gender: patient?.gender,
        contact_number: patient?.contact_number,
        email: patient?.email,
      },
    })
  } catch (error) {
    console.error("Error creating patient assignment:", error)
    return NextResponse.json({ error: "Failed to create patient assignment" }, { status: 500 })
  }
}
