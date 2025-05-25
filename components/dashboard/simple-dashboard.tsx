"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/charts"
import { useDashboard } from "./dashboard-context"
import { Skeleton } from "@/components/ui/skeleton"

export function SimpleDashboard() {
  const { filters, isLoading } = useDashboard()
  const [metricsData, setMetricsData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metrics data
        const metricsResponse = await fetch("/api/dashboard/metrics")
        const metricsResult = await metricsResponse.json()

        if (metricsResult.success) {
          setMetricsData(metricsResult.data)
        } else {
          setError(metricsResult.error || "Failed to load metrics data")
          // Provide fallback data
          setMetricsData({
            patientCount: 0,
            patientGrowth: 0,
            appointmentsToday: 0,
            appointmentsPending: 0,
            carePlansActive: 0,
            carePlansReview: 0,
            staffCompliance: 0,
            certificationsExpiring: 0,
            tasksAssigned: 0,
            tasksCompleted: 0,
            outstandingInvoices: 0,
            overduePayments: 0,
          })
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
        // Set fallback data
        setMetricsData({
          patientCount: 0,
          patientGrowth: 0,
          appointmentsToday: 0,
          appointmentsPending: 0,
          carePlansActive: 0,
          carePlansReview: 0,
          staffCompliance: 0,
          certificationsExpiring: 0,
          tasksAssigned: 0,
          tasksCompleted: 0,
          outstandingInvoices: 0,
          overduePayments: 0,
        })
      }
    }

    fetchData()
  }, [filters])

  // If we're still loading or don't have data yet, show skeletons
  if (isLoading || !metricsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  // Sample data for the chart
  const performanceData = [
    { category: "Patients", value: metricsData.patientCount || 0 },
    { category: "Appointments", value: metricsData.appointmentsToday || 0 },
    { category: "Care Plans", value: metricsData.carePlansActive || 0 },
    { category: "Tasks", value: metricsData.tasksAssigned || 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>Total patients and growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricsData.patientCount || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {(metricsData.patientGrowth >= 0 ? "+" : "") + (metricsData.patientGrowth || 0)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Today's appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricsData.appointmentsToday || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">{metricsData.appointmentsPending || 0} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Care Plans</CardTitle>
            <CardDescription>Active care plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricsData.carePlansActive || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">{metricsData.carePlansReview || 0} need review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Assigned and completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricsData.tasksAssigned || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">{metricsData.tasksCompleted || 0} completed today</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Key metrics visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={performanceData}
            categories={["value"]}
            index="category"
            valueFormatter={(value) => `${value}`}
            colors={["#2563eb"]}
            className="h-[300px]"
          />
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-red-500 mt-2">Some data may be using fallback values.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
