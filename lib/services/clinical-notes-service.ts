import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { logActivity } from "./activity-log-service"
import { sql } from "@/lib/db-connection"

export interface ClinicalNote {
  id: string
  tenant_id: string
  patient_id: string
  title: string
  content: string
  category_id: string
  category_name?: string
  category_color?: string
  created_by: string
  created_by_name?: string
  created_at: string
  updated_at: string
  is_private: boolean
  is_important: boolean
  tags: string[]
  follow_up_date: string | null
  follow_up_notes: string | null
}

export interface ClinicalNoteCategory {
  id: string
  tenant_id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  created_at: string
  updated_at: string
}

export interface ClinicalNoteTemplate {
  id: string
  tenant_id: string
  name: string
  content: string
  category_id: string | null
  category_name?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ClinicalNoteAttachment {
  id: string
  note_id: string
  file_name: string
  file_path: string
  file_type: string | null
  file_size: number | null
  uploaded_by: string
  uploaded_at: string
  content_type: string | null
}

// Server-side function to get clinical notes by patient ID
export async function getClinicalNotesByPatientId(
  patientId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 50,
): Promise<ClinicalNote[]> {
  try {
    // Log activity for viewing clinical notes
    await logActivity({
      tenantId,
      activityType: "clinical_notes_viewed",
      description: `Patient clinical notes viewed`,
      patientId,
    })

    const result = await sql.query(
      `
      SELECT 
        cn.*,
        cnc.name as category_name,
        cnc.color as category_color,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name
      FROM clinical_notes cn
      LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN users u ON cn.created_by = u.id
      WHERE cn.patient_id = $1
      AND cn.tenant_id = $2
      ORDER BY cn.created_at DESC
      LIMIT $3
    `,
      [patientId, tenantId, limit],
    )

    return result.rows || []
  } catch (error) {
    console.error("Error fetching clinical notes:", error)
    return []
  }
}

// Server-side function to get clinical note by ID
export async function getClinicalNoteById(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  try {
    const result = await sql.query(
      `
      SELECT 
        cn.*,
        cnc.name as category_name,
        cnc.color as category_color,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name
      FROM clinical_notes cn
      LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN users u ON cn.created_by = u.id
      WHERE cn.id = $1
      AND cn.tenant_id = $2
    `,
      [id, tenantId],
    )

    if (result.rows && result.rows.length > 0) {
      const note = result.rows[0] as ClinicalNote

      // Log activity for viewing a specific clinical note
      await logActivity({
        tenantId,
        activityType: "clinical_note_viewed",
        description: `Clinical note viewed: ${note.title}`,
        patientId: note.patient_id,
        metadata: {
          noteId: id,
          noteTitle: note.title,
          category: note.category_name,
        },
      })

      return note
    }

    return null
  } catch (error) {
    console.error(`Error fetching clinical note with ID ${id}:`, error)
    return null
  }
}

// Server-side function to create a clinical note
export async function createClinicalNote(
  data: Omit<ClinicalNote, "id" | "created_at" | "updated_at" | "category_name" | "category_color" | "created_by_name">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  try {
    const result = await sql.query(
      `
      INSERT INTO clinical_notes (
        tenant_id,
        patient_id,
        title,
        content,
        category_id,
        created_by,
        is_private,
        is_important,
        tags,
        follow_up_date,
        follow_up_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING *
    `,
      [
        tenantId,
        data.patient_id,
        data.title,
        data.content,
        data.category_id,
        data.created_by,
        data.is_private,
        data.is_important,
        data.tags || [],
        data.follow_up_date || null,
        data.follow_up_notes || null,
      ],
    )

    if (result.rows && result.rows.length > 0) {
      const newNote = result.rows[0] as ClinicalNote

      // Get category name if available
      let categoryName = "Unknown"
      try {
        const categoryResult = await sql.query(
          `
          SELECT name FROM clinical_note_categories 
          WHERE id = $1
        `,
          [data.category_id],
        )

        if (categoryResult.rows && categoryResult.rows.length > 0) {
          categoryName = categoryResult.rows[0].name
        }
      } catch (error) {
        console.error("Error fetching category name:", error)
      }

      // Log activity for creating a clinical note
      await logActivity({
        tenantId,
        activityType: "clinical_note_created",
        description: `Clinical note created: ${data.title}`,
        patientId: data.patient_id,
        userId: data.created_by,
        metadata: {
          noteId: newNote.id,
          noteTitle: data.title,
          category: categoryName,
          isImportant: data.is_important,
          hasFollowUp: !!data.follow_up_date,
        },
      })

      // If it's marked as important, log an additional activity
      if (data.is_important) {
        await logActivity({
          tenantId,
          activityType: "important_clinical_note_created",
          description: `Important clinical note created: ${data.title}`,
          patientId: data.patient_id,
          userId: data.created_by,
          metadata: {
            noteId: newNote.id,
            noteTitle: data.title,
            category: categoryName,
          },
        })
      }

      return newNote
    }

    return null
  } catch (error) {
    console.error("Error creating clinical note:", error)
    throw error
  }
}

// Server-side function to get clinical note categories
export async function getClinicalNoteCategories(tenantId: string = DEFAULT_TENANT_ID): Promise<ClinicalNoteCategory[]> {
  try {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      console.warn("getClinicalNoteCategories called from client component")
      return []
    }

    const result = await sql.query(
      `
      SELECT * FROM clinical_note_categories
      WHERE tenant_id = $1
      ORDER BY name ASC
    `,
      [tenantId],
    )

    return result.rows || []
  } catch (error) {
    console.error("Error fetching clinical note categories:", error)
    return []
  }
}

// Server-side function to get clinical note templates
export async function getClinicalNoteTemplates(tenantId: string = DEFAULT_TENANT_ID): Promise<ClinicalNoteTemplate[]> {
  try {
    const result = await sql.query(
      `
      SELECT 
        cnt.*,
        cnc.name as category_name
      FROM clinical_note_templates cnt
      LEFT JOIN clinical_note_categories cnc ON cnt.category_id = cnc.id
      WHERE cnt.tenant_id = $1
      ORDER BY cnt.name ASC
    `,
      [tenantId],
    )

    return result.rows || []
  } catch (error) {
    console.error("Error fetching clinical note templates:", error)
    return []
  }
}
