import { db } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export interface CarePlanTemplate {
  id: string
  tenant_id: string
  name: string
  description: string
  category: string
  condition: string
  goals: string[]
  interventions: string[]
  assessments: string[]
  duration_days: number
  review_frequency_days: number
  created_by: string
  created_at: string
  updated_at: string
  is_active: boolean
  usage_count: number
}

export class CarePlanTemplateService {
  /**
   * Get all care plan templates
   */
  static async getTemplates(tenantId: string = DEFAULT_TENANT_ID) {
    try {
      const result = await db.query(
        `SELECT cpt.*, u.first_name || ' ' || u.last_name as created_by_name
         FROM care_plan_templates cpt
         LEFT JOIN users u ON cpt.created_by = u.id
         WHERE cpt.tenant_id = $1 AND cpt.is_active = true
         ORDER BY cpt.category, cpt.name`,
        [tenantId],
      )

      return result.rows
    } catch (error) {
      console.error("Error fetching care plan templates:", error)
      return []
    }
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(id: string, tenantId: string = DEFAULT_TENANT_ID) {
    try {
      const result = await db.query(
        `SELECT * FROM care_plan_templates
         WHERE id = $1 AND tenant_id = $2`,
        [id, tenantId],
      )

      return result.rows[0]
    } catch (error) {
      console.error("Error fetching care plan template:", error)
      return null
    }
  }

  /**
   * Create a new care plan template
   */
  static async createTemplate(data: Partial<CarePlanTemplate>, userId: string, tenantId: string = DEFAULT_TENANT_ID) {
    try {
      const result = await db.query(
        `INSERT INTO care_plan_templates 
         (tenant_id, name, description, category, condition, goals, interventions, 
          assessments, duration_days, review_frequency_days, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          tenantId,
          data.name,
          data.description,
          data.category,
          data.condition,
          data.goals || [],
          data.interventions || [],
          data.assessments || [],
          data.duration_days || 90,
          data.review_frequency_days || 30,
          userId,
        ],
      )

      return result.rows[0]
    } catch (error) {
      console.error("Error creating care plan template:", error)
      throw error
    }
  }

  /**
   * Create care plan from template
   */
  static async createFromTemplate(
    templateId: string,
    patientId: string,
    userId: string,
    tenantId: string = DEFAULT_TENANT_ID,
  ) {
    try {
      // Get the template
      const template = await this.getTemplateById(templateId, tenantId)
      if (!template) {
        throw new Error("Template not found")
      }

      // Calculate dates
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + template.duration_days)

      const reviewDate = new Date()
      reviewDate.setDate(reviewDate.getDate() + template.review_frequency_days)

      // Create the care plan
      const result = await db.query(
        `INSERT INTO care_plans 
         (tenant_id, patient_id, title, description, status, start_date, end_date, 
          review_date, goals, interventions, created_by, template_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          tenantId,
          patientId,
          template.name,
          template.description,
          "active",
          startDate,
          endDate,
          reviewDate,
          template.goals,
          template.interventions,
          userId,
          templateId,
        ],
      )

      // Increment template usage count
      await db.query(
        `UPDATE care_plan_templates 
         SET usage_count = usage_count + 1 
         WHERE id = $1`,
        [templateId],
      )

      return result.rows[0]
    } catch (error) {
      console.error("Error creating care plan from template:", error)
      throw error
    }
  }

  /**
   * Get popular templates
   */
  static async getPopularTemplates(limit = 5, tenantId: string = DEFAULT_TENANT_ID) {
    try {
      const result = await db.query(
        `SELECT * FROM care_plan_templates
         WHERE tenant_id = $1 AND is_active = true
         ORDER BY usage_count DESC
         LIMIT $2`,
        [tenantId, limit],
      )

      return result.rows
    } catch (error) {
      console.error("Error fetching popular templates:", error)
      return []
    }
  }
}
