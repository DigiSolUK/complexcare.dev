import { neon } from "@neondatabase/serverless"

const DEFAULT_TENANT_ID = "default"

export async function logError(
  tenantId: string = DEFAULT_TENANT_ID,
  message: string,
  stack: string | null,
  severity: "critical" | "high" | "medium" | "low",
  metadata: any,
): Promise<void> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      INSERT INTO error_logs (tenant_id, message, stack, severity, metadata)
      VALUES (${tenantId}, ${message}, ${stack}, ${severity}, ${metadata})
    `
  } catch (error) {
    console.error("Error logging error:", error)
  }
}

/**
 * Alias for logError to satisfy imports looking for `captureException`.
 */
export const captureException = logError

export async function getErrorLogs(
  tenantId: string = DEFAULT_TENANT_ID,
  filters?: {
    severity?: string
    status?: string
    startDate?: Date
    endDate?: Date
  },
): Promise<{ errors: any[]; stats: any }> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    let query = `
      SELECT * FROM error_logs
      WHERE tenant_id = $1
    `
    const params: any[] = [tenantId]
    let paramIndex = 2

    if (filters?.severity && filters.severity !== "all") {
      query += ` AND severity = $${paramIndex++}`
      params.push(filters.severity)
    }

    if (filters?.status && filters.status !== "all") {
      query += ` AND status = $${paramIndex++}`
      params.push(filters.status)
    }

    if (filters?.startDate) {
      query += ` AND created_at >= $${paramIndex++}`
      params.push(filters.startDate)
    }

    if (filters?.endDate) {
      query += ` AND created_at <= $${paramIndex++}`
      params.push(filters.endDate)
    }

    query += ` ORDER BY created_at DESC LIMIT 100`

    const errorsResult = await sql.query(query, params)
    const errors = errorsResult.rows

    // Get stats
    const statsResult = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new,
        COUNT(CASE WHEN status = 'investigating' THEN 1 END) as investigating,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high,
        COUNT(CASE WHEN severity = 'medium' THEN 1 END) as low
      FROM error_logs
      WHERE tenant_id = ${tenantId}
      AND created_at >= NOW() - INTERVAL '30 days'
    `
    const stats = statsResult[0]

    return {
      errors,
      stats,
    }
  } catch (error) {
    console.error("Error fetching error logs:", error)
    return { errors: [], stats: {} }
  }
}

export async function resolveError(
  errorId: string,
  resolvedBy: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      UPDATE error_logs
      SET 
        status = 'resolved',
        resolved_at = NOW(),
        resolved_by = ${resolvedBy}
      WHERE id = ${errorId}
      AND tenant_id = ${tenantId}
    `

    return result.rowCount > 0
  } catch (error) {
    console.error("Error resolving error log:", error)
    return false
  }
}

export async function updateErrorStatus(
  errorId: string,
  status: "new" | "investigating" | "resolved",
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      UPDATE error_logs
      SET 
        status = ${status},
        updated_at = NOW()
      WHERE id = ${errorId}
      AND tenant_id = ${tenantId}
    `

    return result.rowCount > 0
  } catch (error) {
    console.error("Error updating error status:", error)
    return false
  }
}
