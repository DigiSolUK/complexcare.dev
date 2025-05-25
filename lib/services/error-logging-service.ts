// Error logging service for ComplexCare CRM
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

export async function logError(
  error: Error | string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  category: ErrorCategory = ErrorCategory.SYSTEM,
  metadata: Record<string, any> = {},
  tenantId: string = DEFAULT_TENANT_ID,
): Promise<string | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const errorMessage = typeof error === "string" ? error : error.message
    const errorStack = typeof error === "string" ? undefined : error.stack

    const result = await sql`
      INSERT INTO error_logs (
        tenant_id,
        error_message,
        error_stack,
        severity,
        category,
        metadata,
        resolved
      ) VALUES (
        ${tenantId},
        ${errorMessage},
        ${errorStack || null},
        ${severity},
        ${category},
        ${JSON.stringify(metadata)},
        false
      )
      RETURNING id
    `

    return result[0]?.id || null
  } catch (err) {
    console.error("Failed to log error:", err)
    return null
  }
}

export async function getErrors(
  tenantId: string = DEFAULT_TENANT_ID,
  filters: {
    severity?: ErrorSeverity
    category?: ErrorCategory
    resolved?: boolean
    limit?: number
    offset?: number
  } = {},
): Promise<ErrorLog[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const { severity, category, resolved, limit = 50, offset = 0 } = filters

    let query = `
      SELECT * FROM error_logs
      WHERE tenant_id = $1
    `
    const params: any[] = [tenantId]
    let paramIndex = 2

    if (severity) {
      query += ` AND severity = $${paramIndex++}`
      params.push(severity)
    }

    if (category) {
      query += ` AND category = $${paramIndex++}`
      params.push(category)
    }

    if (resolved !== undefined) {
      query += ` AND resolved = $${paramIndex++}`
      params.push(resolved)
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(limit, offset)

    const result = await sql.query(query, params)
    return result.rows as ErrorLog[]
  } catch (error) {
    console.error("Failed to get errors:", error)
    return []
  }
}

export async function markErrorAsResolved(
  errorId: string,
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
      WHERE id = ${errorId}
      AND tenant_id = ${tenantId}
    `

    return true
  } catch (error) {
    console.error("Failed to mark error as resolved:", error)
    return false
  }
}

export function captureException(error: unknown, context: Record<string, any> = {}): void {
  console.error("Error captured:", error)
  console.error("Context:", context)

  // Log to our error logging service
  if (error instanceof Error) {
    logError(error, ErrorSeverity.HIGH, ErrorCategory.SYSTEM, context)
  } else {
    logError(String(error), ErrorSeverity.HIGH, ErrorCategory.SYSTEM, context)
  }
}

export function captureMessage(message: string, context: Record<string, any> = {}): void {
  console.warn("Message captured:", message)
  console.warn("Context:", context)

  // Log to our error logging service
  logError(message, ErrorSeverity.LOW, ErrorCategory.SYSTEM, context)
}
