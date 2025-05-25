// This is a simple error logging service that can be expanded later
// to integrate with services like Sentry, LogRocket, etc.

interface ErrorContext {
  [key: string]: any
}

export function captureException(error: unknown, context: ErrorContext = {}): void {
  console.error("Error captured:", error)
  console.error("Context:", context)

  // In production, you would send this to your error tracking service
  // Example with Sentry:
  // Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, context: ErrorContext = {}): void {
  console.warn("Message captured:", message)
  console.warn("Context:", context)

  // In production, you would send this to your error tracking service
  // Example with Sentry:
  // Sentry.captureMessage(message, { extra: context });
}
