import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get medical history from the database
    const result = await sql`
      SELECT * FROM patient_medical_history
      WHERE patient_id = ${patientId}
      AND tenant_id = ${DEFAULT_TENANT_ID}
      ORDER BY record_date DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching patient medical history:", error)
    return NextResponse.json({ error: "Failed to fetch patient medical history" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const data = await request.json()

    // Validate required fields
    if (!data.record_type || !data.record_date || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields: record_type, record_date, description" },
        { status: 400 },
      )
    }

    // Insert into database
    const result = await sql`
      INSERT INTO patient_medical_history (
        tenant_id,
        patient_id,
        record_type,
        record_date,
        description,
        provider,
        is_active,
        is_resolved,
        resolution_date,
        notes,
        created_at,
        updated_at
      ) VALUES (
        ${DEFAULT_TENANT_ID},
        ${patientId},
        ${data.record_type},
        ${data.record_date},
        ${data.description},
        ${data.provider || null},
        ${data.is_active},
        ${data.is_resolved},
        ${data.resolution_date || null},
        ${data.notes || null},
        NOW(),
        NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating patient medical history:", error)
    return NextResponse.json({ error: "Failed to create patient medical history" }, { status: 500 })
  }
}
