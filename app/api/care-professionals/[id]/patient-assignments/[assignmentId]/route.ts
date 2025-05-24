import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-utils"

// GET: Retrieve a specific patient assignment
export async function GET(request: NextRequest, { params }: { params: { id: string; assignmentId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: careProfessionalId, assignmentId } = params
    const tenantId = request.nextUrl.searchParams.get("tenantId") || user.tenantId

    const sql = neon(process.env.DATABASE_URL || "")
    const [assignment] = await sql`
      SELECT pa.*, 
             p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             p.date_of_birth, p.gender, p.contact_number, p.email
      FROM patient_assignments pa
      JOIN patients p ON pa.patient_id = p.id
      WHERE pa.id = ${assignmentId}
      AND pa.care_professional_id = ${careProfessionalId}
      AND pa.tenant_id = ${tenantId}
    `

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json({ data: assignment })
  } catch (error) {
    console.error("Error fetching patient assignment:", error)
    return NextResponse.json({ error: "Failed to fetch patient assignment" }, { status: 500 })
  }
}

// PUT: Update a patient assignment
export async function PUT(request: NextRequest, { params }: { params: { id: string; assignmentId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: careProfessionalId, assignmentId } = params
    const body = await request.json()
    const { assignmentType, startDate, endDate, notes, tenantId = user.tenantId } = body

    // Validate required fields
    if (!assignmentType || !startDate) {
      return NextResponse.json({ error: "Assignment type and start date are required" }, { status: 400 })
    }

    // Update the assignment
    const sql = neon(process.env.DATABASE_URL || "")
    const [updatedAssignment] = await sql`
      UPDATE patient_assignments
      SET 
        assignment_type = ${assignmentType},
        start_date = ${startDate},
        end_date = ${endDate || null},
        notes = ${notes || null},
        updated_at = CURRENT_TIMESTAMP,
        updated_by = ${user.id}
      WHERE id = ${assignmentId}
      AND care_professional_id = ${careProfessionalId}
      AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (!updatedAssignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Get patient details to include in the response
    const [patient] = await sql`
      SELECT first_name, last_name, date_of_birth, gender, contact_number, email
      FROM patients
      WHERE id = ${updatedAssignment.patient_id} AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      data: {
        ...updatedAssignment,
        patient_first_name: patient?.first_name,
        patient_last_name: patient?.last_name,
        date_of_birth: patient?.date_of_birth,
        gender: patient?.gender,
        contact_number: patient?.contact_number,
        email: patient?.email,
      },
    })
  } catch (error) {
    console.error("Error updating patient assignment:", error)
    return NextResponse.json({ error: "Failed to update patient assignment" }, { status: 500 })
  }
}

// DELETE: End a patient assignment
export async function DELETE(request: NextRequest, { params }: { params: { id: string; assignmentId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: careProfessionalId, assignmentId } = params
    const tenantId = request.nextUrl.searchParams.get("tenantId") || user.tenantId
    const endImmediately = request.nextUrl.searchParams.get("endImmediately") === "true"

    const sql = neon(process.env.DATABASE_URL || "")

    if (endImmediately) {
      // End the assignment as of today
      const [updatedAssignment] = await sql`
        UPDATE patient_assignments
        SET 
          end_date = CURRENT_DATE,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = ${user.id}
        WHERE id = ${assignmentId}
        AND care_professional_id = ${careProfessionalId}
        AND tenant_id = ${tenantId}
        AND (end_date IS NULL OR end_date > CURRENT_DATE)
        RETURNING *
      `

      if (!updatedAssignment) {
        return NextResponse.json({ error: "Assignment not found or already ended" }, { status: 404 })
      }

      return NextResponse.json({ data: updatedAssignment, message: "Assignment ended successfully" })
    } else {
      // Completely remove the assignment
      const [deletedAssignment] = await sql`
        DELETE FROM patient_assignments
        WHERE id = ${assignmentId}
        AND care_professional_id = ${careProfessionalId}
        AND tenant_id = ${tenantId}
        RETURNING id
      `

      if (!deletedAssignment) {
        return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
      }

      return NextResponse.json({ data: deletedAssignment, message: "Assignment deleted successfully" })
    }
  } catch (error) {
    console.error("Error deleting patient assignment:", error)
    return NextResponse.json({ error: "Failed to delete patient assignment" }, { status: 500 })
  }
}
