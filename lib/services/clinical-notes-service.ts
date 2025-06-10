import { getNeonSqlClient } from "@/lib/db"
import type { ClinicalNote, ClinicalNoteCategory, ClinicalNoteTemplate } from "@/types"
import { getCurrentUser } from "@/lib/auth-utils"
import type { NeonQueryFunction } from "@neondatabase/serverless"

type ClinicalNoteCreateInput = Omit<
  ClinicalNote,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "tenantId"
  | "patientName"
  | "careProfessionalName"
  | "categoryName"
  | "templateName"
>
type ClinicalNoteUpdateInput = Partial<ClinicalNoteCreateInput>

type ClinicalNoteCategoryCreateInput = Omit<ClinicalNoteCategory, "id" | "createdAt" | "updatedAt" | "tenantId">
type ClinicalNoteCategoryUpdateInput = Partial<ClinicalNoteCategoryCreateInput>

type ClinicalNoteTemplateCreateInput = Omit<
  ClinicalNoteTemplate,
  "id" | "createdAt" | "updatedAt" | "tenantId" | "categoryName"
>
type ClinicalNoteTemplateUpdateInput = Partial<ClinicalNoteTemplateCreateInput>

export class ClinicalNotesService {
  private sql: NeonQueryFunction<false>
  private tenantId: string

  constructor(sql: NeonQueryFunction<false>, tenantId: string) {
    this.sql = sql
    this.tenantId = tenantId
  }

  static async create(): Promise<ClinicalNotesService> {
    const user = await getCurrentUser()
    if (!user || !user.tenantId) {
      throw new Error("User not authenticated or tenant not found.")
    }
    const sql = getNeonSqlClient()
    return new ClinicalNotesService(sql, user.tenantId)
  }

  // --- Clinical Notes Operations ---

  async getNotes(patientId?: string): Promise<ClinicalNote[]> {
    let query = `
      SELECT
        cn.id,
        cn.tenant_id,
        cn.patient_id,
        cn.care_professional_id,
        cn.category_id,
        cn.template_id,
        cn.title,
        cn.content,
        cn.note_date,
        cn.created_at,
        cn.updated_at,
        p.first_name || ' ' || p.last_name AS patient_name,
        cp.first_name || ' ' || cp.last_name AS care_professional_name,
        cnc.name AS category_name,
        cnt.name AS template_name
      FROM clinical_notes cn
      JOIN patients p ON cn.patient_id = p.id
      JOIN care_professionals cp ON cn.care_professional_id = cp.id
      JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN clinical_note_templates cnt ON cn.template_id = cnt.id
      WHERE cn.tenant_id = ${this.tenantId}
    `
    const params: any[] = []

    if (patientId) {
      query += ` AND cn.patient_id = $${params.length + 1}`
      params.push(patientId)
    }

    query += ` ORDER BY cn.note_date DESC`

    const result = await this.sql.unsafe(query, params)

    return result.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      patientId: row.patient_id,
      careProfessionalId: row.care_professional_id,
      categoryId: row.category_id,
      templateId: row.template_id,
      title: row.title,
      content: row.content,
      noteDate: new Date(row.note_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      patientName: row.patient_name,
      careProfessionalName: row.care_professional_name,
      categoryName: row.category_name,
      templateName: row.template_name,
    }))
  }

  async getNoteById(id: string): Promise<ClinicalNote | null> {
    const result = await this.sql`
      SELECT
        cn.id,
        cn.tenant_id,
        cn.patient_id,
        cn.care_professional_id,
        cn.category_id,
        cn.template_id,
        cn.title,
        cn.content,
        cn.note_date,
        cn.created_at,
        cn.updated_at,
        p.first_name || ' ' || p.last_name AS patient_name,
        cp.first_name || ' ' || cp.last_name AS care_professional_name,
        cnc.name AS category_name,
        cnt.name AS template_name
      FROM clinical_notes cn
      JOIN patients p ON cn.patient_id = p.id
      JOIN care_professionals cp ON cn.care_professional_id = cp.id
      JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN clinical_note_templates cnt ON cn.template_id = cnt.id
      WHERE cn.id = ${id} AND cn.tenant_id = ${this.tenantId}
    `
    if (result.length === 0) return null
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      patientId: row.patient_id,
      careProfessionalId: row.care_professional_id,
      categoryId: row.category_id,
      templateId: row.template_id,
      title: row.title,
      content: row.content,
      noteDate: new Date(row.note_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      patientName: row.patient_name,
      careProfessionalName: row.care_professional_name,
      categoryName: row.category_name,
      templateName: row.template_name,
    }
  }

  async createNote(data: ClinicalNoteCreateInput): Promise<ClinicalNote> {
    const result = await this.sql`
      INSERT INTO clinical_notes (
        tenant_id,
        patient_id,
        care_professional_id,
        category_id,
        template_id,
        title,
        content,
        note_date
      ) VALUES (
        ${this.tenantId},
        ${data.patientId},
        ${data.careProfessionalId},
        ${data.categoryId},
        ${data.templateId || null},
        ${data.title},
        ${data.content},
        ${data.noteDate.toISOString()}
      )
      RETURNING *
    `
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      patientId: row.patient_id,
      careProfessionalId: row.care_professional_id,
      categoryId: row.category_id,
      templateId: row.template_id,
      title: row.title,
      content: row.content,
      noteDate: new Date(row.note_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }

  async updateNote(id: string, data: ClinicalNoteUpdateInput): Promise<ClinicalNote | null> {
    const result = await this.sql`
      UPDATE clinical_notes
      SET
        patient_id = COALESCE(${data.patientId || null}, patient_id),
        care_professional_id = COALESCE(${data.careProfessionalId || null}, care_professional_id),
        category_id = COALESCE(${data.categoryId || null}, category_id),
        template_id = COALESCE(${data.templateId || null}, template_id),
        title = COALESCE(${data.title || null}, title),
        content = COALESCE(${data.content || null}, content),
        note_date = COALESCE(${data.noteDate ? data.noteDate.toISOString() : null}, note_date),
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${this.tenantId}
      RETURNING *
    `
    if (result.length === 0) return null
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      patientId: row.patient_id,
      careProfessionalId: row.care_professional_id,
      categoryId: row.category_id,
      templateId: row.template_id,
      title: row.title,
      content: row.content,
      noteDate: new Date(row.note_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }

  async deleteNote(id: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM clinical_notes
      WHERE id = ${id} AND tenant_id = ${this.tenantId}
      RETURNING id
    `
    return result.length > 0
  }

  // --- Clinical Note Categories Operations ---

  async getCategories(): Promise<ClinicalNoteCategory[]> {
    const result = await this.sql`
      SELECT * FROM clinical_note_categories
      WHERE tenant_id = ${this.tenantId}
      ORDER BY name ASC
    `
    return result.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      description: row.description,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  }

  async getCategoryById(id: string): Promise<ClinicalNoteCategory | null> {
    const result = await this.sql`
      SELECT * FROM clinical_note_categories
      WHERE id = ${id} AND tenant_id = ${this.tenantId}
    `
    if (result.length === 0) return null
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      description: row.description,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }

  async createCategory(data: ClinicalNoteCategoryCreateInput): Promise<ClinicalNoteCategory> {
    const result = await this.sql`
      INSERT INTO clinical_note_categories (
        tenant_id,
        name,
        description
      ) VALUES (
        ${this.tenantId},
        ${data.name},
        ${data.description || null}
      )
      RETURNING *
    `
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      description: row.description,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }

  async updateCategory(id: string, data: ClinicalNoteCategoryUpdateInput): Promise<ClinicalNoteCategory | null> {
    const result = await this.sql`
      UPDATE clinical_note_categories
      SET
        name = COALESCE(${data.name || null}, name),
        description = COALESCE(${data.description || null}, description),
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${this.tenantId}
      RETURNING *
    `
    if (result.length === 0) return null
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      description: row.description,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM clinical_note_categories
      WHERE id = ${id} AND tenant_id = ${this.tenantId}
      RETURNING id
    `
    return result.length > 0
  }

  // --- Clinical Note Templates Operations ---

  async getTemplates(categoryId?: string): Promise<ClinicalNoteTemplate[]> {
    let query = `
      SELECT
        cnt.id,
        cnt.tenant_id,
        cnt.category_id,
        cnt.name,
        cnt.content,
        cnt.created_at,
        cnt.updated_at,
        cnc.name AS category_name
      FROM clinical_note_templates cnt
      JOIN clinical_note_categories cnc ON cnt.category_id = cnc.id
      WHERE cnt.tenant_id = ${this.tenantId}
    `
    const params: any[] = []

    if (categoryId) {
      query += ` AND cnt.category_id = $${params.length + 1}`
      params.push(categoryId)
    }

    query += ` ORDER BY cnt.name ASC`

    const result = await this.sql.unsafe(query, params)

    return result.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      categoryId: row.category_id,
      name: row.name,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      categoryName: row.category_name,
    }))
  }

  async getTemplateById(id: string): Promise<ClinicalNoteTemplate | null> {
    const result = await this.sql`
      SELECT
        cnt.id,
        cnt.tenant_id,
        cnt.category_id,
        cnt.name,
        cnt.content,
        cnt.created_at,
        cnt.updated_at,
        cnc.name AS category_name
      FROM clinical_note_templates cnt
      JOIN clinical_note_categories cnc ON cnt.category_id = cnc.id
      WHERE cnt.id = ${id} AND cnt.tenant_id = ${this.tenantId}
    `
    if (result.length === 0) return null
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      categoryId: row.category_id,
      name: row.name,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      categoryName: row.category_name,
    }
  }

  async createTemplate(data: ClinicalNoteTemplateCreateInput): Promise<ClinicalNoteTemplate> {
    const result = await this.sql`
      INSERT INTO clinical_note_templates (
        tenant_id,
        category_id,
        name,
        content
      ) VALUES (
        ${this.tenantId},
        ${data.categoryId},
        ${data.name},
        ${data.content}
      )
      RETURNING *
    `
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      categoryId: row.category_id,
      name: row.name,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }

  async updateTemplate(id: string, data: ClinicalNoteTemplateUpdateInput): Promise<ClinicalNoteTemplate | null> {
    const result = await this.sql`
      UPDATE clinical_note_templates
      SET
        category_id = COALESCE(${data.categoryId || null}, category_id),
        name = COALESCE(${data.name || null}, name),
        content = COALESCE(${data.content || null}, content),
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${this.tenantId}
      RETURNING *
    `
    if (result.length === 0) return null
    const row = result[0]
    return {
      id: row.id,
      tenantId: row.tenant_id,
      categoryId: row.category_id,
      name: row.name,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await this.sql`
      DELETE FROM clinical_note_templates
      WHERE id = ${id} AND tenant_id = ${this.tenantId}
      RETURNING id
    `
    return result.length > 0
  }
}
