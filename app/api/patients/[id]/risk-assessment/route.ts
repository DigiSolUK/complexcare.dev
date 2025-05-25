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

    // Get risk assessments for the patient
    const riskAssessments = await sql`
      SELECT 
        id, 
        assessment_date, 
        risk_level, 
        assessment_type, 
        assessment_score, 
        assessment_details, 
        next_assessment_date, 
        mitigating_actions,
        created_at,
        updated_at
      FROM patient_risk_assessments
      WHERE patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
      ORDER BY assessment_date DESC, created_at DESC
    `

    return NextResponse.json(riskAssessments)
  } catch (error) {
    console.error("Error fetching patient risk assessments:", error)
    return NextResponse.json({ error: "Failed to fetch patient risk assessments" }, { status: 500 })
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
    if (!data.assessment_date || !data.risk_level || !data.assessment_type) {
      return NextResponse.json(
        { error: "Assessment date, risk level, and assessment type are required" },
        { status: 400 },
      )
    }

    // Insert new risk assessment record
    const result = await sql`
      INSERT INTO patient_risk_assessments (
        patient_id, 
        assessment_date, 
        risk_level, 
        assessment_type, 
        assessment_score, 
        assessment_details, 
        next_assessment_date, 
        mitigating_actions,
        tenant_id,
        created_by,
        updated_by
      ) VALUES (
        ${Number.parseInt(patientId)}, 
        ${data.assessment_date}, 
        ${data.risk_level}, 
        ${data.assessment_type}, 
        ${data.assessment_score || null}, 
        ${data.assessment_details || null}, 
        ${data.next_assessment_date || null}, 
        ${data.mitigating_actions || null},
        ${tenantId},
        ${userId},
        ${userId}
      )
      RETURNING id
    `

    return NextResponse.json(
      {
        id: result[0].id,
        message: "Risk assessment record created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating patient risk assessment:", error)
    return NextResponse.json({ error: "Failed to create patient risk assessment" }, { status: 500 })
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
      return NextResponse.json({ error: "Risk assessment record ID is required" }, { status: 400 })
    }

    // Update risk assessment record
    await sql`
      UPDATE patient_risk_assessments
      SET 
        assessment_date = ${data.assessment_date},
        risk_level = ${data.risk_level},
        assessment_type = ${data.assessment_type},
        assessment_score = ${data.assessment_score || null},
        assessment_details = ${data.assessment_details || null},
        next_assessment_date = ${data.next_assessment_date || null},
        mitigating_actions = ${data.mitigating_actions || null},
        updated_at = CURRENT_TIMESTAMP,
        updated_by = ${userId}
      WHERE id = ${data.id}
      AND patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      message: "Risk assessment record updated successfully",
    })
  } catch (error) {
    console.error("Error updating patient risk assessment:", error)
    return NextResponse.json({ error: "Failed to update patient risk assessment" }, { status: 500 })
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
      return NextResponse.json({ error: "Risk assessment record ID is required" }, { status: 400 })
    }

    // Delete risk assessment record
    await sql`
      DELETE FROM patient_risk_assessments
      WHERE id = ${Number.parseInt(recordId)}
      AND patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      message: "Risk assessment record deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting patient risk assessment:", error)
    return NextResponse.json({ error: "Failed to delete patient risk assessment" }, { status: 500 })
  }
}
