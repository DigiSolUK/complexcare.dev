"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/charts"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { TasksList } from "@/components/dashboard/tasks-list"
import { getDashboardData, getPatientActivityData } from "@/lib/actions/dashboard-actions"
import type { DashboardData } from "@/lib/actions/dashboard-actions"

export function DashboardClientPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [activityData, setActivityData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [dashData, actData] = await Promise.all([getDashboardData(), getPatientActivityData()])
        setDashboardData(dashData)
        setActivityData(actData)
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Error Loading Dashboard</h3>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="overview" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <DashboardStats data={dashboardData} isLoading={isLoading} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Patient Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[350px] animate-pulse rounded-md bg-muted"></div>
            ) : (
              <LineChart
                data={activityData || []}
                categories={["visits", "assessments", "medications"]}
                index="date"
                colors={["#2563eb", "#8b5cf6", "#10b981"]}
                valueFormatter={(value) => `${value} patients`}
                yAxisWidth={40}
                className="h-[350px]"
              />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentPatients patients={dashboardData?.recentPatients} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingAppointments appointments={dashboardData?.upcomingAppointments} isLoading={isLoading} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksList tasks={dashboardData?.pendingTasks} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
