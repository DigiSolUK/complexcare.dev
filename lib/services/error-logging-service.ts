// Enhanced error logging service for ComplexCare CRM
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ErrorCategory {
  AUTHENTICATION = "authentication",
  DATABASE = "database",
  API = "api",
  UI = "ui",
  INTEGRATION = "integration",
  VALIDATION = "validation",
  SYSTEM = "system",
  NETWORK = "network",
  SECURITY = "security",
  PERFORMANCE = "performance",
  BUSINESS_LOGIC = "business_logic",
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
  component?: string
  action?: string
  metadata?: Record<string, any>
  resolved: boolean
  resolved_by?: string
  resolved_at?: string
  created_at: string
  updated_at: string
  browser_info?: string
  device_info?: string
  os_info?: string
  app_version?: string
  environment?: string
}

// Get browser and device information
function getBrowserInfo(): Record<string, any> {
  if (typeof window === "undefined") return {}

  return {
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    platform: window.navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    cookiesEnabled: window.navigator.cookieEnabled,
    doNotTrack: window.navigator.doNotTrack,
    online: window.navigator.onLine,
    url: window.location.href,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
  }
}

// Enhanced error logging with more context
export async function logError(
  error: Error | string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  category: ErrorCategory = ErrorCategory.SYSTEM,
  metadata: Record<string, any> = {},
  tenantId: string = DEFAULT_TENANT_ID,
  userId?: string,
  component?: string,
  action?: string,
): Promise<string | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const errorMessage = typeof error === "string" ? error : error.message
    const errorStack = typeof error === "string" ? undefined : error.stack

    // Get browser and environment information
    const browserInfo = typeof window !== "undefined" ? getBrowserInfo() : {}
    const environment = process.env.NODE_ENV || "development"
    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "unknown"

    // Combine all metadata
    const enhancedMetadata = {
      ...metadata,
      browserInfo,
      environment,
      appVersion,
      timestamp: new Date().toISOString(),
    }

    const result = await sql`
      INSERT INTO error_logs (
        tenant_id,
        error_message,
        error_stack,
        severity,
        category,
        user_id,
        component,
        action,
        url,
        user_agent,
        browser_info,
        device_info,
        os_info,
        app_version,
        environment,
        metadata,
        resolved
      ) VALUES (
        ${tenantId},
        ${errorMessage},
        ${errorStack || null},
        ${severity},
        ${category},
        ${userId || null},
        ${component || null},
        ${action || null},
        ${browserInfo.url || null},
        ${browserInfo.userAgent || null},
        ${JSON.stringify(browserInfo) || null},
        ${browserInfo.platform || null},
        ${browserInfo.platform || null},
        ${appVersion},
        ${environment},
        ${JSON.stringify(enhancedMetadata)},
        false
      )
      RETURNING id
    `

    return result[0]?.id || null
  } catch (err) {
    console.error("Failed to log error to database:", err)

    // Fallback logging to console with structured data
    console.error("Error details:", {
      message: typeof error === "string" ? error : error.message,
      stack: typeof error === "string" ? undefined : error.stack,
      severity,
      category,
      tenantId,
      userId,
      component,
      action,
      metadata,
      timestamp: new Date().toISOString(),
    })

    return null
  }
}

// Enhanced error retrieval with filtering and pagination
export async function getErrors(
  tenantId: string = DEFAULT_TENANT_ID,
  filters: {
    severity?: ErrorSeverity
    category?: ErrorCategory
    resolved?: boolean
    userId?: string
    component?: string
    action?: string
    startDate?: Date
    endDate?: Date
    search?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortDirection?: "asc" | "desc"
  } = {},
): Promise<{ errors: ErrorLog[]; total: number }> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const {
      severity,
      category,
      resolved,
      userId,
      component,
      action,
      startDate,
      endDate,
      search,
      limit = 50,
      offset = 0,
      sortBy = "created_at",
      sortDirection = "desc",
    } = filters

    // Build the query dynamically
    const whereConditions = ["tenant_id = $1"]
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

    if (userId) {
      whereConditions.push(`user_id = $${paramIndex++}`)
      params.push(userId)
    }

    if (component) {
      whereConditions.push(`component = $${paramIndex++}`)
      params.push(component)
    }

    if (action) {
      whereConditions.push(`action = $${paramIndex++}`)
      params.push(action)
    }

    if (startDate) {
      whereConditions.push(`created_at >= $${paramIndex++}`)
      params.push(startDate)
    }

    if (endDate) {
      whereConditions.push(`created_at <= $${paramIndex++}`)
      params.push(endDate)
    }

    if (search) {
      whereConditions.push(`(error_message ILIKE $${paramIndex} OR error_stack ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    // Construct the WHERE clause
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM error_logs
      ${whereClause}
    `

    const countResult = await sql.query(countQuery, params)
    const total = Number.parseInt(countResult.rows[0].total, 10)

    // Get the actual data with sorting and pagination
    const dataQuery = `
      SELECT * FROM error_logs
      ${whereClause}
      ORDER BY ${sortBy} ${sortDirection === "asc" ? "ASC" : "DESC"}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `

    params.push(limit, offset)
    const dataResult = await sql.query(dataQuery, params)

    return {
      errors: dataResult.rows as ErrorLog[],
      total,
    }
  } catch (error) {
    console.error("Failed to get errors:", error)
    return { errors: [], total: 0 }
  }
}

// Enhanced error resolution with notes and assignee
export async function markErrorAsResolved(
  errorId: string,
  resolvedBy: string,
  tenantId: string = DEFAULT_TENANT_ID,
  resolutionNotes?: string,
): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      UPDATE error_logs
      SET 
        resolved = true,
        resolved_by = ${resolvedBy},
        resolved_at = NOW(),
        updated_at = NOW(),
        metadata = jsonb_set(
          COALESCE(metadata, '{}'::jsonb),
          '{resolutionNotes}',
          ${resolutionNotes ? JSON.stringify(resolutionNotes) : "null"}::jsonb
        )
      WHERE id = ${errorId}
      AND tenant_id = ${tenantId}
    `

    return true
  } catch (error) {
    console.error("Failed to mark error as resolved:", error)
    return false
  }
}

// Enhanced exception capture with more context
export function captureException(error: unknown, context: Record<string, any> = {}): void {
  console.error("Error captured:", error)

  // Extract more context information
  const {
    userId,
    tenantId = DEFAULT_TENANT_ID,
    component,
    action,
    severity = ErrorSeverity.HIGH,
    category = ErrorCategory.SYSTEM,
    ...otherContext
  } = context

  // Log to our error logging service
  if (error instanceof Error) {
    logError(
      error,
      severity as ErrorSeverity,
      category as ErrorCategory,
      otherContext,
      tenantId,
      userId,
      component,
      action,
    )
  } else {
    logError(
      String(error),
      severity as ErrorSeverity,
      category as ErrorCategory,
      otherContext,
      tenantId,
      userId,
      component,
      action,
    )
  }
}

// Enhanced message capture with structured data
export function captureMessage(
  message: string,
  severity: ErrorSeverity = ErrorSeverity.LOW,
  category: ErrorCategory = ErrorCategory.SYSTEM,
  context: Record<string, any> = {},
): void {
  console.warn("Message captured:", message)

  // Extract more context information
  const { userId, tenantId = DEFAULT_TENANT_ID, component, action, ...otherContext } = context

  // Log to our error logging service
  logError(message, severity, category, otherContext, tenantId, userId, component, action)
}

// Get error statistics for dashboard
export async function getErrorStatistics(
  tenantId: string = DEFAULT_TENANT_ID,
  days = 30,
): Promise<Record<string, any>> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get count by severity
    const severityStats = await sql`
      SELECT severity, COUNT(*) as count
      FROM error_logs
      WHERE tenant_id = ${tenantId}
      AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY severity
      ORDER BY 
        CASE 
          WHEN severity = 'critical' THEN 1
          WHEN severity = 'high' THEN 2
          WHEN severity = 'medium' THEN 3
          WHEN severity = 'low' THEN 4
          ELSE 5
        END
    `

    // Get count by category
    const categoryStats = await sql`
      SELECT category, COUNT(*) as count
      FROM error_logs
      WHERE tenant_id = ${tenantId}
      AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY category
      ORDER BY count DESC
    `

    // Get daily error counts
    const dailyStats = await sql`
      SELECT 
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as count
      FROM error_logs
      WHERE tenant_id = ${tenantId}
      AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY day
    `

    // Get resolution stats
    const resolutionStats = await sql`
      SELECT 
        resolved,
        COUNT(*) as count
      FROM error_logs
      WHERE tenant_id = ${tenantId}
      AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY resolved
    `

    // Get most common errors
    const commonErrors = await sql`
      SELECT 
        error_message,
        COUNT(*) as count
      FROM error_logs
      WHERE tenant_id = ${tenantId}
      AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY error_message
      ORDER BY count DESC
      LIMIT 10
    `

    return {
      bySeverity: severityStats.rows,
      byCategory: categoryStats.rows,
      daily: dailyStats.rows,
      resolution: resolutionStats.rows,
      commonErrors: commonErrors.rows,
      totalErrors: dailyStats.rows.reduce((sum, row) => sum + Number.parseInt(row.count, 10), 0),
      unresolvedErrors: resolutionStats.rows.find((row) => !row.resolved)?.count || 0,
    }
  } catch (error) {
    console.error("Failed to get error statistics:", error)
    return {
      bySeverity: [],
      byCategory: [],
      daily: [],
      resolution: [],
      commonErrors: [],
      totalErrors: 0,
      unresolvedErrors: 0,
    }
  }
}
