import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

const db = neon(process.env.DATABASE_URL!)

// GET all clinical notes for a patient
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const tenantId = searchParams.get("tenantId") || session.user.tenantId

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const notes = await db`
      SELECT cn.*, 
             cp.first_name as care_professional_first_name, 
             cp.last_name as care_professional_last_name,
             array_agg(cnc.name) as categories
      FROM clinical_notes cn
      LEFT JOIN care_professionals cp ON cn.care_professional_id = cp.id
      LEFT JOIN clinical_notes_category_mappings cncm ON cn.id = cncm.note_id
      LEFT JOIN clinical_notes_categories cnc ON cncm.category_id = cnc.id
      WHERE cn.patient_id = ${patientId}
      AND cn.tenant_id = ${tenantId}
      GROUP BY cn.id, cp.first_name, cp.last_name
      ORDER BY cn.created_at DESC
    `

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching clinical notes:", error)
    return NextResponse.json({ error: "Failed to fetch clinical notes" }, { status: 500 })
  }
}

// POST a new clinical note
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      patientId,
      careProId,
      noteType,
      title,
      content,
      isPrivate,
      moodScore,
      painScore,
      vitalSigns,
      tags,
      attachments,
      categories,
    } = body

    const tenantId = body.tenantId || session.user.tenantId
    const userId = session.user.id

    // Validate required fields
    if (!patientId || !careProId || !noteType || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert the clinical note
    const [note] = await db`
      INSERT INTO clinical_notes (
        tenant_id, 
        patient_id, 
        care_professional_id, 
        note_type, 
        title, 
        content, 
        is_private, 
        mood_score, 
        pain_score, 
        vital_signs, 
        tags, 
        attachments, 
        created_by
      )
      VALUES (
        ${tenantId}, 
        ${patientId}, 
        ${careProId}, 
        ${noteType}, 
        ${title}, 
        ${content}, 
        ${isPrivate || false}, 
        ${moodScore || null}, 
        ${painScore || null}, 
        ${vitalSigns ? JSON.stringify(vitalSigns) : null}, 
        ${tags || null}, 
        ${attachments ? JSON.stringify(attachments) : null}, 
        ${userId}
      )
      RETURNING *
    `

    // If categories are provided, add them to the mapping table
    if (categories && categories.length > 0) {
      for (const categoryId of categories) {
        await db`
          INSERT INTO clinical_notes_category_mappings (note_id, category_id)
          VALUES (${note.id}, ${categoryId})
        `
      }
    }

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note:", error)
    return NextResponse.json({ error: "Failed to create clinical note" }, { status: 500 })
  }
}
