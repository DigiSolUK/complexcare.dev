import type React from "react"
import { PageErrorBoundary } from "@/components/error-boundaries/page-error-boundary"
import { DashboardLayoutClient } from "./dashboard-layout-client"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <DashboardLayoutClient>{children}</DashboardLayoutClient>
        </div>
      </div>
    </PageErrorBoundary>
  )
}
