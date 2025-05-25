import { captureException } from "./error-capture"

/**
 * Enhanced error logger with detailed context information
 */
export interface ErrorContext {
  userId?: string
  tenantId?: string
  route?: string
  component?: string
  action?: string
  input?: Record<string, any>
  additionalInfo?: Record<string, any>
}

/**
 * Log an error with detailed context information
 */
export function logError(error: Error, context: ErrorContext = {}) {
  // Add timestamp
  const timestamp = new Date().toISOString()

  // Format error details
  const errorDetails = {
    timestamp,
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context,
  }

  // Log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", errorDetails)
  }

  // Send to error tracking service
  captureException(error, {
    extra: errorDetails,
    tags: {
      tenantId: context.tenantId || "unknown",
      component: context.component || "unknown",
      route: context.route || "unknown",
    },
  })

  // Store in database for admin viewing
  try {
    storeErrorInDatabase(errorDetails).catch((dbError) => {
      console.error("Failed to store error in database:", dbError)
    })
  } catch (dbError) {
    console.error("Failed to store error in database:", dbError)
  }

  return errorDetails
}

/**
 * Store error in database for admin viewing
 */
async function storeErrorInDatabase(errorDetails: Record<string, any>) {
  try {
    const response = await fetch("/api/error-logging", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorDetails),
    })

    if (!response.ok) {
      throw new Error(`Failed to log error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    // Silently fail - we don't want to cause more errors while logging errors
    console.error("Error logging failed:", error)
    return null
  }
}

/**
 * Log a warning with context
 */
export function logWarning(message: string, context: ErrorContext = {}) {
  const timestamp = new Date().toISOString()

  const warningDetails = {
    timestamp,
    message,
    level: "warning",
    ...context,
  }

  // Log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.warn("[WARNING]", warningDetails)
  }

  // Store in database
  storeErrorInDatabase({
    ...warningDetails,
    name: "Warning",
    stack: new Error().stack,
  }).catch(console.error)

  return warningDetails
}
