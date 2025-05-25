"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { PatientActivityChart } from "@/components/dashboard/patient-activity-chart"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { TasksList } from "@/components/dashboard/tasks-list"
import { ComplianceMetrics } from "@/components/dashboard/compliance-metrics"
import { StaffPerformance } from "@/components/dashboard/staff-performance"
import { FinancialOverview } from "@/components/dashboard/financial-overview"
import { CareQualityMetrics } from "@/components/dashboard/care-quality-metrics"
import { MedicationAdherenceChart } from "@/components/dashboard/medication-adherence-chart"
import { PatientDemographics } from "@/components/dashboard/patient-demographics"
import { ResourceUtilization } from "@/components/dashboard/resource-utilization"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Users, Calendar, ClipboardList, FileText, PlusCircle } from "lucide-react"
import { getDashboardData, type DashboardData } from "@/lib/actions/dashboard-actions"

const quickActions = [
  {
    title: "Add New Patient",
    description: "Register a new patient in the system",
    icon: Users,
    href: "/patients/new",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Schedule Appointment",
    description: "Book a new appointment",
    icon: Calendar,
    href: "/appointments/new",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Create Care Plan",
    description: "Design a new care plan",
    icon: ClipboardList,
    href: "/care-plans/new",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Add Clinical Note",
    description: "Document patient interaction",
    icon: FileText,
    href: "/clinical-notes/new",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

export function DashboardClientPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardData()
      setDashboardData(data)
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your ComplexCare CRM dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reports/new">Generate Report</Link>
          </Button>
          <Button asChild>
            <Link href="/patients/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Patient
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            dashboardData && <DashboardStats data={dashboardData} />
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div
                        className={`${action.bgColor} ${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Patient Activity</CardTitle>
                <CardDescription>Overview of patient interactions this week</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientActivityChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Latest patient updates</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatients patients={dashboardData?.recentPatients} isLoading={loading} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Next 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments appointments={dashboardData?.upcomingAppointments} isLoading={loading} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksList tasks={dashboardData?.pendingTasks} isLoading={loading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ComplianceMetrics isLoading={loading} />
            <StaffPerformance isLoading={loading} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ResourceUtilization isLoading={loading} />
            <PatientDemographics isLoading={loading} />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialOverview isLoading={loading} />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Status</CardTitle>
                <CardDescription>Current month invoice breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Invoice status chart will be displayed here</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/invoicing">View All Invoices</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>Staff payroll overview</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Payroll summary chart will be displayed here</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/payroll">View Payroll Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <CareQualityMetrics isLoading={loading} />

          <div className="grid gap-4 md:grid-cols-2">
            <MedicationAdherenceChart isLoading={loading} />

            <Card>
              <CardHeader>
                <CardTitle>Care Plan Outcomes</CardTitle>
                <CardDescription>Effectiveness of care plans</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Care plan outcomes chart will be displayed here</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/care-plans">View Care Plans</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
