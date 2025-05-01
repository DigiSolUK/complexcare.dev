import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

const db = neon(process.env.DATABASE_URL!)

// GET all clinical note templates for a tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId") || session.user.tenantId
    const noteType = searchParams.get("noteType")

    let query = db`
      SELECT * FROM clinical_notes_templates
      WHERE tenant_id = ${tenantId}
    `

    if (noteType) {
      query = db`
        SELECT * FROM clinical_notes_templates
        WHERE tenant_id = ${tenantId} AND note_type = ${noteType}
      `
    }

    const templates = await query
    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching clinical note templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

// POST a new clinical note template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, content, noteType } = body
    const tenantId = body.tenantId || session.user.tenantId
    const userId = session.user.id

    if (!name || !content || !noteType) {
      return NextResponse.json({ error: "Name, content, and note type are required" }, { status: 400 })
    }

    const [template] = await db`
      INSERT INTO clinical_notes_templates (tenant_id, name, content, note_type, created_by)
      VALUES (${tenantId}, ${name}, ${content}, ${noteType}, ${userId})
      RETURNING *
    `

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
