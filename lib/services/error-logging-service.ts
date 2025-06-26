import { neon } from "@neondatabase/serverless"
import { getSession } from "@/lib/auth"
import { validate as uuidValidate, version as uuidVersion } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

export interface ErrorLogData {
  id: string
  tenant_id: string
  message: string
  stack?: string
  componentPath?: string
  url?: string
  method?: string
  statusCode?: number
  requestData?: any
  browserInfo?: any
  severity?: "low" | "medium" | "high" | "critical"
}

function isValidUUID(uuid: string) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4
}

export async function logError(errorData: ErrorLogData) {
  try {
    // Get current user and tenant information
    const session = await getSession()
    let tenantId = session?.user?.tenantId || process.env.DEFAULT_TENANT_ID

    // Ensure tenantId is not null or undefined
    if (!tenantId) {
      console.warn("Tenant ID is missing, using default tenant ID")
      tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Use the default tenant ID
    }

    let userId = session?.user?.id

    // Validate tenantId
    if (tenantId && !isValidUUID(tenantId)) {
      console.warn("Invalid tenant ID provided. Skipping tenant ID in error logging.")
      tenantId = "ba367cfe-6de0-4180-9566-1002b75cf82c" // Or use a default valid UUID if appropriate
    }

    // Validate userId
    if (userId && !isValidUUID(userId)) {
      console.warn("Invalid user ID provided. Skipping user ID in error logging.")
      userId = null // Set userId to null if it's not a valid UUID
    }

    // Insert error into database
    const result = await sql`
   INSERT INTO application_errors (
     tenant_id,
     user_id,
     message,
     stack,
     component_path,
     url,
     method,
     status_code,
     request_data,
     browser_info,
     environment,
     severity
   ) VALUES (
     ${tenantId},
     ${userId},
     ${errorData.message},
     ${errorData.stack || null},
     ${errorData.componentPath || null},
     ${errorData.url || null},
     ${errorData.method || null},
     ${errorData.statusCode || null},
     ${errorData.requestData ? JSON.stringify(errorData.requestData) : null},
     ${errorData.browserInfo ? JSON.stringify(errorData.browserInfo) : null},
     ${process.env.NODE_ENV || "development"},
     ${errorData.severity || "medium"}
   )
   RETURNING id
 `

    return { success: true, errorId: result[0].id }
  } catch (error) {
    console.error("Failed to log error to database:", error)
    return { success: false, error }
  }
}

export async function getErrors(
  options: {
    tenantId?: string
    resolved?: boolean
    severity?: string
    limit?: number
    offset?: number
  } = {},
) {
  try {
    const session = await getSession()
    const tenantId = options.tenantId || session?.user?.tenantId || process.env.DEFAULT_TENANT_ID

    let query = `
   SELECT * FROM application_errors 
   WHERE tenant_id = $1
 `

    const queryParams: any[] = [tenantId]
    let paramIndex = 2

    if (options.resolved !== undefined) {
      query += ` AND resolved = $${paramIndex}`
      queryParams.push(options.resolved)
      paramIndex++
    }

    if (options.severity) {
      query += ` AND severity = $${paramIndex}`
      queryParams.push(options.severity)
      paramIndex++
    }

    query += ` ORDER BY created_at DESC`

    if (options.limit) {
      query += ` LIMIT $${paramIndex}`
      queryParams.push(options.limit)
      paramIndex++
    }

    if (options.offset) {
      query += ` OFFSET $${paramIndex}`
      queryParams.push(options.offset)
      paramIndex++
    }

    const result = await sql.query(query, queryParams)
    return { success: true, errors: result.rows }
  } catch (error) {
    console.error("Failed to fetch errors:", error)
    return { success: false, error }
  }
}

export async function markErrorAsResolved(errorId: string, notes?: string) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    await sql`
   UPDATE application_errors
   SET 
     resolved = true,
     resolution_notes = ${notes || null},
     resolved_by = ${userId || null},
     resolved_at = NOW()
   WHERE id = ${errorId}
 `

    return { success: true }
  } catch (error) {
    console.error("Failed to mark error as resolved:", error)
    return { success: false, error }
  }
}
