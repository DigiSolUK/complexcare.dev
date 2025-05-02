import { neon } from "@neondatabase/serverless"

interface ErrorLogEntry {
  id?: string
  message: string
  stack?: string
  componentPath?: string
  severity?: "low" | "medium" | "high" | "critical"
  tenant_id?: string
  user_id?: string
  additional_data?: Record<string, any>
}

/**
 * Log an error to the database
 */
export async function logError(error: ErrorLogEntry) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const severity = error.severity || "medium"
    const timestamp = new Date()
    const tenant_id = error.tenant_id || null
    const user_id = error.user_id || null
    const additional_data = error.additional_data ? JSON.stringify(error.additional_data) : null

    await sql`
      INSERT INTO error_logs (
        message, stack, component_path, severity, 
        tenant_id, user_id, additional_data, created_at
      )
      VALUES (
        ${error.message}, ${error.stack}, ${error.componentPath}, ${severity},
        ${tenant_id}, ${user_id}, ${additional_data}, ${timestamp}
      )
    `

    return { id: error.id, success: true }
  } catch (dbError) {
    console.error("Failed to log error to database:", dbError)
    // Fall back to console logging
    console.error("Original error:", error.message, error.stack)
    return { id: null, success: false }
  }
}

/**
 * Get all errors from the database
 */
export async function getErrors(
  options: {
    tenant_id?: string
    limit?: number
    offset?: number
    severity?: string
    resolved?: boolean
  } = {},
) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const limit = options.limit || 100
    const offset = options.offset || 0

    let query = `
      SELECT * FROM error_logs 
      WHERE 1=1
    `

    const params: any[] = []

    if (options.tenant_id) {
      query += ` AND tenant_id = $${params.length + 1}`
      params.push(options.tenant_id)
    }

    if (options.severity) {
      query += ` AND severity = $${params.length + 1}`
      params.push(options.severity)
    }

    if (options.resolved !== undefined) {
      query += ` AND resolved = $${params.length + 1}`
      params.push(options.resolved)
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await sql.query(query, params)

    return { errors: result.rows, success: true }
  } catch (error) {
    console.error("Failed to fetch errors:", error)
    return { errors: [], success: false, error: String(error) }
  }
}

/**
 * Mark an error as resolved
 */
export async function markErrorAsResolved(errorId: string, resolvedBy?: string, resolution?: string) {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const timestamp = new Date()

    await sql`
      UPDATE error_logs
      SET 
        resolved = true,
        resolved_at = ${timestamp},
        resolved_by = ${resolvedBy || null},
        resolution = ${resolution || null}
      WHERE id = ${errorId}
    `

    return { success: true }
  } catch (error) {
    console.error("Failed to mark error as resolved:", error)
    return { success: false, error: String(error) }
  }
}

export async function captureException(error: any, context?: Record<string, any>) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  return logError({
    message: errorMessage,
    stack: errorStack,
    additional_data: context,
  })
}
