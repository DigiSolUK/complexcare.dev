"use client"

import { useState } from "react"
import { SimpleDashboard } from "@/components/dashboard/simple-dashboard"
import { FallbackDashboard } from "@/components/dashboard/fallback-dashboard"
import { ErrorBoundary } from "react-error-boundary"

export default function DashboardClientPage() {
  const [hasError, setHasError] = useState(false)

  // If there's an error with the charts, use the fallback dashboard
  if (hasError) {
    return <FallbackDashboard />
  }

  return (
    <ErrorBoundary FallbackComponent={() => <FallbackDashboard />} onError={() => setHasError(true)}>
      <SimpleDashboard />
    </ErrorBoundary>
  )
}
