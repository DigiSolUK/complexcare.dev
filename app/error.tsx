"use client"

import { useEffect } from "react"
import { SourceMappedError } from "@/components/error-boundaries/source-mapped-error"
import { logErrorWithSourceMap } from "@/lib/error-tracking"
import { usePathname } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()

  useEffect(() => {
    // Log the error with source map information and enhanced context
    logErrorWithSourceMap(error, {
      location: pathname || "ErrorBoundary",
      component: "AppErrorBoundary",
      action: "render",
      severity: "high",
      tenantId: localStorage.getItem("currentTenantId") || undefined,
      userId: localStorage.getItem("userId") || undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      digest: error.digest,
      timestamp: new Date(),
    })
  }, [error, pathname, error.digest])

  return (
    <div className="container mx-auto p-4">
      <SourceMappedError error={error} resetError={reset} severity="high" />
    </div>
  )
}
