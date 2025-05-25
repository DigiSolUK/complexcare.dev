import { executeQuery, insert, update, getById } from "@/lib/db"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

interface ErrorLogData {
  message: string
  stack?: string
  context?: Record<string, any>
  source?: string
  severity?: "low" | "medium" | "high" | "critical"
  user_id?: string
}

export async function logError(data: ErrorLogData, tenantId = DEFAULT_TENANT_ID) {
  try {
    // Ensure error_logs table exists
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS error_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL,
        message TEXT NOT NULL,
        stack TEXT,
        context JSONB,
        source VARCHAR(255),
        severity VARCHAR(50) DEFAULT 'medium',
        is_resolved BOOLEAN DEFAULT FALSE,
        resolved_at TIMESTAMP WITH TIME ZONE,
        resolved_by UUID,
        resolution_notes TEXT,
        user_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert the error log
    const errorLog = await insert("error_logs", {
      tenant_id: tenantId,
      message: data.message,
      stack: data.stack || null,
      context: data.context ? JSON.stringify(data.context) : null,
      source: data.source || "application",
      severity: data.severity || "medium",
      user_id: data.user_id || null,
    })

    return errorLog
  } catch (error) {
    console.error("Failed to log error:", error)
    // Fallback to console logging if database logging fails
    console.error("Original error:", data.message, data.stack)
    return null
  }
}

export async function getErrors(
  filters: {
    is_resolved?: boolean
    severity?: string
    source?: string
    from_date?: Date
    to_date?: Date
  } = {},
  tenantId = DEFAULT_TENANT_ID,
) {
  try {
    let query = `
      SELECT * FROM error_logs
      WHERE tenant_id = $1
    `
    const params: any[] = [tenantId]
    let paramIndex = 2

    if (filters.is_resolved !== undefined) {
      query += ` AND is_resolved = $${paramIndex}`
      params.push(filters.is_resolved)
      paramIndex++
    }

    if (filters.severity) {
      query += ` AND severity = $${paramIndex}`
      params.push(filters.severity)
      paramIndex++
    }

    if (filters.source) {
      query += ` AND source = $${paramIndex}`
      params.push(filters.source)
      paramIndex++
    }

    if (filters.from_date) {
      query += ` AND created_at >= $${paramIndex}`
      params.push(filters.from_date)
      paramIndex++
    }

    if (filters.to_date) {
      query += ` AND created_at <= $${paramIndex}`
      params.push(filters.to_date)
      paramIndex++
    }

    query += ` ORDER BY created_at DESC`

    const errors = await executeQuery(query, params)
    return errors
  } catch (error) {
    console.error("Failed to get errors:", error)
    return []
  }
}

export async function markErrorAsResolved(
  errorId: string,
  resolutionData: {
    resolved_by: string
    resolution_notes?: string
  },
  tenantId = DEFAULT_TENANT_ID,
) {
  try {
    const error = await getById("error_logs", errorId, tenantId)

    if (!error) {
      throw new Error(`Error log with ID ${errorId} not found`)
    }

    const updatedError = await update(
      "error_logs",
      errorId,
      {
        is_resolved: true,
        resolved_at: new Date(),
        resolved_by: resolutionData.resolved_by,
        resolution_notes: resolutionData.resolution_notes || null,
      },
      tenantId,
    )

    return updatedError
  } catch (error) {
    console.error("Failed to mark error as resolved:", error)
    return null
  }
}

// This is a simple error logging service that can be expanded later
// to integrate with services like Sentry, LogRocket, etc.

interface ErrorContext {
  [key: string]: any
}

export function captureException(error: unknown, context: ErrorContext = {}): void {
  console.error("Error captured:", error)
  console.error("Context:", context)

  // Log to database if possible
  try {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    logError({
      message: errorMessage,
      stack: errorStack,
      context,
      source: context.source || "application",
      severity: context.severity || "medium",
      user_id: context.userId,
    }).catch((err) => console.error("Failed to log error to database:", err))
  } catch (loggingError) {
    console.error("Error during error logging:", loggingError)
  }
}

export function captureMessage(message: string, context: ErrorContext = {}): void {
  console.warn("Message captured:", message)
  console.warn("Context:", context)

  // Log to database if possible
  try {
    logError({
      message,
      context,
      source: context.source || "application",
      severity: context.severity || "low",
      user_id: context.userId,
    }).catch((err) => console.error("Failed to log message to database:", err))
  } catch (loggingError) {
    console.error("Error during message logging:", loggingError)
  }
}
