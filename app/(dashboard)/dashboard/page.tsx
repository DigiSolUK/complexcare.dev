import { Suspense } from "react"
import { DashboardClientPage } from "./DashboardClientPage"
import { PageErrorBoundary } from "@/components/error-boundaries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Dashboard | ComplexCare CRM",
  description: "View your key metrics and performance indicators",
}

export default function DashboardPage() {
  return (
    <PageErrorBoundary>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle>Loading dashboard data...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">Loading metrics and charts...</div>
                </div>
              </CardContent>
            </Card>
          }
        >
          <DashboardClientPage />
        </Suspense>
      </div>
    </PageErrorBoundary>
  )
}
