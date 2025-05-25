import { neon } from "@neondatabase/serverless"
import { getCurrentTenant } from "@/lib/tenant-utils"
import { auth } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL || "")

export type ActivityType =
  | "patient_created"
  | "patient_updated"
  | "patient_viewed"
  | "appointment_created"
  | "appointment_updated"
  | "appointment_cancelled"
  | "care_plan_created"
  | "care_plan_updated"
  | "medication_added"
  | "medication_updated"
  | "clinical_note_created"
  | "clinical_note_updated"
  | "task_created"
  | "task_completed"
  | "document_uploaded"
  | "invoice_created"
  | "payment_received"
  | "visit"
  | "assessment"
  | "medication"

interface LogActivityParams {
  activityType: ActivityType
  description: string
  patientId?: string
  metadata?: Record<string, any>
}

export async function logActivity({ activityType, description, patientId, metadata }: LogActivityParams) {
  try {
    const session = await auth()
    const tenantId = await getCurrentTenant()

    if (!tenantId) {
      console.error("No tenant ID found for activity logging")
      return
    }

    await sql`
      INSERT INTO activity_logs (
        tenant_id,
        user_id,
        patient_id,
        activity_type,
        description,
        metadata
      ) VALUES (
        ${tenantId},
        ${session?.user?.id || null},
        ${patientId || null},
        ${activityType},
        ${description},
        ${metadata ? JSON.stringify(metadata) : null}::jsonb
      )
    `
  } catch (error) {
    console.error("Error logging activity:", error)
    // Don't throw - we don't want activity logging failures to break the app
  }
}

// Batch log multiple activities
export async function logActivities(activities: LogActivityParams[]) {
  try {
    const session = await auth()
    const tenantId = await getCurrentTenant()

    if (!tenantId) {
      console.error("No tenant ID found for activity logging")
      return
    }

    const values = activities.map((activity) => ({
      tenant_id: tenantId,
      user_id: session?.user?.id || null,
      patient_id: activity.patientId || null,
      activity_type: activity.activityType,
      description: activity.description,
      metadata: activity.metadata ? JSON.stringify(activity.metadata) : null,
    }))

    if (values.length === 0) return

    // Build the query dynamically
    const query = `
      INSERT INTO activity_logs (tenant_id, user_id, patient_id, activity_type, description, metadata)
      VALUES ${values.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6}::jsonb)`).join(", ")}
    `

    const params = values.flatMap((v) => [
      v.tenant_id,
      v.user_id,
      v.patient_id,
      v.activity_type,
      v.description,
      v.metadata,
    ])

    await sql(query, params)
  } catch (error) {
    console.error("Error logging activities:", error)
  }
}

// Get recent activities
export async function getRecentActivities(limit = 10) {
  try {
    const tenantId = await getCurrentTenant()

    if (!tenantId) {
      return []
    }

    const activities = await sql`
      SELECT 
        a.id,
        a.activity_type,
        a.description,
        a.created_at,
        a.metadata,
        a.patient_id,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE a.tenant_id = ${tenantId}
      ORDER BY a.created_at DESC
      LIMIT ${limit}
    `

    return activities
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return []
  }
}

// Get activities for a specific patient
export async function getPatientActivities(patientId: string, limit = 50) {
  try {
    const tenantId = await getCurrentTenant()

    if (!tenantId) {
      return []
    }

    const activities = await sql`
      SELECT 
        a.id,
        a.activity_type,
        a.description,
        a.created_at,
        a.metadata,
        CONCAT(u.first_name, ' ', u.last_name) as user_name
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 
        a.tenant_id = ${tenantId} AND
        a.patient_id = ${patientId}
      ORDER BY a.created_at DESC
      LIMIT ${limit}
    `

    return activities
  } catch (error) {
    console.error("Error fetching patient activities:", error)
    return []
  }
}
