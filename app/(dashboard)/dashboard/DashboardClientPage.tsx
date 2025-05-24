"use client"

import { useState, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { PatientActivityChart } from "@/components/dashboard/patient-activity-chart"

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
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    patientCount: 248,
    patientGrowth: 4,
    appointmentsToday: 8,
    appointmentsPending: 3,
    carePlansActive: 187,
    carePlansReview: 12,
    staffCompliance: 92,
    certificationsExpiring: 5,
    tasksAssigned: 24,
    tasksCompleted: 18,
    outstandingInvoices: 12500,
    overduePayments: 3,
  })

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading dashboard data...</div>
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="space-y-6">
        <DashboardStats data={dashboardData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatientActivityChart />

          {/* Recent patients component */}
          <div className="bg-card rounded-lg shadow">
            {/* This would be replaced with the actual component */}
            <div className="p-6">
              <h3 className="text-lg font-medium">Recent Patients</h3>
              <p className="text-sm text-muted-foreground">Loading recent patients...</p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
