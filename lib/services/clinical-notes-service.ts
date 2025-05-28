import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { logActivity } from "./activity-log-service"
import { sql } from "@/lib/db-utils"

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

// Server-side function to create a clinical note category
export async function createClinicalNoteCategory(
  data: Omit<ClinicalNoteCategory, "id" | "created_at" | "updated_at">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNoteCategory | null> {
  try {
    const result = await sql.query(
      `
      INSERT INTO clinical_note_categories (
        tenant_id,
        name,
        description,
        color,
        icon
      ) VALUES (
        $1, $2, $3, $4, $5
      )
      RETURNING *
    `,
      [tenantId, data.name, data.description || null, data.color || null, data.icon || null],
    )

    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as ClinicalNoteCategory
    }

    return null
  } catch (error) {
    console.error("Error creating clinical note category:", error)
    throw error
  }
}

// Add the missing exports
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
        data.follow_up_date,
        data.follow_up_notes,
      ],
    )

    if (result.rows && result.rows.length > 0) {
      // Log activity
      await logActivity({
        tenantId,
        activityType: "clinical_note_created",
        description: `Clinical note created: ${data.title}`,
        patientId: data.patient_id,
        userId: data.created_by,
      })

      return result.rows[0] as ClinicalNote
    }

    return null
  } catch (error) {
    console.error("Error creating clinical note:", error)
    throw error
  }
}

export async function getAttachmentsByNoteId(
  noteId: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNoteAttachment[]> {
  try {
    const result = await sql.query(
      `
      SELECT * FROM clinical_note_attachments
      WHERE note_id = $1
      ORDER BY uploaded_at DESC
    `,
      [noteId],
    )

    return result.rows || []
  } catch (error) {
    console.error("Error fetching clinical note attachments:", error)
    return []
  }
}

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
      return result.rows[0] as ClinicalNote
    }

    return null
  } catch (error) {
    console.error("Error fetching clinical note:", error)
    return null
  }
}

export async function updateClinicalNote(
  id: string,
  data: Partial<
    Omit<
      ClinicalNote,
      | "id"
      | "created_at"
      | "updated_at"
      | "tenant_id"
      | "patient_id"
      | "created_by"
      | "category_name"
      | "category_color"
      | "created_by_name"
    >
  >,
  tenantId: string = DEFAULT_TENANT_ID,
  userId: string,
): Promise<ClinicalNote | null> {
  try {
    // Get the original note for comparison
    const originalNote = await getClinicalNoteById(id, tenantId)
    if (!originalNote) {
      throw new Error("Clinical note not found")
    }

    // Build the update query dynamically based on provided fields
    const updateFields: string[] = []
    const queryParams: any[] = []
    let paramIndex = 1

    // Add each field that needs to be updated
    if (data.title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`)
      queryParams.push(data.title)
    }
    if (data.content !== undefined) {
      updateFields.push(`content = $${paramIndex++}`)
      queryParams.push(data.content)
    }
    if (data.category_id !== undefined) {
      updateFields.push(`category_id = $${paramIndex++}`)
      queryParams.push(data.category_id)
    }
    if (data.is_private !== undefined) {
      updateFields.push(`is_private = $${paramIndex++}`)
      queryParams.push(data.is_private)
    }
    if (data.is_important !== undefined) {
      updateFields.push(`is_important = $${paramIndex++}`)
      queryParams.push(data.is_important)
    }
    if (data.tags !== undefined) {
      updateFields.push(`tags = $${paramIndex++}`)
      queryParams.push(data.tags)
    }
    if (data.follow_up_date !== undefined) {
      updateFields.push(`follow_up_date = $${paramIndex++}`)
      queryParams.push(data.follow_up_date)
    }
    if (data.follow_up_notes !== undefined) {
      updateFields.push(`follow_up_notes = $${paramIndex++}`)
      queryParams.push(data.follow_up_notes)
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = NOW()`)

    // Add the WHERE clause parameters
    queryParams.push(id)
    queryParams.push(tenantId)

    // Execute the update query
    const result = await sql.query(
      `
      UPDATE clinical_notes
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex++}
      AND tenant_id = $${paramIndex}
      RETURNING *
    `,
      queryParams,
    )

    if (result.rows && result.rows.length > 0) {
      // Log activity
      await logActivity({
        tenantId,
        activityType: "clinical_note_updated",
        description: `Clinical note updated: ${originalNote.title}`,
        patientId: originalNote.patient_id,
        userId,
      })

      return result.rows[0] as ClinicalNote
    }

    return null
  } catch (error) {
    console.error("Error updating clinical note:", error)
    throw error
  }
}

export async function deleteClinicalNote(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
  userId: string,
): Promise<boolean> {
  try {
    // Get the note before deletion for logging
    const note = await getClinicalNoteById(id, tenantId)
    if (!note) {
      return false
    }

    // Delete the note
    const result = await sql.query(
      `
      DELETE FROM clinical_notes
      WHERE id = $1
      AND tenant_id = $2
      RETURNING id
    `,
      [id, tenantId],
    )

    if (result.rows && result.rows.length > 0) {
      // Log activity
      await logActivity({
        tenantId,
        activityType: "clinical_note_deleted",
        description: `Clinical note deleted: ${note.title}`,
        patientId: note.patient_id,
        userId,
      })

      return true
    }

    return false
  } catch (error) {
    console.error("Error deleting clinical note:", error)
    return false
  }
}

export async function addAttachmentToNote(
  noteId: string,
  attachment: Omit<ClinicalNoteAttachment, "id" | "note_id" | "uploaded_at">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNoteAttachment | null> {
  try {
    const result = await sql.query(
      `
      INSERT INTO clinical_note_attachments (
        note_id,
        file_name,
        file_path,
        file_type,
        file_size,
        uploaded_by,
        content_type
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )
      RETURNING *
    `,
      [
        noteId,
        attachment.file_name,
        attachment.file_path,
        attachment.file_type,
        attachment.file_size,
        attachment.uploaded_by,
        attachment.content_type,
      ],
    )

    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as ClinicalNoteAttachment
    }

    return null
  } catch (error) {
    console.error("Error adding attachment to clinical note:", error)
    throw error
  }
}

// Create a service object for default export
const clinicalNotesService = {
  getClinicalNotesByPatientId,
  getClinicalNoteCategories,
  createClinicalNoteCategory,
  getClinicalNoteTemplates,
  createClinicalNote,
  getAttachmentsByNoteId,
  getClinicalNoteById,
  updateClinicalNote,
  deleteClinicalNote,
  addAttachmentToNote,
}

export default clinicalNotesService
