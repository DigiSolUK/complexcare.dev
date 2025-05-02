import { neon } from "@neondatabase/serverless"

export interface ClinicalNoteCategory {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
}

export interface ClinicalNoteTemplate {
  id: string
  name: string
  content: string
  categoryId?: string
  categoryName?: string
}

export interface ClinicalNote {
  id: string
  patientId: string
  title: string
  content: string
  categoryId?: string
  categoryName?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  isPrivate: boolean
  isImportant: boolean
  tags?: string[]
}

export interface ClinicalNoteAttachment {
  id: string
  noteId: string
  fileName: string
  filePath: string
  fileType?: string
  fileSize?: number
  uploadedBy: string
  uploadedAt: Date
}

export class ClinicalNotesService {
  private sql = neon(process.env.DATABASE_URL!)

  async getCategories(tenantId: string): Promise<ClinicalNoteCategory[]> {
    const result = await this.sql`
      SELECT id, name, description, color, icon
      FROM clinical_note_categories
      WHERE tenant_id = ${tenantId}
      ORDER BY name ASC
    `

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      color: row.color,
      icon: row.icon,
    }))
  }

  async createCategory(tenantId: string, category: Omit<ClinicalNoteCategory, "id">): Promise<ClinicalNoteCategory> {
    const result = await this.sql`
      INSERT INTO clinical_note_categories (tenant_id, name, description, color, icon)
      VALUES (${tenantId}, ${category.name}, ${category.description}, ${category.color}, ${category.icon})
      RETURNING id, name, description, color, icon
    `

    return {
      id: result[0].id,
      name: result[0].name,
      description: result[0].description,
      color: result[0].color,
      icon: result[0].icon,
    }
  }

  async getTemplates(tenantId: string): Promise<ClinicalNoteTemplate[]> {
    const result = await this.sql`
      SELECT t.id, t.name, t.content, t.category_id, c.name as category_name
      FROM clinical_note_templates t
      LEFT JOIN clinical_note_categories c ON t.category_id = c.id
      WHERE t.tenant_id = ${tenantId}
      ORDER BY t.name ASC
    `

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      content: row.content,
      categoryId: row.category_id,
      categoryName: row.category_name,
    }))
  }

  async createTemplate(
    tenantId: string,
    userId: string,
    template: Omit<ClinicalNoteTemplate, "id" | "categoryName">,
  ): Promise<ClinicalNoteTemplate> {
    const result = await this.sql`
      INSERT INTO clinical_note_templates (tenant_id, name, content, category_id, created_by)
      VALUES (${tenantId}, ${template.name}, ${template.content}, ${template.categoryId}, ${userId})
      RETURNING id, name, content, category_id
    `

    let categoryName = null
    if (result[0].category_id) {
      const categoryResult = await this.sql`
        SELECT name FROM clinical_note_categories WHERE id = ${result[0].category_id}
      `
      if (categoryResult.length > 0) {
        categoryName = categoryResult[0].name
      }
    }

    return {
      id: result[0].id,
      name: result[0].name,
      content: result[0].content,
      categoryId: result[0].category_id,
      categoryName,
    }
  }

  async getNotes(tenantId: string, patientId?: string): Promise<ClinicalNote[]> {
    let query

    if (patientId) {
      query = this.sql`
        SELECT n.id, n.patient_id, n.title, n.content, n.category_id, c.name as category_name,
               n.created_by, n.created_at, n.updated_at, n.is_private, n.is_important, n.tags
        FROM clinical_notes n
        LEFT JOIN clinical_note_categories c ON n.category_id = c.id
        WHERE n.tenant_id = ${tenantId} AND n.patient_id = ${patientId}
        ORDER BY n.created_at DESC
      `
    } else {
      query = this.sql`
        SELECT n.id, n.patient_id, n.title, n.content, n.category_id, c.name as category_name,
               n.created_by, n.created_at, n.updated_at, n.is_private, n.is_important, n.tags
        FROM clinical_notes n
        LEFT JOIN clinical_note_categories c ON n.category_id = c.id
        WHERE n.tenant_id = ${tenantId}
        ORDER BY n.created_at DESC
      `
    }

    const result = await query

    return result.map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      title: row.title,
      content: row.content,
      categoryId: row.category_id,
      categoryName: row.category_name,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isPrivate: row.is_private,
      isImportant: row.is_important,
      tags: row.tags,
    }))
  }

  async createNote(
    tenantId: string,
    userId: string,
    note: Omit<ClinicalNote, "id" | "createdBy" | "createdAt" | "updatedAt" | "categoryName">,
  ): Promise<ClinicalNote> {
    const result = await this.sql`
      INSERT INTO clinical_notes (
        tenant_id, patient_id, title, content, category_id, 
        created_by, is_private, is_important, tags
      )
      VALUES (
        ${tenantId}, ${note.patientId}, ${note.title}, ${note.content}, ${note.categoryId},
        ${userId}, ${note.isPrivate}, ${note.isImportant}, ${note.tags || []}
      )
      RETURNING id, patient_id, title, content, category_id, 
                created_by, created_at, updated_at, is_private, is_important, tags
    `

    let categoryName = null
    if (result[0].category_id) {
      const categoryResult = await this.sql`
        SELECT name FROM clinical_note_categories WHERE id = ${result[0].category_id}
      `
      if (categoryResult.length > 0) {
        categoryName = categoryResult[0].name
      }
    }

    return {
      id: result[0].id,
      patientId: result[0].patient_id,
      title: result[0].title,
      content: result[0].content,
      categoryId: result[0].category_id,
      categoryName,
      createdBy: result[0].created_by,
      createdAt: result[0].created_at,
      updatedAt: result[0].updated_at,
      isPrivate: result[0].is_private,
      isImportant: result[0].is_important,
      tags: result[0].tags,
    }
  }

  async updateNote(tenantId: string, noteId: string, note: Partial<ClinicalNote>): Promise<ClinicalNote> {
    // Build the SET clause dynamically based on provided fields
    const updates = []
    const values: any[] = [noteId, tenantId]

    if (note.title !== undefined) {
      updates.push(`title = $${values.length + 1}`)
      values.push(note.title)
    }

    if (note.content !== undefined) {
      updates.push(`content = $${values.length + 1}`)
      values.push(note.content)
    }

    if (note.categoryId !== undefined) {
      updates.push(`category_id = $${values.length + 1}`)
      values.push(note.categoryId)
    }

    if (note.isPrivate !== undefined) {
      updates.push(`is_private = $${values.length + 1}`)
      values.push(note.isPrivate)
    }

    if (note.isImportant !== undefined) {
      updates.push(`is_important = $${values.length + 1}`)
      values.push(note.isImportant)
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
      RETURNING id, patient_id, title, content, category_id, 
                created_by, created_at, updated_at, is_private, is_important, tags
    `

    const result = await this.sql.query(updateQuery, values)

    let categoryName = null
    if (result.rows[0].category_id) {
      const categoryResult = await this.sql`
        SELECT name FROM clinical_note_categories WHERE id = ${result.rows[0].category_id}
      `
      if (categoryResult.length > 0) {
        categoryName = categoryResult[0].name
      }
    }

    return {
      id: result.rows[0].id,
      patientId: result.rows[0].patient_id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      categoryId: result.rows[0].category_id,
      categoryName,
      createdBy: result.rows[0].created_by,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
      isPrivate: result.rows[0].is_private,
      isImportant: result.rows[0].is_important,
      tags: result.rows[0].tags,
    }
  }

  async deleteNote(tenantId: string, noteId: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM clinical_notes
      WHERE id = ${noteId} AND tenant_id = ${tenantId}
      RETURNING id
    `

    return result.length > 0
  }

  async getAttachments(noteId: string): Promise<ClinicalNoteAttachment[]> {
    const result = await this.sql`
      SELECT id, note_id, file_name, file_path, file_type, file_size, uploaded_by, uploaded_at
      FROM clinical_note_attachments
      WHERE note_id = ${noteId}
      ORDER BY uploaded_at DESC
    `

    return result.map((row) => ({
      id: row.id,
      noteId: row.note_id,
      fileName: row.file_name,
      filePath: row.file_path,
      fileType: row.file_type,
      fileSize: row.file_size,
      uploadedBy: row.uploaded_by,
      uploadedAt: row.uploaded_at,
    }))
  }

  async addAttachment(attachment: Omit<ClinicalNoteAttachment, "id" | "uploadedAt">): Promise<ClinicalNoteAttachment> {
    const result = await this.sql`
      INSERT INTO clinical_note_attachments (
        note_id, file_name, file_path, file_type, file_size, uploaded_by
      )
      VALUES (
        ${attachment.noteId}, ${attachment.fileName}, ${attachment.filePath}, 
        ${attachment.fileType}, ${attachment.fileSize}, ${attachment.uploadedBy}
      )
      RETURNING id, note_id, file_name, file_path, file_type, file_size, uploaded_by, uploaded_at
    `

    return {
      id: result[0].id,
      noteId: result[0].note_id,
      fileName: result[0].file_name,
      filePath: result[0].file_path,
      fileType: result[0].file_type,
      fileSize: result[0].file_size,
      uploadedBy: result[0].uploaded_by,
      uploadedAt: result[0].uploaded_at,
    }
  }

  async deleteAttachment(attachmentId: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM clinical_note_attachments
      WHERE id = ${attachmentId}
      RETURNING id
    `

    return result.length > 0
  }
}

// Create a singleton instance
const clinicalNotesService = new ClinicalNotesService()
export default clinicalNotesService

// Export the required functions to fix the deployment issues
export async function createClinicalNoteCategory(category: any): Promise<ClinicalNoteCategory> {
  const tenantId = "default" // You should get the actual tenant ID
  return await clinicalNotesService.createCategory(tenantId, category)
}

export async function createClinicalNote(note: any): Promise<ClinicalNote> {
  const tenantId = "default" // You should get the actual tenant ID
  const userId = "default" // You should get the actual user ID
  return await clinicalNotesService.createNote(tenantId, userId, note)
}

export async function updateClinicalNote(id: string, note: any): Promise<ClinicalNote> {
  const tenantId = "default" // You should get the actual tenant ID
  return await clinicalNotesService.updateNote(tenantId, id, note)
}

export async function deleteClinicalNote(id: string): Promise<boolean> {
  const tenantId = "default" // You should get the actual tenant ID
  return await clinicalNotesService.deleteNote(tenantId, id)
}

export async function getClinicalNotes(patientId?: string): Promise<ClinicalNote[]> {
  const tenantId = "default" // You should get the actual tenant ID
  return await clinicalNotesService.getNotes(tenantId, patientId)
}

export async function getClinicalNoteCategories(): Promise<ClinicalNoteCategory[]> {
  const tenantId = "default" // You should get the actual tenant ID
  return await clinicalNotesService.getCategories(tenantId)
}

export async function getClinicalNoteTemplates(): Promise<ClinicalNoteTemplate[]> {
  const tenantId = "default" // You should get the actual tenant ID
  return await clinicalNotesService.getTemplates(tenantId)
}
