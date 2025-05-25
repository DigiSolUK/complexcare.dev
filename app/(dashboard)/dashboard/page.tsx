import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionErrorBoundary } from "@/components/error-boundaries/section-error-boundary"
import DashboardClientPage from "./DashboardClientPage"

export const metadata = {
  title: "Dashboard | ComplexCare CRM",
  description: "Overview of key metrics and performance indicators",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader heading="Dashboard" subheading="Overview of key metrics and performance indicators" />

      <SectionErrorBoundary>
        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full" />
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
      </SectionErrorBoundary>
    </div>
  )
}
