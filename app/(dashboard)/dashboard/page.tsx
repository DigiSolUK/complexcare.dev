import type { Metadata } from "next"
import { Suspense } from "react"
import { AdvancedAnalyticsDashboard } from "@/components/analytics/advanced-analytics-dashboard"

export const metadata: Metadata = {
  title: "Dashboard | ComplexCare CRM",
  description: "Dashboard for ComplexCare CRM",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <AdvancedAnalyticsDashboard />
      </Suspense>
    </div>
  )
}
