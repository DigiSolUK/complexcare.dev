/**
 * Enhanced error tracking utilities with source map support and detailed logging
 */
import { captureException } from "@/lib/services/error-logging-service"

// Enhanced error context interface
export interface ErrorContext {
  location: string
  component?: string
  action?: string
  userId?: string
  tenantId?: string
  url?: string
  input?: Record<string, any>
  additionalInfo?: Record<string, any>
  severity?: "low" | "medium" | "high" | "critical"
  timestamp?: Date
  digest?: string
}

// Format error with detailed source information
export function formatErrorWithSource(error: Error, context?: ErrorContext): string {
  // Get the stack trace
  const stack = error.stack || ""

  // Extract source information if available
  const sourceInfo = extractSourceInfo(stack)
  const timestamp = context?.timestamp || new Date()
  const formattedTimestamp = timestamp.toISOString()

  // Build a detailed error message
  return `[${formattedTimestamp}] ${error.name}: ${error.message}
Severity: ${context?.severity || "medium"}
Location: ${context?.location || "unknown"} ${context?.component ? `(${context.component})` : ""}
Action: ${context?.action || "unknown"}
User: ${context?.userId || "unknown"}
Tenant: ${context?.tenantId || "unknown"}
URL: ${context?.url || "unknown"}
Source: ${sourceInfo.file || "unknown"}:${sourceInfo.line || "?"}:${sourceInfo.column || "?"}
Stack: ${stack}
${context?.additionalInfo ? `Additional Info: ${JSON.stringify(context.additionalInfo, null, 2)}` : ""}
${context?.input ? `Input Data: ${JSON.stringify(context.input, null, 2)}` : ""}`
}

// Extract source information from stack trace with improved parsing
function extractSourceInfo(stack: string): { file?: string; line?: string; column?: string; functionName?: string } {
  // Default empty result
  const result = { file: undefined, line: undefined, column: undefined, functionName: undefined }

  // Try to match the first stack frame with source information
  const stackLines = stack.split("\n")

  for (const line of stackLines) {
    // Look for webpack-internal or app source files
    if (line.includes("/app/") || line.includes("/components/") || line.includes("/lib/")) {
      // Extract file, line, column and function information
      // Match patterns like: at FunctionName (/path/to/file.js:123:45)
      // or: at /path/to/file.js:123:45
      const functionMatch = line.match(/at\s+([^\s]+)\s+$$([^:]+):(\d+):(\d+)$$/)
      if (functionMatch) {
        result.functionName = functionMatch[1]
        result.file = functionMatch[2]
        result.line = functionMatch[3]
        result.column = functionMatch[4]
        break
      }

      // Alternative pattern without function name
      const fileMatch = line.match(/at\s+([^:]+):(\d+):(\d+)/)
      if (fileMatch) {
        result.file = fileMatch[1]
        result.line = fileMatch[2]
        result.column = fileMatch[3]
        break
      }
    }
  }

  return result
}

// Enhanced error logging with severity levels and structured data
export function logErrorWithSourceMap(error: Error, context?: ErrorContext): void {
  const formattedError = formatErrorWithSource(error, context)

  // Console logging with appropriate severity level
  if (context?.severity === "critical") {
    console.error("CRITICAL ERROR:", formattedError)
  } else if (context?.severity === "high") {
    console.error("HIGH SEVERITY ERROR:", formattedError)
  } else if (context?.severity === "low") {
    console.warn("LOW SEVERITY ERROR:", formattedError)
  } else {
    console.error("ERROR:", formattedError)
  }

  // Send to error logging service
  try {
    captureException(error, {
      ...context,
      formattedError,
      timestamp: new Date().toISOString(),
    })
  } catch (loggingError) {
    console.error("Failed to send error to logging service:", loggingError)
  }

  // In development, you might want to add a debugger statement
  if (process.env.NODE_ENV === "development") {
    // debugger;
  }
}

// Enhanced global error handler with detailed context
export function setupGlobalErrorHandling(): void {
  if (typeof window !== "undefined") {
    // Handle unhandled promise rejections with more context
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))

      // Get current URL and path
      const url = window.location.href
      const path = window.location.pathname

      logErrorWithSourceMap(error, {
        location: path,
        severity: "high",
        action: "unhandled_promise_rejection",
        url,
        additionalInfo: {
          eventType: "unhandledrejection",
          timestamp: new Date().toISOString(),
        },
      })
    })

    // Handle regular errors with more context
    window.addEventListener("error", (event) => {
      // Ignore errors from external scripts
      if (event.filename && !event.filename.includes(window.location.origin)) {
        return
      }

      if (event.error) {
        logErrorWithSourceMap(event.error, {
          location: window.location.pathname,
          severity: "high",
          action: "uncaught_error",
          url: window.location.href,
          additionalInfo: {
            eventType: "error",
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            timestamp: new Date().toISOString(),
          },
        })
      }
    })

    // Log navigation errors
    if ("onnavigationerror" in window) {
      // @ts-ignore - This is a newer API that TypeScript might not recognize
      window.addEventListener("navigationerror", (event: any) => {
        const error = new Error(`Navigation failed: ${event.destination?.url || "unknown destination"}`)
        logErrorWithSourceMap(error, {
          location: "navigation",
          severity: "medium",
          action: "navigation_error",
          url: window.location.href,
          additionalInfo: {
            destination: event.destination?.url,
            timestamp: new Date().toISOString(),
          },
        })
      })
    }
  }
}

// Function to create a contextual error with additional information
export function createContextualError(
  message: string,
  context?: Omit<ErrorContext, "location"> & { cause?: Error },
): Error {
  const error = new Error(message)

  // Add cause if provided (for error chaining)
  if (context?.cause) {
    // @ts-ignore - Error cause is a newer feature
    error.cause = context.cause
  }

  // Add context to the error object for later reference
  // @ts-ignore - Adding custom property
  error.errorContext = context

  return error
}

// Helper to extract user-friendly message from technical errors
export function getUserFriendlyErrorMessage(error: Error): string {
  // Database connection errors
  if (
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("connection") ||
    error.message.includes("database")
  ) {
    return "Unable to connect to the database. Please try again later."
  }

  // Authentication errors
  if (
    error.message.includes("authentication") ||
    error.message.includes("unauthorized") ||
    error.message.includes("forbidden")
  ) {
    return "Authentication failed. Please log in again."
  }

  // Validation errors
  if (error.message.includes("validation") || error.message.includes("invalid")) {
    return "The information provided is invalid. Please check your input and try again."
  }

  // Network errors
  if (error.message.includes("network") || error.message.includes("fetch") || error.message.includes("timeout")) {
    return "Network connection issue. Please check your internet connection and try again."
  }

  // Default generic message
  return "An unexpected error occurred. Our team has been notified."
}
