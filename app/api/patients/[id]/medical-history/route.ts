import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getTenantId } from "@/lib/tenant-utils"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id

    // Get medical history records for the patient
    const medicalHistory = await sql`
      SELECT 
        id, 
        condition_name, 
        diagnosis_date, 
        resolution_date, 
        status, 
        notes, 
        severity, 
        diagnosed_by, 
        treatment_summary,
        created_at,
        updated_at
      FROM patient_medical_history
      WHERE patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
      ORDER BY diagnosis_date DESC, created_at DESC
    `

    return NextResponse.json(medicalHistory)
  } catch (error) {
    console.error("Error fetching patient medical history:", error)
    return NextResponse.json({ error: "Failed to fetch patient medical history" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id
    const data = await request.json()
    const userId = session.user.id

    // Validate required fields
    if (!data.condition_name || !data.status) {
      return NextResponse.json({ error: "Condition name and status are required" }, { status: 400 })
    }

    // Insert new medical history record
    const result = await sql`
      INSERT INTO patient_medical_history (
        patient_id, 
        condition_name, 
        diagnosis_date, 
        resolution_date, 
        status, 
        notes, 
        severity, 
        diagnosed_by, 
        treatment_summary,
        tenant_id,
        created_by,
        updated_by
      ) VALUES (
        ${Number.parseInt(patientId)}, 
        ${data.condition_name}, 
        ${data.diagnosis_date || null}, 
        ${data.resolution_date || null}, 
        ${data.status}, 
        ${data.notes || null}, 
        ${data.severity || null}, 
        ${data.diagnosed_by || null}, 
        ${data.treatment_summary || null},
        ${tenantId},
        ${userId},
        ${userId}
      )
      RETURNING id
    `

    return NextResponse.json(
      {
        id: result[0].id,
        message: "Medical history record created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating patient medical history:", error)
    return NextResponse.json({ error: "Failed to create patient medical history" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id
    const data = await request.json()
    const userId = session.user.id

    if (!data.id) {
      return NextResponse.json({ error: "Medical history record ID is required" }, { status: 400 })
    }

    // Update medical history record
    await sql`
      UPDATE patient_medical_history
      SET 
        condition_name = ${data.condition_name},
        diagnosis_date = ${data.diagnosis_date || null},
        resolution_date = ${data.resolution_date || null},
        status = ${data.status},
        notes = ${data.notes || null},
        severity = ${data.severity || null},
        diagnosed_by = ${data.diagnosed_by || null},
        treatment_summary = ${data.treatment_summary || null},
        updated_at = CURRENT_TIMESTAMP,
        updated_by = ${userId}
      WHERE id = ${data.id}
      AND patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      message: "Medical history record updated successfully",
    })
  } catch (error) {
    console.error("Error updating patient medical history:", error)
    return NextResponse.json({ error: "Failed to update patient medical history" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id
    const url = new URL(request.url)
    const recordId = url.searchParams.get("recordId")

    if (!recordId) {
      return NextResponse.json({ error: "Medical history record ID is required" }, { status: 400 })
    }

    // Delete medical history record
    await sql`
      DELETE FROM patient_medical_history
      WHERE id = ${Number.parseInt(recordId)}
      AND patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      message: "Medical history record deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting patient medical history:", error)
    return NextResponse.json({ error: "Failed to delete patient medical history" }, { status: 500 })
  }
}
