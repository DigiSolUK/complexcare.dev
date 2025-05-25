import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get the latest risk assessment from the database
    const result = await sql`
      SELECT 
        r.*,
        CONCAT(u.first_name, ' ', u.last_name) as assessed_by_name
      FROM patient_risk_assessments r
      LEFT JOIN users u ON r.assessed_by = u.id
      WHERE r.patient_id = ${patientId}
      AND r.tenant_id = ${DEFAULT_TENANT_ID}
      ORDER BY r.assessment_date DESC
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json(null)
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching patient risk assessment:", error)
    return NextResponse.json({ error: "Failed to fetch patient risk assessment" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const data = await request.json()

    // Validate required fields
    if (!data.risk_level || !data.risk_score || !data.assessment_date || !data.assessed_by) {
      return NextResponse.json(
        { error: "Missing required fields: risk_level, risk_score, assessment_date, assessed_by" },
        { status: 400 },
      )
    }

    // Insert into database
    const result = await sql`
      INSERT INTO patient_risk_assessments (
        tenant_id,
        patient_id,
        risk_level,
        risk_score,
        assessment_date,
        assessed_by,
        factors,
        notes,
        created_at,
        updated_at
      ) VALUES (
        ${DEFAULT_TENANT_ID},
        ${patientId},
        ${data.risk_level},
        ${data.risk_score},
        ${data.assessment_date},
        ${data.assessed_by},
        ${data.factors || []},
        ${data.notes || null},
        NOW(),
        NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating patient risk assessment:", error)
    return NextResponse.json({ error: "Failed to create patient risk assessment" }, { status: 500 })
  }
}
