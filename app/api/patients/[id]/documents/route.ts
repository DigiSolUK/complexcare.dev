import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get documents from the database
    const result = await sql`
      SELECT 
        d.*,
        CONCAT(u.first_name, ' ', u.last_name) as uploaded_by_name
      FROM patient_documents d
      LEFT JOIN users u ON d.uploaded_by = u.id
      WHERE d.patient_id = ${patientId}
      AND d.tenant_id = ${DEFAULT_TENANT_ID}
      ORDER BY d.created_at DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching patient documents:", error)
    return NextResponse.json({ error: "Failed to fetch patient documents" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.file_name || !data.file_type || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: title, file_name, file_type, category" },
        { status: 400 },
      )
    }

    // Insert into database
    const result = await sql`
      INSERT INTO patient_documents (
        tenant_id,
        patient_id,
        title,
        file_name,
        file_type,
        file_size,
        category,
        description,
        uploaded_by,
        created_at,
        updated_at
      ) VALUES (
        ${DEFAULT_TENANT_ID},
        ${patientId},
        ${data.title},
        ${data.file_name},
        ${data.file_type},
        ${data.file_size},
        ${data.category},
        ${data.description || null},
        ${data.uploaded_by},
        NOW(),
        NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating patient document:", error)
    return NextResponse.json({ error: "Failed to create patient document" }, { status: 500 })
  }
}
