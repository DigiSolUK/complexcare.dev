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
      SELECT * FROM clinical_note_categories
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error in GET /api/clinical-notes/categories/${params.id}:`, error)
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
      UPDATE clinical_note_categories
      SET 
        name = ${data.name || null},
        description = ${data.description || null},
        color = ${data.color || null},
        icon = ${data.icon || null},
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error in PUT /api/clinical-notes/categories/${params.id}:`, error)
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

    // Check if category is in use
    const notesUsingCategory = await sql`
      SELECT COUNT(*) as count FROM clinical_notes
      WHERE category_id = ${id} AND tenant_id = ${tenantId}
    `

    if (Number.parseInt(notesUsingCategory[0].count) > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category that is in use by clinical notes",
        },
        { status: 400 },
      )
    }

    await sql`
      DELETE FROM clinical_note_categories
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    return NextResponse.json({ success: true, message: "Category deleted successfully" })
  } catch (error) {
    console.error(`Error in DELETE /api/clinical-notes/categories/${params.id}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
