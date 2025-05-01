import { neon } from "@neondatabase/serverless"

const db = neon(process.env.DATABASE_URL!)

export type ClinicalNote = {
  id: string
  tenant_id: string
  patient_id: string
  care_professional_id: string
  note_type: string
  title: string
  content: string
  is_private: boolean
  mood_score?: number
  pain_score?: number
  vital_signs?: any
  tags?: string[]
  attachments?: any
  created_at: Date
  updated_at: Date
  created_by: string
  updated_by?: string
  care_professional_first_name?: string
  care_professional_last_name?: string
  categories?: string[]
  category_ids?: string[]
}

export type ClinicalNoteCategory = {
  id: string
  tenant_id: string
  name: string
  description?: string
  color?: string
  created_at: Date
  updated_at: Date
}

export type ClinicalNoteTemplate = {
  id: string
  tenant_id: string
  name: string
  content: string
  note_type: string
  created_by: string
  created_at: Date
  updated_at: Date
}

export type CreateNoteInput = {
  patientId: string
  careProId: string
  noteType: string
  title: string
  content: string
  isPrivate?: boolean
  moodScore?: number
  painScore?: number
  vitalSigns?: any
  tags?: string[]
  attachments?: any
  categories?: string[]
  tenantId?: string
}

export type UpdateNoteInput = {
  noteType?: string
  title?: string
  content?: string
  isPrivate?: boolean
  moodScore?: number
  painScore?: number
  vitalSigns?: any
  tags?: string[]
  attachments?: any
  categories?: string[]
}

export type CreateCategoryInput = {
  name: string
  description?: string
  color?: string
  tenantId?: string
}

export type UpdateCategoryInput = {
  name?: string
  description?: string
  color?: string
}

export type CreateTemplateInput = {
  name: string
  content: string
  noteType: string
  tenantId?: string
}

export type UpdateTemplateInput = {
  name?: string
  content?: string
  noteType?: string
}

export const ClinicalNotesService = {
  // Notes
  async getNotesByPatientId(patientId: string, tenantId: string): Promise<ClinicalNote[]> {
    try {
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
      return notes
    } catch (error) {
      console.error("Error in getNotesByPatientId:", error)
      throw error
    }
  },

  async getNoteById(id: string, tenantId: string): Promise<ClinicalNote | null> {
    try {
      const [note] = await db`
        SELECT cn.*, 
               cp.first_name as care_professional_first_name, 
               cp.last_name as care_professional_last_name,
               array_agg(cnc.id) as category_ids,
               array_agg(cnc.name) as category_names
        FROM clinical_notes cn
        LEFT JOIN care_professionals cp ON cn.care_professional_id = cp.id
        LEFT JOIN clinical_notes_category_mappings cncm ON cn.id = cncm.note_id
        LEFT JOIN clinical_notes_categories cnc ON cncm.category_id = cnc.id
        WHERE cn.id = ${id}
        AND cn.tenant_id = ${tenantId}
        GROUP BY cn.id, cp.first_name, cp.last_name
      `
      return note || null
    } catch (error) {
      console.error("Error in getNoteById:", error)
      throw error
    }
  },

  async createNote(data: CreateNoteInput, userId: string): Promise<ClinicalNote> {
    try {
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
        tenantId,
      } = data

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

      return note
    } catch (error) {
      console.error("Error in createNote:", error)
      throw error
    }
  },

  async updateNote(id: string, data: UpdateNoteInput, tenantId: string, userId: string): Promise<ClinicalNote> {
    try {
      const { noteType, title, content, isPrivate, moodScore, painScore, vitalSigns, tags, attachments, categories } =
        data

      // Check if note exists and belongs to the tenant
      const [existingNote] = await db`
        SELECT * FROM clinical_notes 
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `

      if (!existingNote) {
        throw new Error("Clinical note not found")
      }

      // Update the clinical note
      const [updatedNote] = await db`
        UPDATE clinical_notes
        SET 
          note_type = ${noteType || existingNote.note_type},
          title = ${title || existingNote.title},
          content = ${content || existingNote.content},
          is_private = ${isPrivate !== undefined ? isPrivate : existingNote.is_private},
          mood_score = ${moodScore !== undefined ? moodScore : existingNote.mood_score},
          pain_score = ${painScore !== undefined ? painScore : existingNote.pain_score},
          vital_signs = ${vitalSigns ? JSON.stringify(vitalSigns) : existingNote.vital_signs},
          tags = ${tags || existingNote.tags},
          attachments = ${attachments ? JSON.stringify(attachments) : existingNote.attachments},
          updated_at = CURRENT_TIMESTAMP,
          updated_by = ${userId}
        WHERE id = ${id}
        RETURNING *
      `

      // If categories are provided, update the mappings
      if (categories && categories.length > 0) {
        // Delete existing mappings
        await db`
          DELETE FROM clinical_notes_category_mappings
          WHERE note_id = ${id}
        `

        // Add new mappings
        for (const categoryId of categories) {
          await db`
            INSERT INTO clinical_notes_category_mappings (note_id, category_id)
            VALUES (${id}, ${categoryId})
          `
        }
      }

      return updatedNote
    } catch (error) {
      console.error("Error in updateNote:", error)
      throw error
    }
  },

  async deleteNote(id: string, tenantId: string): Promise<void> {
    try {
      // Check if note exists and belongs to the tenant
      const [existingNote] = await db`
        SELECT * FROM clinical_notes 
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `

      if (!existingNote) {
        throw new Error("Clinical note not found")
      }

      // Delete the clinical note (category mappings will be deleted via CASCADE)
      await db`
        DELETE FROM clinical_notes
        WHERE id = ${id}
      `
    } catch (error) {
      console.error("Error in deleteNote:", error)
      throw error
    }
  },

  // Categories
  async getCategories(tenantId: string): Promise<ClinicalNoteCategory[]> {
    try {
      const categories = await db`
        SELECT * FROM clinical_notes_categories
        WHERE tenant_id = ${tenantId}
        ORDER BY name ASC
      `
      return categories
    } catch (error) {
      console.error("Error in getCategories:", error)
      throw error
    }
  },

  async createCategory(data: CreateCategoryInput, tenantId: string): Promise<ClinicalNoteCategory> {
    try {
      const { name, description, color } = data

      const [category] = await db`
        INSERT INTO clinical_notes_categories (tenant_id, name, description, color)
        VALUES (${tenantId}, ${name}, ${description || null}, ${color || null})
        RETURNING *
      `

      return category
    } catch (error) {
      console.error("Error in createCategory:", error)
      throw error
    }
  },

  async updateCategory(id: string, data: UpdateCategoryInput, tenantId: string): Promise<ClinicalNoteCategory> {
    try {
      const { name, description, color } = data

      // Check if category exists and belongs to the tenant
      const [existingCategory] = await db`
        SELECT * FROM clinical_notes_categories 
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `

      if (!existingCategory) {
        throw new Error("Category not found")
      }

      // Update the category
      const [updatedCategory] = await db`
        UPDATE clinical_notes_categories
        SET 
          name = ${name || existingCategory.name},
          description = ${description !== undefined ? description : existingCategory.description},
          color = ${color || existingCategory.color},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `

      return updatedCategory
    } catch (error) {
      console.error("Error in updateCategory:", error)
      throw error
    }
  },

  async deleteCategory(id: string, tenantId: string): Promise<void> {
    try {
      // Check if category exists and belongs to the tenant
      const [existingCategory] = await db`
        SELECT * FROM clinical_notes_categories 
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `

      if (!existingCategory) {
        throw new Error("Category not found")
      }

      // Delete the category
      await db`
        DELETE FROM clinical_notes_categories
        WHERE id = ${id}
      `
    } catch (error) {
      console.error("Error in deleteCategory:", error)
      throw error
    }
  },

  // Templates
  async getTemplates(tenantId: string, noteType?: string): Promise<ClinicalNoteTemplate[]> {
    try {
      let templates

      if (noteType) {
        templates = await db`
          SELECT * FROM clinical_notes_templates
          WHERE tenant_id = ${tenantId} AND note_type = ${noteType}
          ORDER BY name ASC
        `
      } else {
        templates = await db`
          SELECT * FROM clinical_notes_templates
          WHERE tenant_id = ${tenantId}
          ORDER BY name ASC
        `
      }

      return templates
    } catch (error) {
      console.error("Error in getTemplates:", error)
      throw error
    }
  },

  async getTemplateById(id: string, tenantId: string): Promise<ClinicalNoteTemplate | null> {
    try {
      const [template] = await db`
        SELECT * FROM clinical_notes_templates
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `
      return template || null
    } catch (error) {
      console.error("Error in getTemplateById:", error)
      throw error
    }
  },

  async createTemplate(data: CreateTemplateInput, userId: string, tenantId: string): Promise<ClinicalNoteTemplate> {
    try {
      const { name, content, noteType } = data

      const [template] = await db`
        INSERT INTO clinical_notes_templates (tenant_id, name, content, note_type, created_by)
        VALUES (${tenantId}, ${name}, ${content}, ${noteType}, ${userId})
        RETURNING *
      `

      return template
    } catch (error) {
      console.error("Error in createTemplate:", error)
      throw error
    }
  },

  async updateTemplate(id: string, data: UpdateTemplateInput, tenantId: string): Promise<ClinicalNoteTemplate> {
    try {
      const { name, content, noteType } = data

      // Check if template exists and belongs to the tenant
      const [existingTemplate] = await db`
        SELECT * FROM clinical_notes_templates 
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `

      if (!existingTemplate) {
        throw new Error("Template not found")
      }

      // Update the template
      const [updatedTemplate] = await db`
        UPDATE clinical_notes_templates
        SET 
          name = ${name || existingTemplate.name},
          content = ${content || existingTemplate.content},
          note_type = ${noteType || existingTemplate.note_type},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `

      return updatedTemplate
    } catch (error) {
      console.error("Error in updateTemplate:", error)
      throw error
    }
  },

  async deleteTemplate(id: string, tenantId: string): Promise<void> {
    try {
      // Check if template exists and belongs to the tenant
      const [existingTemplate] = await db`
        SELECT * FROM clinical_notes_templates 
        WHERE id = ${id} AND tenant_id = ${tenantId}
      `

      if (!existingTemplate) {
        throw new Error("Template not found")
      }

      // Delete the template
      await db`
        DELETE FROM clinical_notes_templates
        WHERE id = ${id}
      `
    } catch (error) {
      console.error("Error in deleteTemplate:", error)
      throw error
    }
  },
}
