/**
 * Error tracking utilities with source map support
 */

// Function to format error with source information
export function formatErrorWithSource(error: Error): string {
  // Get the stack trace
  const stack = error.stack || ""

  // Extract source information if available
  const sourceInfo = extractSourceInfo(stack)

  return `${error.name}: ${error.message}
Source: ${sourceInfo.file || "unknown"}:${sourceInfo.line || "?"}:${sourceInfo.column || "?"}
Stack: ${stack}`
}

// Extract source information from stack trace
function extractSourceInfo(stack: string): { file?: string; line?: string; column?: string } {
  // Default empty result
  const result = { file: undefined, line: undefined, column: undefined }

  // Try to match the first stack frame with source information
  const stackLines = stack.split("\n")

  for (const line of stackLines) {
    // Look for webpack-internal or app source files
    if (line.includes("/app/") || line.includes("/components/") || line.includes("/lib/")) {
      // Extract file, line, and column information
      const match = line.match(/(?:at\s+.*\s+\()?([^:]+):(\d+):(\d+)/)
      if (match) {
        result.file = match[1]
        result.line = match[2]
        result.column = match[3]
        break
      }
    }
  }

  return result
}

// Log error with source map information
export function logErrorWithSourceMap(error: Error, context?: Record<string, any>): void {
  console.error(formatErrorWithSource(error))

  if (context) {
    console.error("Error context:", context)
  }
}

// Global error handler with source map support
export function setupGlobalErrorHandling(): void {
  if (typeof window !== "undefined") {
    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      logErrorWithSourceMap(error, { type: "unhandledrejection" })
    })

    // Handle regular errors
    window.addEventListener("error", (event) => {
      if (event.error) {
        logErrorWithSourceMap(event.error, {
          type: "error",
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        })
      }
    })
  }
}
