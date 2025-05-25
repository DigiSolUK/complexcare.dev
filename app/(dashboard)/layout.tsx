import type React from "react"
import { PageErrorBoundary } from "@/components/error-boundaries/page-error-boundary"
import { DashboardLayoutClient } from "./dashboard-layout-client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </div>
    </PageErrorBoundary>
  )
}
