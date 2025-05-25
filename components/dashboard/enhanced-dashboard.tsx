"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { useDashboard } from "./dashboard-context"
import { Skeleton } from "@/components/ui/skeleton"

// Define the data structure
interface MetricsData {
  patientCount: number
  patientGrowth: number
  appointmentsToday: number
  appointmentsPending: number
  carePlansActive: number
  carePlansReview: number
  staffCompliance: number
  certificationsExpiring: number
  tasksAssigned: number
  tasksCompleted: number
  outstandingInvoices: number
  overduePayments: number
}

export function EnhancedDashboard() {
  const { filters, isLoading } = useDashboard()
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null)
  const [activityData, setActivityData] = useState<any[]>([])
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

        // Fetch activity data
        const activityResponse = await fetch("/api/dashboard/patient-activity")
        const activityResult = await activityResponse.json()

        if (activityResult.success) {
          setActivityData(activityResult.data || [])
        } else {
          // Provide fallback data
          setActivityData([
            { date: "2023-01-01", visits: 5, assessments: 3, medications: 7 },
            { date: "2023-01-02", visits: 6, assessments: 4, medications: 8 },
            { date: "2023-01-03", visits: 4, assessments: 2, medications: 6 },
            { date: "2023-01-04", visits: 7, assessments: 5, medications: 9 },
            { date: "2023-01-05", visits: 8, assessments: 6, medications: 10 },
            { date: "2023-01-06", visits: 6, assessments: 4, medications: 8 },
            { date: "2023-01-07", visits: 5, assessments: 3, medications: 7 },
          ])
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
        setActivityData([
          { date: "2023-01-01", visits: 5, assessments: 3, medications: 7 },
          { date: "2023-01-02", visits: 6, assessments: 4, medications: 8 },
          { date: "2023-01-03", visits: 4, assessments: 2, medications: 6 },
          { date: "2023-01-04", visits: 7, assessments: 5, medications: 9 },
          { date: "2023-01-05", visits: 8, assessments: 6, medications: 10 },
          { date: "2023-01-06", visits: 6, assessments: 4, medications: 8 },
          { date: "2023-01-07", visits: 5, assessments: 3, medications: 7 },
        ])
      }
    }

    fetchData()
  }, [filters])

  // If we're still loading or don't have data yet, show skeletons
  if (isLoading || !metricsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  // Prepare data for charts
  const patientStatusData = [
    { name: "Active", value: 65 },
    { name: "Inactive", value: 20 },
    { name: "Critical", value: 5 },
    { name: "Stable", value: 10 },
  ]

  const appointmentTypeData = [
    { name: "Check-up", value: 40 },
    { name: "Follow-up", value: 30 },
    { name: "Emergency", value: 10 },
    { name: "Consultation", value: 15 },
    { name: "Therapy", value: 5 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsData.patientCount}</div>
            <p className="text-xs text-muted-foreground">
              {metricsData.patientGrowth >= 0 ? "+" : ""}
              {metricsData.patientGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsData.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground">{metricsData.appointmentsPending} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Care Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsData.carePlansActive}</div>
            <p className="text-xs text-muted-foreground">{metricsData.carePlansReview} need review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Staff Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsData.staffCompliance}%</div>
            <p className="text-xs text-muted-foreground">
              {metricsData.certificationsExpiring} certifications expiring soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Patient Activity</CardTitle>
            <CardDescription>Daily patient interactions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={activityData}
              categories={["visits", "assessments", "medications"]}
              index="date"
              valueFormatter={(value) => `${value} patients`}
              colors={["#2563eb", "#16a34a", "#d97706"]}
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <Tabs defaultValue="status">
              <TabsList>
                <TabsTrigger value="status">Patient Status</TabsTrigger>
                <TabsTrigger value="appointments">Appointment Types</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="status" className="h-[300px]">
              <TabsContent value="status" className="h-full">
                <PieChart
                  data={patientStatusData}
                  category="value"
                  index="name"
                  valueFormatter={(value) => `${value}%`}
                  colors={["#2563eb", "#d1d5db", "#dc2626", "#16a34a"]}
                  className="h-full"
                />
              </TabsContent>
              <TabsContent value="appointments" className="h-full">
                <BarChart
                  data={appointmentTypeData}
                  categories={["value"]}
                  index="name"
                  valueFormatter={(value) => `${value}%`}
                  colors={["#2563eb"]}
                  className="h-full"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsData.tasksAssigned}</div>
            <p className="text-xs text-muted-foreground">{metricsData.tasksCompleted} completed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{metricsData.outstandingInvoices}</div>
            <p className="text-xs text-muted-foreground">{metricsData.overduePayments} overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Staff Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

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
