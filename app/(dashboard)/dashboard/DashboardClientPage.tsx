"use client"

import { Suspense } from "react"
import { EnhancedDashboard } from "@/components/dashboard/enhanced-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "react-error-boundary"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
        <p className="mb-6 text-gray-600">
          We encountered an error loading the dashboard. This could be due to missing data or a temporary issue.
        </p>
        <div className="space-y-4">
          <Button onClick={resetErrorBoundary} variant="destructive">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardClientPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<DashboardSkeleton />}>
          <EnhancedDashboard />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    </div>
  )
}
