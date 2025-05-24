"use client"

import { useEffect } from "react"
import { SourceMappedError } from "@/components/error-boundaries/source-mapped-error"
import { setupGlobalErrorHandling, logErrorWithSourceMap } from "@/lib/error-tracking"

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

    // Log the error with source map information
    logErrorWithSourceMap(error, {
      location: "GlobalError",
      digest: error.digest,
    })
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <SourceMappedError error={error} resetError={reset} />
        </div>
      </body>
    </html>
  )
}
