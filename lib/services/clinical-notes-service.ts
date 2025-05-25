import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { logActivity } from "./activity-log-service"
import { sql } from "@/lib/db" // Import the existing database connection

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
      LIMIT ${limit}
    `

    return result as ClinicalNote[]
  } catch (error) {
    console.error("Error fetching clinical notes:", error)
    return []
  }
}

export async function getClinicalNoteById(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  try {
    const result = await sql`
      SELECT 
        cn.*,
        cnc.name as category_name,
        cnc.color as category_color,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name
      FROM clinical_notes cn
      LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN users u ON cn.created_by = u.id
      WHERE cn.id = ${id}
      AND cn.tenant_id = ${tenantId}
    `

    if (result.length > 0) {
      const note = result[0] as ClinicalNote

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

export async function createClinicalNote(
  data: Omit<ClinicalNote, "id" | "created_at" | "updated_at" | "category_name" | "category_color" | "created_by_name">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  try {
    const result = await sql`
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
        ${tenantId},
        ${data.patient_id},
        ${data.title},
        ${data.content},
        ${data.category_id},
        ${data.created_by},
        ${data.is_private},
        ${data.is_important},
        ${data.tags || []},
        ${data.follow_up_date || null},
        ${data.follow_up_notes || null}
      )
      RETURNING *
    `

    if (result.length > 0) {
      const newNote = result[0] as ClinicalNote

      // Get category name if available
      let categoryName = "Unknown"
      try {
        const categoryResult = await sql`
          SELECT name FROM clinical_note_categories 
          WHERE id = ${data.category_id}
        `
        if (categoryResult.length > 0) {
          categoryName = categoryResult[0].name
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

export async function updateClinicalNote(
  id: string,
  data: Partial<
    Omit<
      ClinicalNote,
      "id" | "created_at" | "updated_at" | "tenant_id" | "category_name" | "category_color" | "created_by_name"
    >
  >,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  try {
    // Get original note data for comparison
    const originalNote = await getClinicalNoteById(id, tenantId)
    if (!originalNote) return null

    // Build the update query dynamically
    const updateFields = []
    const params = [id, tenantId]
    let paramIndex = 3

    if (data.patient_id) {
      updateFields.push(`patient_id = $${paramIndex++}`)
      params.push(data.patient_id)
    }

    if (data.title) {
      updateFields.push(`title = $${paramIndex++}`)
      params.push(data.title)
    }

    if (data.content) {
      updateFields.push(`content = $${paramIndex++}`)
      params.push(data.content)
    }

    if (data.category_id) {
      updateFields.push(`category_id = $${paramIndex++}`)
      params.push(data.category_id)
    }

    if ("is_private" in data) {
      updateFields.push(`is_private = $${paramIndex++}`)
      params.push(data.is_private)
    }

    if ("is_important" in data) {
      updateFields.push(`is_important = $${paramIndex++}`)
      params.push(data.is_important)
    }

    if (data.tags) {
      updateFields.push(`tags = $${paramIndex++}`)
      params.push(data.tags)
    }

    if ("follow_up_date" in data) {
      updateFields.push(`follow_up_date = $${paramIndex++}`)
      params.push(data.follow_up_date || null)
    }

    if ("follow_up_notes" in data) {
      updateFields.push(`follow_up_notes = $${paramIndex++}`)
      params.push(data.follow_up_notes || null)
    }

    updateFields.push(`updated_at = NOW()`)

    if (updateFields.length === 0) {
      return null
    }

    const query = `
      UPDATE clinical_notes
      SET ${updateFields.join(", ")}
      WHERE id = $1
      AND tenant_id = $2
      RETURNING *
    `

    const result = await sql.query(query, params)

    if (result.rows && result.rows.length > 0) {
      const updatedNote = result.rows[0] as ClinicalNote

      // Determine which fields were updated
      const updatedFields = []
      if (data.title && data.title !== originalNote.title) updatedFields.push("title")
      if (data.content && data.content !== originalNote.content) updatedFields.push("content")
      if (data.category_id && data.category_id !== originalNote.category_id) updatedFields.push("category")
      if ("is_private" in data && data.is_private !== originalNote.is_private) updatedFields.push("privacy")
      if ("is_important" in data && data.is_important !== originalNote.is_important) updatedFields.push("importance")
      if (data.follow_up_date && data.follow_up_date !== originalNote.follow_up_date) updatedFields.push("follow_up")

      // Log activity for updating a clinical note
      await logActivity({
        tenantId,
        activityType: "clinical_note_updated",
        description: `Clinical note updated: ${updatedNote.title}`,
        patientId: updatedNote.patient_id,
        userId: originalNote.created_by, // Use the original creator as the updater
        metadata: {
          noteId: id,
          noteTitle: updatedNote.title,
          updatedFields,
        },
      })

      // If importance was changed to true, log an additional activity
      if ("is_important" in data && data.is_important && !originalNote.is_important) {
        await logActivity({
          tenantId,
          activityType: "clinical_note_marked_important",
          description: `Clinical note marked as important: ${updatedNote.title}`,
          patientId: updatedNote.patient_id,
          userId: originalNote.created_by,
          metadata: {
            noteId: id,
            noteTitle: updatedNote.title,
          },
        })
      }

      return updatedNote
    }

    return null
  } catch (error) {
    console.error(`Error updating clinical note with ID ${id}:`, error)
    throw error
  }
}

export async function deleteClinicalNote(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
  userId?: string,
): Promise<boolean> {
  try {
    // Get note details before deletion
    const note = await getClinicalNoteById(id, tenantId)
    if (!note) return false

    await sql`
      DELETE FROM clinical_notes
      WHERE id = ${id}
      AND tenant_id = ${tenantId}
    `

    // Log activity for deleting a clinical note
    await logActivity({
      tenantId,
      activityType: "clinical_note_deleted",
      description: `Clinical note deleted: ${note.title}`,
      patientId: note.patient_id,
      userId: userId || note.created_by,
      metadata: {
        noteId: id,
        noteTitle: note.title,
        category: note.category_name,
      },
    })

    return true
  } catch (error) {
    console.error(`Error deleting clinical note with ID ${id}:`, error)
    return false
  }
}

export async function getClinicalNoteCategories(tenantId: string = DEFAULT_TENANT_ID): Promise<ClinicalNoteCategory[]> {
  try {
    const result = await sql`
      SELECT * FROM clinical_note_categories
      WHERE tenant_id = ${tenantId}
      ORDER BY name ASC
    `

    return result as ClinicalNoteCategory[]
  } catch (error) {
    console.error("Error fetching clinical note categories:", error)
    return []
  }
}

export async function getClinicalNoteTemplates(tenantId: string = DEFAULT_TENANT_ID): Promise<ClinicalNoteTemplate[]> {
  try {
    const result = await sql`
      SELECT 
        cnt.*,
        cnc.name as category_name
      FROM clinical_note_templates cnt
      LEFT JOIN clinical_note_categories cnc ON cnt.category_id = cnc.id
      WHERE cnt.tenant_id = ${tenantId}
      ORDER BY cnt.name ASC
    `

    return result as ClinicalNoteTemplate[]
  } catch (error) {
    console.error("Error fetching clinical note templates:", error)
    return []
  }
}

export async function createClinicalNoteCategory(
  data: Omit<ClinicalNoteCategory, "id" | "created_at" | "updated_at">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNoteCategory | null> {
  try {
    const result = await sql`
      INSERT INTO clinical_note_categories (
        tenant_id,
        name,
        description,
        color,
        icon
      ) VALUES (
        ${tenantId},
        ${data.name},
        ${data.description || null},
        ${data.color || null},
        ${data.icon || null}
      )
      RETURNING *
    `

    if (result.length > 0) {
      return result[0] as ClinicalNoteCategory
    }

    return null
  } catch (error) {
    console.error("Error creating clinical note category:", error)
    throw error
  }
}
