import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID

    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      SELECT 
        cnt.*,
        cnc.name as category_name
      FROM clinical_note_templates cnt
      LEFT JOIN clinical_note_categories cnc ON cnt.category_id = cnc.id
      WHERE cnt.id = ${id} AND cnt.tenant_id = ${tenantId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error in GET /api/clinical-notes/templates/${params.id}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const data = await request.json()
    const tenantId = data.tenant_id || DEFAULT_TENANT_ID

    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      UPDATE clinical_note_templates
      SET 
        name = ${data.name || null},
        content = ${data.content || null},
        category_id = ${data.category_id || null},
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error in PUT /api/clinical-notes/templates/${params.id}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID

    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      DELETE FROM clinical_note_templates
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    return NextResponse.json({ success: true, message: "Template deleted successfully" })
  } catch (error) {
    console.error(`Error in DELETE /api/clinical-notes/templates/${params.id}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
