"use client"

import { useEffect } from "react"
import { SourceMappedError } from "@/components/error-boundaries/source-mapped-error"
import { setupGlobalErrorHandling, logErrorWithSourceMap } from "@/lib/error-tracking"
import { ErrorSeverity, ErrorCategory, captureException } from "@/lib/services/error-logging-service"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Set up global error handling
    setupGlobalErrorHandling()

    // Log the error with source map information and enhanced context
    logErrorWithSourceMap(error, {
      location: "GlobalError",
      component: "GlobalErrorBoundary",
      action: "render",
      severity: "critical",
      additionalInfo: {
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
      digest: error.digest,
    })

    // Also capture the exception with our error logging service
    captureException(error, {
      severity: ErrorSeverity.CRITICAL,
      category: ErrorCategory.SYSTEM,
      component: "GlobalErrorBoundary",
      action: "render",
      digest: error.digest,
      timestamp: new Date().toISOString(),
      isGlobalError: true,
    })
  }, [error, error.digest])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <SourceMappedError error={error} resetError={reset} severity="critical" />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              If this error persists, please contact support or try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
