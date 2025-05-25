import { sql } from "@/lib/db"

export interface ClinicalNoteCategory {
  id: string
  tenant_id: string
  name: string
  description?: string
  color?: string
  icon?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClinicalNoteTemplate {
  id: string
  tenant_id: string
  category_id?: string
  name: string
  content: string
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  category?: ClinicalNoteCategory
}

export interface ClinicalNote {
  id: string
  tenant_id: string
  patient_id: string
  category_id?: string
  care_professional_id?: string
  title: string
  content: string
  is_confidential: boolean
  is_draft: boolean
  tags?: string[]
  created_at: string
  updated_at: string
  created_by: string
  updated_by?: string
  category?: ClinicalNoteCategory
  care_professional?: any
  patient?: any
  attachments?: ClinicalNoteAttachment[]
}

export interface ClinicalNoteAttachment {
  id: string
  clinical_note_id: string
  file_name: string
  file_path: string
  file_type?: string
  file_size?: number
  uploaded_at: string
  uploaded_by: string
}

export class ClinicalNotesService {
  async getCategories(tenantId: string): Promise<ClinicalNoteCategory[]> {
    const result = await sql`
    SELECT * FROM clinical_note_categories 
    WHERE tenant_id = ${tenantId} AND is_active = true
    ORDER BY name ASC
  `
    return result
  }

  async createCategory(
    tenantId: string,
    category: Omit<ClinicalNoteCategory, "id" | "tenant_id" | "created_at" | "updated_at" | "is_active">,
  ): Promise<ClinicalNoteCategory> {
    const result = await sql.query(
      "INSERT INTO clinical_note_categories (tenant_id, name, description, color, icon, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, tenant_id, name, description, color, icon, is_active, created_at, updated_at",
      [tenantId, category.name, category.description, category.color, category.icon, true],
    )

    return {
      id: result[0].id,
      tenant_id: result[0].tenant_id,
      name: result[0].name,
      description: result[0].description,
      color: result[0].color,
      icon: result[0].icon,
      is_active: result[0].is_active,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    }
  }

  async getTemplates(tenantId: string): Promise<ClinicalNoteTemplate[]> {
    const result = await sql.query(
      `SELECT t.id, t.tenant_id, t.category_id, t.name, t.content, t.is_default, t.is_active, t.created_at, t.updated_at, c.name as category_name
       FROM clinical_note_templates t
       LEFT JOIN clinical_note_categories c ON t.category_id = c.id
       WHERE t.tenant_id = $1
       ORDER BY t.name ASC`,
      [tenantId],
    )

    return result.map((row) => ({
      id: row.id,
      tenant_id: row.tenant_id,
      category_id: row.category_id,
      name: row.name,
      content: row.content,
      is_default: row.is_default,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      categoryName: row.category_name,
    }))
  }

  async createTemplate(
    tenantId: string,
    userId: string,
    template: Omit<ClinicalNoteTemplate, "id" | "tenant_id" | "created_at" | "updated_at" | "categoryName">,
  ): Promise<ClinicalNoteTemplate> {
    const result = await sql.query(
      "INSERT INTO clinical_note_templates (tenant_id, category_id, name, content, is_default, is_active, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, tenant_id, category_id, name, content, is_default, is_active, created_at, updated_at",
      [
        tenantId,
        template.category_id,
        template.name,
        template.content,
        template.is_default,
        template.is_active,
        userId,
      ],
    )

    let categoryName = null
    if (result[0].category_id) {
      const categoryResult = await sql.query("SELECT name FROM clinical_note_categories WHERE id = $1", [
        result[0].category_id,
      ])
      if (categoryResult.length > 0) {
        categoryName = categoryResult[0].name
      }
    }

    return {
      id: result[0].id,
      tenant_id: result[0].tenant_id,
      category_id: result[0].category_id,
      name: result[0].name,
      content: result[0].content,
      is_default: result[0].is_default,
      is_active: result[0].is_active,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      categoryName,
    }
  }

  async getNotes(
    tenantId: string,
    filters?: {
      patientId?: string
      categoryId?: string
      careProfessionalId?: string
      searchTerm?: string
      isDraft?: boolean
      isConfidential?: boolean
      startDate?: string
      endDate?: string
    },
  ): Promise<ClinicalNote[]> {
    let query = sql`
    SELECT 
      n.*,
      c.name as category_name,
      c.color as category_color,
      c.icon as category_icon,
      p.first_name || ' ' || p.last_name as patient_name,
      cp.first_name || ' ' || cp.last_name as care_professional_name,
      u.name as created_by_name
    FROM clinical_notes n
    LEFT JOIN clinical_note_categories c ON n.category_id = c.id
    LEFT JOIN patients p ON n.patient_id = p.id
    LEFT JOIN care_professionals cp ON n.care_professional_id = cp.id
    LEFT JOIN users u ON n.created_by = u.id
    WHERE n.tenant_id = ${tenantId}
  `

    if (filters?.patientId) {
      query = sql`${query} AND n.patient_id = ${filters.patientId}`
    }
    if (filters?.categoryId) {
      query = sql`${query} AND n.category_id = ${filters.categoryId}`
    }
    if (filters?.careProfessionalId) {
      query = sql`${query} AND n.care_professional_id = ${filters.careProfessionalId}`
    }
    if (filters?.isDraft !== undefined) {
      query = sql`${query} AND n.is_draft = ${filters.isDraft}`
    }
    if (filters?.isConfidential !== undefined) {
      query = sql`${query} AND n.is_confidential = ${filters.isConfidential}`
    }
    if (filters?.searchTerm) {
      query = sql`${query} AND (n.title ILIKE ${"%" + filters.searchTerm + "%"} OR n.content ILIKE ${"%" + filters.searchTerm + "%"})`
    }
    if (filters?.startDate) {
      query = sql`${query} AND n.created_at >= ${filters.startDate}`
    }
    if (filters?.endDate) {
      query = sql`${query} AND n.created_at <= ${filters.endDate}`
    }

    query = sql`${query} ORDER BY n.created_at DESC`

    const result = await query
    return result
  }

  async createNote(
    tenantId: string,
    userId: string,
    note: Omit<ClinicalNote, "id" | "tenant_id" | "created_at" | "updated_at" | "categoryName">,
  ): Promise<ClinicalNote> {
    const result = await sql.query(
      `INSERT INTO clinical_notes (
        tenant_id, patient_id, category_id, care_professional_id, title, content, 
        is_confidential, is_draft, tags, created_by
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING id, tenant_id, patient_id, category_id, care_professional_id, title, content, 
                is_confidential, is_draft, tags, created_at, updated_at, created_by`,
      [
        tenantId,
        note.patient_id,
        note.category_id,
        note.care_professional_id,
        note.title,
        note.content,
        note.is_confidential,
        note.is_draft,
        note.tags || [],
        userId,
      ],
    )

    let categoryName = null
    if (result[0].category_id) {
      const categoryResult = await sql.query("SELECT name FROM clinical_note_categories WHERE id = $1", [
        result[0].category_id,
      ])
      if (categoryResult.length > 0) {
        categoryName = categoryResult[0].name
      }
    }

    return {
      id: result[0].id,
      tenant_id: result[0].tenant_id,
      patient_id: result[0].patient_id,
      category_id: result[0].category_id,
      care_professional_id: result[0].care_professional_id,
      title: result[0].title,
      content: result[0].content,
      is_confidential: result[0].is_confidential,
      is_draft: result[0].is_draft,
      tags: result[0].tags,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      createdBy: result[0].created_by,
      categoryName,
    }
  }

  async updateNote(tenantId: string, noteId: string, note: Partial<ClinicalNote>): Promise<ClinicalNote> {
    // Build the SET clause dynamically based on provided fields
    const updates = []
    const values: any[] = [noteId, tenantId]

    if (note.patient_id !== undefined) {
      updates.push(`patient_id = $${values.length + 1}`)
      values.push(note.patient_id)
    }

    if (note.category_id !== undefined) {
      updates.push(`category_id = $${values.length + 1}`)
      values.push(note.category_id)
    }

    if (note.care_professional_id !== undefined) {
      updates.push(`care_professional_id = $${values.length + 1}`)
      values.push(note.care_professional_id)
    }

    if (note.title !== undefined) {
      updates.push(`title = $${values.length + 1}`)
      values.push(note.title)
    }

    if (note.content !== undefined) {
      updates.push(`content = $${values.length + 1}`)
      values.push(note.content)
    }

    if (note.is_confidential !== undefined) {
      updates.push(`is_confidential = $${values.length + 1}`)
      values.push(note.is_confidential)
    }

    if (note.is_draft !== undefined) {
      updates.push(`is_draft = $${values.length + 1}`)
      values.push(note.is_draft)
    }

    if (note.tags !== undefined) {
      updates.push(`tags = $${values.length + 1}`)
      values.push(note.tags)
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)

    const updateQuery = `
      UPDATE clinical_notes
      SET ${updates.join(", ")}
      WHERE id = $1 AND tenant_id = $2
      RETURNING id, tenant_id, patient_id, category_id, care_professional_id, title, content, 
                is_confidential, is_draft, tags, created_at, updated_at, created_by
    `

    const result = await sql.query(updateQuery, values)

    let categoryName = null
    if (result[0].category_id) {
      const categoryResult = await sql.query("SELECT name FROM clinical_note_categories WHERE id = $1", [
        result[0].category_id,
      ])
      if (categoryResult.length > 0) {
        categoryName = categoryResult[0].name
      }
    }

    return {
      id: result[0].id,
      tenant_id: result[0].tenant_id,
      patient_id: result[0].patient_id,
      category_id: result[0].category_id,
      care_professional_id: result[0].care_professional_id,
      title: result[0].title,
      content: result[0].content,
      is_confidential: result[0].is_confidential,
      is_draft: result[0].is_draft,
      tags: result[0].tags,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      createdBy: result[0].created_by,
      categoryName,
    }
  }

  async deleteNote(tenantId: string, noteId: string): Promise<boolean> {
    const result = await sql.query("DELETE FROM clinical_notes WHERE id = $1 AND tenant_id = $2 RETURNING id", [
      noteId,
      tenantId,
    ])

    return result.length > 0
  }

  async getAttachments(noteId: string): Promise<ClinicalNoteAttachment[]> {
    const result = await sql.query(
      "SELECT id, clinical_note_id, file_name, file_path, file_type, file_size, uploaded_at, uploaded_by FROM clinical_note_attachments WHERE clinical_note_id = $1 ORDER BY uploaded_at DESC",
      [noteId],
    )

    return result.map((row) => ({
      id: row.id,
      clinical_note_id: row.clinical_note_id,
      file_name: row.file_name,
      file_path: row.file_path,
      file_type: row.file_type,
      file_size: row.file_size,
      uploaded_at: row.uploaded_at,
      uploaded_by: row.uploaded_by,
    }))
  }

  async addAttachment(attachment: Omit<ClinicalNoteAttachment, "id" | "uploaded_at">): Promise<ClinicalNoteAttachment> {
    const result = await sql.query(
      `INSERT INTO clinical_note_attachments (
        clinical_note_id, file_name, file_path, file_type, file_size, uploaded_by
      )
      VALUES (
        $1, $2, $3, $4, $5, $6
      )
      RETURNING id, clinical_note_id, file_name, file_path, file_type, file_size, uploaded_at, uploaded_by`,
      [
        attachment.clinical_note_id,
        attachment.file_name,
        attachment.file_path,
        attachment.file_type,
        attachment.file_size,
        attachment.uploaded_by,
      ],
    )

    return {
      id: result[0].id,
      clinical_note_id: result[0].clinical_note_id,
      file_name: result[0].file_name,
      file_path: result[0].file_path,
      file_type: result[0].file_type,
      file_size: result[0].file_size,
      uploaded_at: result[0].uploaded_at,
      uploaded_by: result[0].uploaded_by,
    }
  }

  async deleteAttachment(attachmentId: string): Promise<boolean> {
    const result = await sql.query("DELETE FROM clinical_note_attachments WHERE id = $1 RETURNING id", [attachmentId])

    return result.length > 0
  }
}

// Create a singleton instance
const clinicalNotesService = new ClinicalNotesService()
export default clinicalNotesService

// Export the required functions to fix the deployment issues
export async function createClinicalNoteCategory(category: any): Promise<ClinicalNoteCategory> {
  const tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Use the default tenant ID
  return await clinicalNotesService.createCategory(tenantId, category)
}

export async function createClinicalNote(note: any): Promise<ClinicalNote> {
  const tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Use the default tenant ID
  const userId = "default" // You should get the actual user ID
  return await clinicalNotesService.createNote(tenantId, userId, note)
}

export async function updateClinicalNote(id: string, note: any): Promise<ClinicalNote> {
  const tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Use the default tenant ID
  return await clinicalNotesService.updateNote(tenantId, id, note)
}

export async function deleteClinicalNote(id: string): Promise<boolean> {
  const tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Use the default tenant ID
  return await clinicalNotesService.deleteNote(tenantId, id)
}

export async function getClinicalNotes(patientId?: string): Promise<ClinicalNote[]> {
  const tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Use the default tenant ID
  return await clinicalNotesService.getNotes(tenantId, { patientId })
}

export async function getClinicalNoteCategories(): Promise<ClinicalNoteCategory[]> {
  const tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Use the default tenant ID
  return await clinicalNotesService.getCategories(tenantId)
}

export async function getClinicalNoteTemplates(): Promise<ClinicalNoteTemplate[]> {
  const tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Use the default tenant ID
  return await clinicalNotesService.getTemplates(tenantId)
}
