import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string; assignmentId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const { assignmentId } = params

    const sql = neon(process.env.DATABASE_URL!)

    // Soft delete by setting end date
    const [assignment] = await sql`
      UPDATE patient_assignments
      SET 
        end_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP,
        updated_by = ${session.user.id}
      WHERE id = ${assignmentId}
        AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json({ data: assignment })
  } catch (error) {
    console.error("Error removing patient assignment:", error)
    return NextResponse.json({ error: "Failed to remove patient assignment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string; assignmentId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const { assignmentId } = params
    const body = await request.json()

    const sql = neon(process.env.DATABASE_URL!)

    const [assignment] = await sql`
      UPDATE patient_assignments
      SET 
        assignment_type = COALESCE(${body.assignment_type}, assignment_type),
        start_date = COALESCE(${body.start_date}, start_date),
        end_date = ${body.end_date},
        notes = ${body.notes},
        updated_at = CURRENT_TIMESTAMP,
        updated_by = ${session.user.id}
      WHERE id = ${assignmentId}
        AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json({ data: assignment })
  } catch (error) {
    console.error("Error updating patient assignment:", error)
    return NextResponse.json({ error: "Failed to update patient assignment" }, { status: 500 })
  }
}
