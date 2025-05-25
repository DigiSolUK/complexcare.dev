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
