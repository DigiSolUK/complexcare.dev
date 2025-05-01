import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

const db = neon(process.env.DATABASE_URL!)

// GET a specific clinical note template
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId

    const [template] = await db`
      SELECT * FROM clinical_notes_templates
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error fetching clinical note template:", error)
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 })
  }
}

// PUT to update a clinical note template
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId
    const body = await request.json()
    const { name, content, noteType } = body

    // Check if template exists and belongs to the tenant
    const [existingTemplate] = await db`
      SELECT * FROM clinical_notes_templates 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Update the template
    const [updatedTemplate] = await db`
      UPDATE clinical_notes_templates
      SET 
        name = ${name || existingTemplate.name},
        content = ${content || existingTemplate.content},
        note_type = ${noteType || existingTemplate.note_type},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error("Error updating clinical note template:", error)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}

// DELETE a clinical note template
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId

    // Check if template exists and belongs to the tenant
    const [existingTemplate] = await db`
      SELECT * FROM clinical_notes_templates 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Delete the template
    await db`
      DELETE FROM clinical_notes_templates
      WHERE id = ${id}
    `

    return NextResponse.json({ message: "Template deleted successfully" })
  } catch (error) {
    console.error("Error deleting clinical note template:", error)
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
  }
}
