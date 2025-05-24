import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

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
    const sql = neon(process.env.DATABASE_URL!)

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
    const sql = neon(process.env.DATABASE_URL!)

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

    if (result.length === 0) {
      return null
    }

    return result[0] as ClinicalNote
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
    const sql = neon(process.env.DATABASE_URL!)

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

    if (result.length === 0) {
      return null
    }

    return result[0] as ClinicalNote
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
    const sql = neon(process.env.DATABASE_URL!)

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

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as ClinicalNote
  } catch (error) {
    console.error(`Error updating clinical note with ID ${id}:`, error)
    throw error
  }
}

export async function deleteClinicalNote(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      DELETE FROM clinical_notes
      WHERE id = ${id}
      AND tenant_id = ${tenantId}
    `

    return true
  } catch (error) {
    console.error(`Error deleting clinical note with ID ${id}:`, error)
    return false
  }
}

export async function getClinicalNoteCategories(tenantId: string = DEFAULT_TENANT_ID): Promise<ClinicalNoteCategory[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

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
    const sql = neon(process.env.DATABASE_URL!)

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
    const sql = neon(process.env.DATABASE_URL!)

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

    if (result.length === 0) {
      return null
    }

    return result[0] as ClinicalNoteCategory
  } catch (error) {
    console.error("Error creating clinical note category:", error)
    throw error
  }
}

export async function createClinicalNoteTemplate(
  data: Omit<ClinicalNoteTemplate, "id" | "created_at" | "updated_at" | "category_name">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNoteTemplate | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      INSERT INTO clinical_note_templates (
        tenant_id,
        name,
        content,
        category_id,
        created_by
      ) VALUES (
        ${tenantId},
        ${data.name},
        ${data.content},
        ${data.category_id || null},
        ${data.created_by}
      )
      RETURNING *
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as ClinicalNoteTemplate
  } catch (error) {
    console.error("Error creating clinical note template:", error)
    throw error
  }
}

export async function getAttachmentsByNoteId(
  noteId: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNoteAttachment[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM clinical_note_attachments
      WHERE note_id = ${noteId}
      ORDER BY uploaded_at DESC
    `

    return result as ClinicalNoteAttachment[]
  } catch (error) {
    console.error(`Error fetching attachments for note ${noteId}:`, error)
    return []
  }
}

export async function addAttachmentToNote(
  data: Omit<ClinicalNoteAttachment, "id" | "uploaded_at">,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<ClinicalNoteAttachment | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      INSERT INTO clinical_note_attachments (
        note_id,
        file_name,
        file_path,
        file_type,
        file_size,
        uploaded_by,
        content_type
      ) VALUES (
        ${data.note_id},
        ${data.file_name},
        ${data.file_path},
        ${data.file_type || null},
        ${data.file_size || null},
        ${data.uploaded_by},
        ${data.content_type || null}
      )
      RETURNING *
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as ClinicalNoteAttachment
  } catch (error) {
    console.error("Error adding attachment to note:", error)
    throw error
  }
}

// Create a service object with all the functions
const clinicalNotesService = {
  getClinicalNotesByPatientId,
  getClinicalNoteById,
  createClinicalNote,
  updateClinicalNote,
  deleteClinicalNote,
  getClinicalNoteCategories,
  getClinicalNoteTemplates,
  createClinicalNoteCategory,
  createClinicalNoteTemplate,
  getAttachmentsByNoteId,
  addAttachmentToNote,
}

export default clinicalNotesService
