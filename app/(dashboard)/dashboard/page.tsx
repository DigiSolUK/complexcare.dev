import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// Dynamically import the dashboard component with no SSR to avoid chart rendering issues
const DashboardClientPage = dynamic(() => import("./DashboardClientPage"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <Skeleton className="h-[50px] w-[200px]" />
      <Skeleton className="h-[200px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>
    </div>
  ),
})

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
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-[50px] w-[200px]" />
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[120px]" />
              ))}
            </div>
          </div>
        }
      >
        <DashboardClientPage />
      </Suspense>
    </div>
  )
}
