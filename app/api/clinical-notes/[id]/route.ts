import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

const db = neon(process.env.DATABASE_URL!)

// GET a specific clinical note by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId

    const [note] = await db`
      SELECT cn.*, 
             cp.first_name as care_professional_first_name, 
             cp.last_name as care_professional_last_name,
             array_agg(cnc.id) as category_ids,
             array_agg(cnc.name) as category_names
      FROM clinical_notes cn
      LEFT JOIN care_professionals cp ON cn.care_professional_id = cp.id
      LEFT JOIN clinical_notes_category_mappings cncm ON cn.id = cncm.note_id
      LEFT JOIN clinical_notes_categories cnc ON cncm.category_id = cnc.id
      WHERE cn.id = ${id}
      AND cn.tenant_id = ${tenantId}
      GROUP BY cn.id, cp.first_name, cp.last_name
    `

    if (!note) {
      return NextResponse.json({ error: "Clinical note not found" }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error fetching clinical note:", error)
    return NextResponse.json({ error: "Failed to fetch clinical note" }, { status: 500 })
  }
}

// PUT to update a clinical note
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId
    const userId = session.user.id
    const body = await request.json()

    const { noteType, title, content, isPrivate, moodScore, painScore, vitalSigns, tags, attachments, categories } =
      body

    // Check if note exists and belongs to the tenant
    const [existingNote] = await db`
      SELECT * FROM clinical_notes 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (!existingNote) {
      return NextResponse.json({ error: "Clinical note not found" }, { status: 404 })
    }

    // Update the clinical note
    const [updatedNote] = await db`
      UPDATE clinical_notes
      SET 
        note_type = ${noteType || existingNote.note_type},
        title = ${title || existingNote.title},
        content = ${content || existingNote.content},
        is_private = ${isPrivate !== undefined ? isPrivate : existingNote.is_private},
        mood_score = ${moodScore !== undefined ? moodScore : existingNote.mood_score},
        pain_score = ${painScore !== undefined ? painScore : existingNote.pain_score},
        vital_signs = ${vitalSigns ? JSON.stringify(vitalSigns) : existingNote.vital_signs},
        tags = ${tags || existingNote.tags},
        attachments = ${attachments ? JSON.stringify(attachments) : existingNote.attachments},
        updated_at = CURRENT_TIMESTAMP,
        updated_by = ${userId}
      WHERE id = ${id}
      RETURNING *
    `

    // If categories are provided, update the mappings
    if (categories && categories.length > 0) {
      // Delete existing mappings
      await db`
        DELETE FROM clinical_notes_category_mappings
        WHERE note_id = ${id}
      `

      // Add new mappings
      for (const categoryId of categories) {
        await db`
          INSERT INTO clinical_notes_category_mappings (note_id, category_id)
          VALUES (${id}, ${categoryId})
        `
      }
    }

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error("Error updating clinical note:", error)
    return NextResponse.json({ error: "Failed to update clinical note" }, { status: 500 })
  }
}

// DELETE a clinical note
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const tenantId = session.user.tenantId

    // Check if note exists and belongs to the tenant
    const [existingNote] = await db`
      SELECT * FROM clinical_notes 
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    if (!existingNote) {
      return NextResponse.json({ error: "Clinical note not found" }, { status: 404 })
    }

    // Delete the clinical note (category mappings will be deleted via CASCADE)
    await db`
      DELETE FROM clinical_notes
      WHERE id = ${id}
    `

    return NextResponse.json({ message: "Clinical note deleted successfully" })
  } catch (error) {
    console.error("Error deleting clinical note:", error)
    return NextResponse.json({ error: "Failed to delete clinical note" }, { status: 500 })
  }
}
