/**
 * Error capture service
 * This is a wrapper around error tracking services like Sentry
 */

interface CaptureOptions {
  extra?: Record<string, any>
  tags?: Record<string, string>
  level?: "error" | "warning" | "info"
  user?: {
    id?: string
    email?: string
    username?: string
  }
}

/**
 * Capture an exception and send it to the error tracking service
 */
export function captureException(error: Error, options: CaptureOptions = {}) {
  // In a real implementation, this would send to Sentry, LogRocket, etc.
  // For now, we'll just log to the database via API

  const errorData = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...options.extra,
    tags: options.tags || {},
    level: options.level || "error",
    user: options.user || {},
  }

  // Log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.error("[CAPTURED EXCEPTION]", errorData)
  }

  // Send to API endpoint
  try {
    fetch("/api/error-logging", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorData),
    }).catch((e) => {
      console.error("Failed to send error to API:", e)
    })
  } catch (e) {
    console.error("Failed to send error to API:", e)
  }

  return errorData
}

/**
 * Capture a message and send it to the error tracking service
 */
export function captureMessage(message: string, options: CaptureOptions = {}) {
  const messageData = {
    message,
    timestamp: new Date().toISOString(),
    ...options.extra,
    tags: options.tags || {},
    level: options.level || "info",
    user: options.user || {},
  }

  // Log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.log("[CAPTURED MESSAGE]", messageData)
  }

  // Send to API endpoint
  try {
    fetch("/api/error-logging", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    }).catch((e) => {
      console.error("Failed to send message to API:", e)
    })
  } catch (e) {
    console.error("Failed to send message to API:", e)
  }

  return messageData
}
