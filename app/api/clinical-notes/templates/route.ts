import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getClinicalNoteTemplates } from "@/lib/services/clinical-notes-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID

    const templates = await getClinicalNoteTemplates(tenantId)

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching clinical note templates:", error)
    return NextResponse.json({ error: "Failed to fetch clinical note templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const tenantId = data.tenantId || DEFAULT_TENANT_ID

    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      INSERT INTO clinical_note_templates (
        tenant_id,
        name,
        content,
        category_id,
        created_by
      ) VALUES (
        ${tenantId},
        ${data.name},
        ${data.content},
        ${data.categoryId || null},
        ${data.createdBy}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note template:", error)
    return NextResponse.json({ error: "Failed to create clinical note template" }, { status: 500 })
  }
}
