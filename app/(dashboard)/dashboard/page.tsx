import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { TasksList } from "@/components/dashboard/tasks-list"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"

async function getDashboardData() {
  try {
    // This is mock data - in a real app, you would fetch this from your database
    return {
      patientCount: 128,
      patientGrowth: 12,
      appointmentsToday: 24,
      appointmentsPending: 5,
      carePlansActive: 87,
      carePlansReview: 12,
      staffCompliance: 94,
      certificationsExpiring: 3,
      tasksAssigned: 42,
      tasksCompleted: 18,
      outstandingInvoices: 12450,
      overduePayments: 4,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return {
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
    }
  }
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData()

  return (
    <ErrorBoundary componentPath="app/(dashboard)/dashboard/page.tsx">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your Complex Care CRM dashboard</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats data={dashboardData} />
        </Suspense>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent patient activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Activity chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your schedule for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<Skeleton className="h-[300px]" />}>
                    <UpcomingAppointments />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Recently updated patient records</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[400px]" />}>
                  <RecentPatients />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Your assigned tasks and to-dos</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[400px]" />}>
                  <TasksList />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
