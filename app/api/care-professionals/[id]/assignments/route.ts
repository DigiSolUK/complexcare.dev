import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const careProfessionalId = params.id

    const sql = neon(process.env.DATABASE_URL!)

    // Get all patient assignments for this care professional
    const assignments = await sql`
      SELECT 
        pa.*,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.date_of_birth as patient_date_of_birth,
        p.contact_number as patient_contact_number,
        p.avatar_url as patient_avatar_url
      FROM patient_assignments pa
      JOIN patients p ON pa.patient_id = p.id
      WHERE pa.care_professional_id = ${careProfessionalId}
        AND pa.tenant_id = ${tenantId}
        AND (pa.end_date IS NULL OR pa.end_date >= CURRENT_DATE)
      ORDER BY pa.start_date DESC
    `

    return NextResponse.json({ data: assignments })
  } catch (error) {
    console.error("Error fetching patient assignments:", error)
    return NextResponse.json({ error: "Failed to fetch patient assignments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const careProfessionalId = params.id
    const body = await request.json()

    const { patient_id, assignment_type = "primary", start_date, end_date, notes } = body

    if (!patient_id || !start_date) {
      return NextResponse.json({ error: "Patient ID and start date are required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if assignment already exists
    const existing = await sql`
      SELECT id FROM patient_assignments
      WHERE tenant_id = ${tenantId}
        AND patient_id = ${patient_id}
        AND care_professional_id = ${careProfessionalId}
        AND assignment_type = ${assignment_type}
        AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "This patient is already assigned to this care professional" }, { status: 400 })
    }

    // Create the assignment
    const [assignment] = await sql`
      INSERT INTO patient_assignments (
        tenant_id,
        patient_id,
        care_professional_id,
        assignment_type,
        start_date,
        end_date,
        notes,
        created_by
      ) VALUES (
        ${tenantId},
        ${patient_id},
        ${careProfessionalId},
        ${assignment_type},
        ${start_date},
        ${end_date || null},
        ${notes || null},
        ${session.user.id}
      )
      RETURNING *
    `

    return NextResponse.json({ data: assignment })
  } catch (error) {
    console.error("Error creating patient assignment:", error)
    return NextResponse.json({ error: "Failed to create patient assignment" }, { status: 500 })
  }
}
