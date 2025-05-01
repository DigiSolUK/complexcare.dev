import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Analytics cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg shadow p-6">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>

      {/* Data table skeleton */}
      <div className="bg-card rounded-lg shadow p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
