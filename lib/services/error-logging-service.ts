interface ErrorLogData {
  message: string
  stack?: string
  componentStack?: string
  section?: string
  type?: string
  severity?: "error" | "warning" | "info"
  metadata?: Record<string, any>
  userId?: string
  tenantId?: string
}

export async function logError(errorData: ErrorLogData): Promise<void> {
  try {
    // Add timestamp
    const errorWithTimestamp = {
      ...errorData,
      timestamp: new Date().toISOString(),
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Logging Service]", errorWithTimestamp)
    }

    // Send to API endpoint for server-side logging
    await fetch("/api/error-logging", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorWithTimestamp),
    })
  } catch (loggingError) {
    // Fallback logging if the API call fails
    console.error("[Error Logging Failed]", loggingError)
    console.error("Original Error:", errorData)
  }
}

export function captureError(error: Error, metadata?: Record<string, any>): void {
  logError({
    message: error.message,
    stack: error.stack,
    type: "captured-error",
    severity: "error",
    metadata,
  })
}

export function captureException(error: unknown, metadata?: Record<string, any>): void {
  if (error instanceof Error) {
    captureError(error, metadata)
  } else {
    logError({
      message: String(error),
      type: "captured-exception",
      severity: "error",
      metadata,
    })
  }
}
