import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get allergies from the database
    const result = await sql`
      SELECT * FROM patient_allergies
      WHERE patient_id = ${patientId}
      AND tenant_id = ${DEFAULT_TENANT_ID}
      ORDER BY created_at DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching patient allergies:", error)
    return NextResponse.json({ error: "Failed to fetch patient allergies" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const data = await request.json()

    // Validate required fields
    if (!data.allergen || !data.allergen_type || !data.reaction || !data.severity || !data.status) {
      return NextResponse.json(
        { error: "Missing required fields: allergen, allergen_type, reaction, severity, status" },
        { status: 400 },
      )
    }

    // Insert into database
    const result = await sql`
      INSERT INTO patient_allergies (
        tenant_id,
        patient_id,
        allergen,
        allergen_type,
        reaction,
        severity,
        onset_date,
        status,
        notes,
        created_at,
        updated_at
      ) VALUES (
        ${DEFAULT_TENANT_ID},
        ${patientId},
        ${data.allergen},
        ${data.allergen_type},
        ${data.reaction},
        ${data.severity},
        ${data.onset_date || null},
        ${data.status},
        ${data.notes || null},
        NOW(),
        NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating patient allergy:", error)
    return NextResponse.json({ error: "Failed to create patient allergy" }, { status: 500 })
  }
}
