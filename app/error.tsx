"use client"

import { useEffect } from "react"
import { SourceMappedError } from "@/components/error-boundaries/source-mapped-error"
import { logErrorWithSourceMap } from "@/lib/error-tracking"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error with source map information
    logErrorWithSourceMap(error, {
      location: "ErrorBoundary",
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="container mx-auto p-4">
      <SourceMappedError error={error} resetError={reset} />
    </div>
  )
}
