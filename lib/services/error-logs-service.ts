import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import type { ErrorSeverity, ErrorCategory } from "./error-logging-service"

export interface ErrorLogFilters {
  severity?: ErrorSeverity
  category?: ErrorCategory
  resolved?: boolean
  search?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export interface ErrorLog {
  id: string
  tenant_id: string
  error_message: string
  error_stack?: string
  severity: ErrorSeverity
  category: ErrorCategory
  user_id?: string
  session_id?: string
  url?: string
  user_agent?: string
  metadata?: Record<string, any>
  resolved: boolean
  resolved_by?: string
  resolved_at?: string
  created_at: string
  updated_at: string
}

export async function getErrorLogs(
  tenantId: string = DEFAULT_TENANT_ID,
  filters: ErrorLogFilters = {},
): Promise<{ logs: ErrorLog[]; total: number }> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const { severity, category, resolved, search, startDate, endDate, limit = 50, offset = 0 } = filters

    // Build the query
    const whereConditions = [`tenant_id = $1`]
    const params: any[] = [tenantId]
    let paramIndex = 2

    if (severity) {
      whereConditions.push(`severity = $${paramIndex++}`)
      params.push(severity)
    }

    if (category) {
      whereConditions.push(`category = $${paramIndex++}`)
      params.push(category)
    }

    if (resolved !== undefined) {
      whereConditions.push(`resolved = $${paramIndex++}`)
      params.push(resolved)
    }

    if (search) {
      whereConditions.push(`(error_message ILIKE $${paramIndex} OR metadata::text ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (startDate) {
      whereConditions.push(`created_at >= $${paramIndex++}`)
      params.push(startDate)
    }

    if (endDate) {
      whereConditions.push(`created_at <= $${paramIndex++}`)
      params.push(endDate)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM error_logs
      ${whereClause}
    `

    const countResult = await sql.query(countQuery, params)
    const total = Number.parseInt(countResult.rows[0]?.total || "0")

    // Get paginated results
    const query = `
      SELECT *
      FROM error_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `

    params.push(limit, offset)
    const result = await sql.query(query, params)

    return {
      logs: result.rows as ErrorLog[],
      total,
    }
  } catch (error) {
    console.error("Failed to get error logs:", error)
    return { logs: [], total: 0 }
  }
}

export async function getErrorLogById(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<ErrorLog | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT * FROM error_logs
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    return (result[0] as ErrorLog) || null
  } catch (error) {
    console.error("Failed to get error log by ID:", error)
    return null
  }
}

export async function resolveErrorLog(
  id: string,
  resolvedBy: string,
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      UPDATE error_logs
      SET 
        resolved = true,
        resolved_by = ${resolvedBy},
        resolved_at = NOW(),
        updated_at = NOW()
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `

    return true
  } catch (error) {
    console.error("Failed to resolve error log:", error)
    return false
  }
}

export async function getErrorStats(tenantId: string = DEFAULT_TENANT_ID): Promise<{
  total: number
  unresolved: number
  critical: number
  bySeverity: Record<string, number>
  byCategory: Record<string, number>
  recentTrend: { date: string; count: number }[]
}> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get total count
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM error_logs
      WHERE tenant_id = ${tenantId}
    `

    // Get unresolved count
    const unresolvedResult = await sql`
      SELECT COUNT(*) as count FROM error_logs
      WHERE tenant_id = ${tenantId} AND resolved = false
    `

    // Get critical count
    const criticalResult = await sql`
      SELECT COUNT(*) as count FROM error_logs
      WHERE tenant_id = ${tenantId} AND severity = 'critical' AND resolved = false
    `

    // Get counts by severity
    const severityResult = await sql`
      SELECT severity, COUNT(*) as count FROM error_logs
      WHERE tenant_id = ${tenantId}
      GROUP BY severity
    `

    // Get counts by category
    const categoryResult = await sql`
      SELECT category, COUNT(*) as count FROM error_logs
      WHERE tenant_id = ${tenantId}
      GROUP BY category
    `

    // Get recent trend (last 7 days)
    const trendResult = await sql`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM error_logs
      WHERE tenant_id = ${tenantId} AND created_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    // Format results
    const bySeverity: Record<string, number> = {}
    severityResult.forEach((row: any) => {
      bySeverity[row.severity] = Number.parseInt(row.count)
    })

    const byCategory: Record<string, number> = {}
    categoryResult.forEach((row: any) => {
      byCategory[row.category] = Number.parseInt(row.count)
    })

    const recentTrend = trendResult.map((row: any) => ({
      date: row.date,
      count: Number.parseInt(row.count),
    }))

    return {
      total: Number.parseInt(totalResult[0]?.total || "0"),
      unresolved: Number.parseInt(unresolvedResult[0]?.count || "0"),
      critical: Number.parseInt(criticalResult[0]?.count || "0"),
      bySeverity,
      byCategory,
      recentTrend,
    }
  } catch (error) {
    console.error("Failed to get error stats:", error)
    return {
      total: 0,
      unresolved: 0,
      critical: 0,
      bySeverity: {},
      byCategory: {},
      recentTrend: [],
    }
  }
}
