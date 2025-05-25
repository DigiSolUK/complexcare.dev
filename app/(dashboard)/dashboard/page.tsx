import { Suspense } from "react"
import { FallbackDashboard } from "@/components/dashboard/fallback-dashboard"
import dynamic from "next/dynamic"

// Dynamically import the dashboard component with no SSR to avoid chart rendering issues
const DashboardClientPage = dynamic(() => import("./DashboardClientPage").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading dashboard...</div>,
})

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <Suspense fallback={<FallbackDashboard />}>
        <DashboardClientPage />
      </Suspense>
    </div>
  )
}
