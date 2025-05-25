import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export interface ActivityLogInput {
  tenantId: string
  activityType: string
  description: string
  patientId?: string
  userId?: string
  metadata?: Record<string, any>
}

export interface ActivityLog {
  id: string
  tenant_id: string
  user_id: string | null
  patient_id: string | null
  activity_type: string
  description: string
  created_at: string
  metadata: Record<string, any> | null
}

/**
 * Log a single activity
 */
export async function logActivity(input: ActivityLogInput): Promise<ActivityLog | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      INSERT INTO activity_logs (
        tenant_id,
        user_id,
        patient_id,
        activity_type,
        description,
        metadata
      ) VALUES (
        ${input.tenantId},
        ${input.userId || null},
        ${input.patientId || null},
        ${input.activityType},
        ${input.description},
        ${input.metadata ? JSON.stringify(input.metadata) : null}
      )
      RETURNING *
    `

    return result.length > 0 ? (result[0] as ActivityLog) : null
  } catch (error) {
    console.error("Error logging activity:", error)
    return null
  }
}

/**
 * Log multiple activities in batch
 */
export async function logActivities(inputs: ActivityLogInput[]): Promise<number> {
  if (inputs.length === 0) return 0

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Build values for bulk insert
    const values = inputs
      .map(
        (input) => `(
      '${input.tenantId}',
      ${input.userId ? `'${input.userId}'` : "NULL"},
      ${input.patientId ? `'${input.patientId}'` : "NULL"},
      '${input.activityType}',
      '${input.description.replace(/'/g, "''")}',
      ${input.metadata ? `'${JSON.stringify(input.metadata)}'` : "NULL"}
    )`,
      )
      .join(", ")

    const query = `
      INSERT INTO activity_logs (
        tenant_id,
        user_id,
        patient_id,
        activity_type,
        description,
        metadata
      ) VALUES ${values}
      RETURNING id
    `

    const result = await sql.query(query)
    return result.rows.length
  } catch (error) {
    console.error("Error logging activities in batch:", error)
    return 0
  }
}

/**
 * Get recent activities for a tenant
 */
export async function getRecentActivities(tenantId: string = DEFAULT_TENANT_ID, limit = 50): Promise<ActivityLog[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM activity_logs
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result as ActivityLog[]
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return []
  }
}

/**
 * Get activities for a specific patient
 */
export async function getPatientActivities(
  patientId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 100,
): Promise<ActivityLog[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM activity_logs
      WHERE tenant_id = ${tenantId}
      AND patient_id = ${patientId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result as ActivityLog[]
  } catch (error) {
    console.error(`Error fetching activities for patient ${patientId}:`, error)
    return []
  }
}

/**
 * Get activities by type
 */
export async function getActivitiesByType(
  activityType: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 50,
): Promise<ActivityLog[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM activity_logs
      WHERE tenant_id = ${tenantId}
      AND activity_type = ${activityType}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result as ActivityLog[]
  } catch (error) {
    console.error(`Error fetching activities of type ${activityType}:`, error)
    return []
  }
}

/**
 * Get activities by user
 */
export async function getUserActivities(
  userId: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 50,
): Promise<ActivityLog[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM activity_logs
      WHERE tenant_id = ${tenantId}
      AND user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result as ActivityLog[]
  } catch (error) {
    console.error(`Error fetching activities for user ${userId}:`, error)
    return []
  }
}

/**
 * Get activity statistics
 */
export async function getActivityStatistics(tenantId: string = DEFAULT_TENANT_ID): Promise<{
  totalActivities: number
  todayActivities: number
  activePatients: number
  activeUsers: number
}> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get total activities
    const [totalResult] = await sql`
      SELECT COUNT(*) as count FROM activity_logs
      WHERE tenant_id = ${tenantId}
    `

    // Get today's activities
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todayResult] = await sql`
      SELECT COUNT(*) as count FROM activity_logs
      WHERE tenant_id = ${tenantId}
      AND created_at >= ${today.toISOString()}
    `

    // Get active patients (patients with activities in the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [patientsResult] = await sql`
      SELECT COUNT(DISTINCT patient_id) as count FROM activity_logs
      WHERE tenant_id = ${tenantId}
      AND patient_id IS NOT NULL
      AND created_at >= ${thirtyDaysAgo.toISOString()}
    `

    // Get active users (users who logged activities in the last 30 days)
    const [usersResult] = await sql`
      SELECT COUNT(DISTINCT user_id) as count FROM activity_logs
      WHERE tenant_id = ${tenantId}
      AND user_id IS NOT NULL
      AND created_at >= ${thirtyDaysAgo.toISOString()}
    `

    return {
      totalActivities: Number.parseInt(totalResult.count),
      todayActivities: Number.parseInt(todayResult.count),
      activePatients: Number.parseInt(patientsResult.count),
      activeUsers: Number.parseInt(usersResult.count),
    }
  } catch (error) {
    console.error("Error fetching activity statistics:", error)
    return {
      totalActivities: 0,
      todayActivities: 0,
      activePatients: 0,
      activeUsers: 0,
    }
  }
}

/**
 * Search activities
 */
export async function searchActivities(
  searchTerm: string,
  tenantId: string = DEFAULT_TENANT_ID,
  limit = 50,
): Promise<ActivityLog[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM activity_logs
      WHERE tenant_id = ${tenantId}
      AND (
        description ILIKE ${`%${searchTerm}%`}
        OR activity_type ILIKE ${`%${searchTerm}%`}
        OR metadata::text ILIKE ${`%${searchTerm}%`}
      )
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result as ActivityLog[]
  } catch (error) {
    console.error(`Error searching activities for "${searchTerm}":`, error)
    return []
  }
}

/**
 * Get activity counts by type
 */
export async function getActivityCountsByType(tenantId: string = DEFAULT_TENANT_ID): Promise<Record<string, number>> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT activity_type, COUNT(*) as count
      FROM activity_logs
      WHERE tenant_id = ${tenantId}
      GROUP BY activity_type
      ORDER BY count DESC
    `

    const countsByType: Record<string, number> = {}
    for (const row of result) {
      countsByType[row.activity_type] = Number.parseInt(row.count)
    }

    return countsByType
  } catch (error) {
    console.error("Error fetching activity counts by type:", error)
    return {}
  }
}
