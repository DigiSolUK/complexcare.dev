import { Suspense } from "react"
import { ActivityLogsContent } from "./activity-logs-content"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Activity Logs | ComplexCare CRM",
  description: "View system activity logs and audit trail",
}

export default function ActivityLogsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
      </div>
      <Suspense fallback={<ActivityLogsLoading />}>
        <ActivityLogsContent />
      </Suspense>
    </div>
  )
}

function ActivityLogsLoading() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}
