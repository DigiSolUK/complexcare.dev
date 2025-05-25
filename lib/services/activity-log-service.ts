import { sql } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

interface ActivityLogParams {
  tenantId?: string
  activityType: string
  description: string
  userId?: string
  patientId?: string
  metadata?: Record<string, any>
}

export async function logActivity({
  tenantId = DEFAULT_TENANT_ID,
  activityType,
  description,
  userId,
  patientId,
  metadata,
}: ActivityLogParams): Promise<boolean> {
  try {
    await sql`
      INSERT INTO activity_logs (
        tenant_id,
        activity_type,
        description,
        user_id,
        patient_id,
        metadata,
        created_at
      ) VALUES (
        ${tenantId},
        ${activityType},
        ${description},
        ${userId || null},
        ${patientId || null},
        ${metadata ? JSON.stringify(metadata) : null},
        NOW()
      )
    `
    return true
  } catch (error) {
    console.error("Error logging activity:", error)
    return false
  }
}

export async function getActivityLogs({
  tenantId = DEFAULT_TENANT_ID,
  userId,
  patientId,
  activityType,
  startDate,
  endDate,
  limit = 50,
  offset = 0,
}: {
  tenantId?: string
  userId?: string
  patientId?: string
  activityType?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}): Promise<any[]> {
  try {
    let query = `
      SELECT * FROM activity_logs
      WHERE tenant_id = $1
    `

    const params: any[] = [tenantId]
    let paramIndex = 2

    if (userId) {
      query += ` AND user_id = $${paramIndex}`
      params.push(userId)
      paramIndex++
    }

    if (patientId) {
      query += ` AND patient_id = $${paramIndex}`
      params.push(patientId)
      paramIndex++
    }

    if (activityType) {
      query += ` AND activity_type = $${paramIndex}`
      params.push(activityType)
      paramIndex++
    }

    if (startDate) {
      query += ` AND created_at >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      query += ` AND created_at <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await sql.query(query, params)
    return result.rows || []
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    return []
  }
}

// Add the missing exports
export async function getPatientActivities(
  patientId: string,
  tenantId = DEFAULT_TENANT_ID,
  limit = 20,
  offset = 0,
): Promise<any[]> {
  try {
    const query = `
      SELECT 
        al.*,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        u.role as user_role
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.patient_id = $1
      AND al.tenant_id = $2
      ORDER BY al.created_at DESC
      LIMIT $3 OFFSET $4
    `

    const result = await sql.query(query, [patientId, tenantId, limit, offset])
    return result.rows || []
  } catch (error) {
    console.error("Error fetching patient activities:", error)
    return []
  }
}

export async function getRecentActivities(tenantId = DEFAULT_TENANT_ID, limit = 10): Promise<any[]> {
  try {
    const query = `
      SELECT 
        al.*,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN patients p ON al.patient_id = p.id
      WHERE al.tenant_id = $1
      ORDER BY al.created_at DESC
      LIMIT $2
    `

    const result = await sql.query(query, [tenantId, limit])
    return result.rows || []
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return []
  }
}
