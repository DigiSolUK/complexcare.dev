import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { createClinicalNote } from "@/lib/services/clinical-notes-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT 
        cn.*,
        cnc.name as category_name,
        cnc.color as category_color,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name
      FROM clinical_notes cn
      LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN users u ON cn.created_by = u.id
      WHERE cn.patient_id = ${patientId}
      AND cn.tenant_id = ${tenantId}
      ORDER BY cn.created_at DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching clinical notes:", error)
    return NextResponse.json({ error: "Failed to fetch clinical notes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const tenantId = data.tenantId || DEFAULT_TENANT_ID

    if (!data.patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const newNote = await createClinicalNote(
      {
        tenant_id: tenantId,
        patient_id: data.patientId,
        title: data.title,
        content: data.content,
        category_id: data.categoryId,
        created_by: data.createdBy,
        is_private: data.isPrivate || false,
        is_important: data.isImportant || false,
        tags: data.tags || [],
        follow_up_date: data.followUpDate || null,
        follow_up_notes: data.followUpNotes || null,
      },
      tenantId,
    )

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note:", error)
    return NextResponse.json({ error: "Failed to create clinical note" }, { status: 500 })
  }
}
