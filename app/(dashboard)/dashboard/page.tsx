import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardClientPage } from "./DashboardClientPage"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Dashboard | ComplexCare CRM",
  description: "Overview of your care management system",
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClientPage />
    </Suspense>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-[250px]" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[125px] w-full" />
        ))}
      </div>
      <Skeleton className="h-[350px] w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[350px] w-full" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    </div>
  )
}
