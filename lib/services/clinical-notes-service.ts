import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { logActivity } from "./activity-log-service"
import { sql } from "@/lib/db-utils"
import { v4 as uuidv4 } from "uuid"
import { getAll, getById, insert, update, remove } from "../db-connection"

export interface ClinicalNote {
  id: string
  tenant_id: string
  patient_id: string
  author_id: string
  category_id?: string
  title: string
  content: string
  is_private: boolean
  is_important: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
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

export async function getAllClinicalNotes(
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<ClinicalNote[]> {
  return getAll<ClinicalNote>("clinical_notes", tenantId, limit, offset)
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

export async function getClinicalNoteById(
  id: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  return getById<ClinicalNote>("clinical_notes", id, tenantId)
}

export async function getClinicalNotesByPatient(
  patientId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
  offset = 0,
): Promise<ClinicalNote[]> {
  try {
    const query = `
      SELECT * FROM clinical_notes
      WHERE tenant_id = $1
      AND patient_id = $2
      AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT $3 OFFSET $4
    `
    const result = await sql.query(query, [tenantId, patientId, limit, offset])
    return result.rows as ClinicalNote[]
  } catch (error) {
    console.error("Error getting clinical notes by patient:", error)
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
  data: Omit<ClinicalNote, "id" | "tenant_id" | "created_at" | "updated_at" | "deleted_at">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  const noteData = {
    ...data,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return insert<ClinicalNote>("clinical_notes", noteData, tenantId)
}

export async function updateClinicalNote(
  id: string,
  data: Partial<ClinicalNote>,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNote | null> {
  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  return update<ClinicalNote>("clinical_notes", id, updateData, tenantId)
}

export async function deleteClinicalNote(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<boolean> {
  return remove("clinical_notes", id, tenantId, true)
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

export async function getClinicalNoteCount(patientId?: string, tenantId: string = DEFAULT_TENANT_ID): Promise<number> {
  try {
    let query = `
      SELECT COUNT(*) as count
      FROM clinical_notes
      WHERE tenant_id = $1 AND deleted_at IS NULL
    `
    const params = [tenantId]

    if (patientId) {
      query += ` AND patient_id = $2`
      params.push(patientId)
    }

    const result = await sql.query(query, params)
    return Number.parseInt(result.rows?.[0]?.count || "0", 10)
  } catch (error) {
    console.error("Error counting clinical notes:", error)
    throw error
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
  getAllClinicalNotes,
  getClinicalNotesByPatient,
  getClinicalNoteCount,
}

export default clinicalNotesService
