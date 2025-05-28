import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { logActivity } from "./activity-log-service"
import { sql } from "@/lib/db-manager"

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
  data: {
    patient_id: string
    title: string
    content: string
    category_id?: string
    is_private?: boolean
    is_important?: boolean
    tags?: string[]
    follow_up_date?: string
    follow_up_notes?: string
  },
  userId: string,
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
        data.category_id || null,
        userId,
        data.is_private || false,
        data.is_important || false,
        data.tags || [],
        data.follow_up_date || null,
        data.follow_up_notes || null,
      ],
    )

    if (result.rows && result.rows.length > 0) {
      const note = result.rows[0] as ClinicalNote

      // Log activity
      await logActivity({
        tenantId,
        activityType: "clinical_note_created",
        description: `Clinical note created: ${data.title}`,
        patientId: data.patient_id,
        userId,
        metadata: {
          noteId: note.id,
          noteTitle: data.title,
        },
      })

      return note
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
  data: {
    title?: string
    content?: string
    category_id?: string
    is_private?: boolean
    is_important?: boolean
    tags?: string[]
    follow_up_date?: string | null
    follow_up_notes?: string | null
  },
  userId: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  try {
    // Get the original note for comparison and validation
    const originalNote = await getClinicalNoteById(id, tenantId)
    if (!originalNote) {
      throw new Error("Clinical note not found")
    }

    // Build the update query dynamically based on provided fields
    const updates = []
    const values = [id, tenantId]
    let paramIndex = 3

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex++}`)
      values.push(data.title)
    }

    if (data.content !== undefined) {
      updates.push(`content = $${paramIndex++}`)
      values.push(data.content)
    }

    if (data.category_id !== undefined) {
      updates.push(`category_id = $${paramIndex++}`)
      values.push(data.category_id || null)
    }

    if (data.is_private !== undefined) {
      updates.push(`is_private = $${paramIndex++}`)
      values.push(data.is_private)
    }

    if (data.is_important !== undefined) {
      updates.push(`is_important = $${paramIndex++}`)
      values.push(data.is_important)
    }

    if (data.tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`)
      values.push(data.tags)
    }

    if (data.follow_up_date !== undefined) {
      updates.push(`follow_up_date = $${paramIndex++}`)
      values.push(data.follow_up_date)
    }

    if (data.follow_up_notes !== undefined) {
      updates.push(`follow_up_notes = $${paramIndex++}`)
      values.push(data.follow_up_notes)
    }

    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`)

    if (updates.length === 0) {
      return originalNote // No updates to make
    }

    const result = await sql.query(
      `
      UPDATE clinical_notes
      SET ${updates.join(", ")}
      WHERE id = $1
      AND tenant_id = $2
      RETURNING *
    `,
      values,
    )

    if (result.rows && result.rows.length > 0) {
      const updatedNote = result.rows[0] as ClinicalNote

      // Log activity
      await logActivity({
        tenantId,
        activityType: "clinical_note_updated",
        description: `Clinical note updated: ${updatedNote.title}`,
        patientId: originalNote.patient_id,
        userId,
        metadata: {
          noteId: id,
          noteTitle: updatedNote.title,
        },
      })

      return updatedNote
    }

    return null
  } catch (error) {
    console.error("Error updating clinical note:", error)
    throw error
  }
}

export async function deleteClinicalNote(
  id: string,
  userId: string,
  tenantId: string = DEFAULT_TENANT_ID,
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
        metadata: {
          noteId: id,
          noteTitle: note.title,
        },
      })

      return true
    }

    return false
  } catch (error) {
    console.error("Error deleting clinical note:", error)
    throw error
  }
}

export async function addAttachmentToNote(
  noteId: string,
  data: {
    file_name: string
    file_path: string
    file_type?: string
    file_size?: number
    content_type?: string
  },
  userId: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNoteAttachment | null> {
  try {
    // Verify the note exists and belongs to the tenant
    const note = await getClinicalNoteById(noteId, tenantId)
    if (!note) {
      throw new Error("Clinical note not found")
    }

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
        data.file_name,
        data.file_path,
        data.file_type || null,
        data.file_size || null,
        userId,
        data.content_type || null,
      ],
    )

    if (result.rows && result.rows.length > 0) {
      const attachment = result.rows[0] as ClinicalNoteAttachment

      // Log activity
      await logActivity({
        tenantId,
        activityType: "clinical_note_attachment_added",
        description: `Attachment added to clinical note: ${data.file_name}`,
        patientId: note.patient_id,
        userId,
        metadata: {
          noteId,
          attachmentId: attachment.id,
          fileName: data.file_name,
        },
      })

      return attachment
    }

    return null
  } catch (error) {
    console.error("Error adding attachment to clinical note:", error)
    throw error
  }
}

// Create a class for the service to export as default
class ClinicalNotesService {
  static async getNotesByPatientId(patientId: string, tenantId: string = DEFAULT_TENANT_ID, limit = 50) {
    return getClinicalNotesByPatientId(patientId, tenantId, limit)
  }

  static async getCategories(tenantId: string = DEFAULT_TENANT_ID) {
    return getClinicalNoteCategories(tenantId)
  }

  static async createCategory(
    data: Omit<ClinicalNoteCategory, "id" | "created_at" | "updated_at">,
    tenantId: string = DEFAULT_TENANT_ID,
  ) {
    return createClinicalNoteCategory(data, tenantId)
  }

  static async getTemplates(tenantId: string = DEFAULT_TENANT_ID) {
    return getClinicalNoteTemplates(tenantId)
  }

  static async createNote(data: any, userId: string, tenantId: string = DEFAULT_TENANT_ID) {
    return createClinicalNote(data, userId, tenantId)
  }

  static async getNoteById(id: string, tenantId: string = DEFAULT_TENANT_ID) {
    return getClinicalNoteById(id, tenantId)
  }

  static async updateNote(id: string, data: any, userId: string, tenantId: string = DEFAULT_TENANT_ID) {
    return updateClinicalNote(id, data, userId, tenantId)
  }

  static async deleteNote(id: string, userId: string, tenantId: string = DEFAULT_TENANT_ID) {
    return deleteClinicalNote(id, userId, tenantId)
  }

  static async getAttachments(noteId: string, tenantId: string = DEFAULT_TENANT_ID) {
    return getAttachmentsByNoteId(noteId, tenantId)
  }

  static async addAttachment(noteId: string, data: any, userId: string, tenantId: string = DEFAULT_TENANT_ID) {
    return addAttachmentToNote(noteId, data, userId, tenantId)
  }
}

// Export the service as default
export default ClinicalNotesService
