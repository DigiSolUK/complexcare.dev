import { Suspense } from "react"
import { DashboardClientPage } from "./DashboardClientPage"

export const metadata = {
  title: "Dashboard | ComplexCare CRM",
  description: "Dashboard for ComplexCare CRM",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardClientPage />
      </Suspense>
    </div>
  )
}
