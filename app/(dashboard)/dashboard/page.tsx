import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPatientCount } from "@/lib/services/patient-service"
import { getUpcomingAppointments } from "@/lib/services/appointment-service"
import { getActiveCareProfessionals } from "@/lib/services/care-professional-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

// Loading component for Suspense
function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="animate-pulse bg-gray-200 h-6 w-1/2 rounded"></CardTitle>
        <CardDescription className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
      </CardContent>
    </Card>
  )
}

// Dashboard stats component
async function DashboardStats() {
  try {
    const patientCount = await getPatientCount(DEFAULT_TENANT_ID)
    const upcomingAppointments = await getUpcomingAppointments(DEFAULT_TENANT_ID, 5)
    const activeCareProfessionals = await getActiveCareProfessionals(DEFAULT_TENANT_ID)

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientCount}</div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Care Professionals</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCareProfessionals.length}</div>
            <p className="text-xs text-muted-foreground">Active care professionals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Online</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error loading dashboard stats:", error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
        <h3 className="text-lg font-semibold">Database Connection Error</h3>
        <p>Unable to connect to the database. Please check your connection settings.</p>
      </div>
    )
  }
}

// Recent appointments component
async function RecentAppointments() {
  try {
    const appointments = await getUpcomingAppointments(DEFAULT_TENANT_ID, 5)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>You have {appointments.length} upcoming appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center border-b pb-2">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{appointment.appointment_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                      {appointment.appointment_time.substring(0, 5)}
                    </p>
                    <p className="text-xs text-muted-foreground">{appointment.location}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No upcoming appointments</div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error loading recent appointments:", error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Error loading appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">Unable to load appointment data. Please try again later.</div>
        </CardContent>
      </Card>
    )
  }
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <LoadingCard key={i} />
                  ))}
              </div>
            }
          >
            <DashboardStats />
          </Suspense>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <Suspense fallback={<LoadingCard />}>
                <RecentAppointments />
              </Suspense>
            </div>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>System performance and health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Database Connection</p>
                      <p className="text-sm text-muted-foreground">NeonDB Connection</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">API Status</p>
                      <p className="text-sm text-muted-foreground">REST API Endpoints</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Authentication</p>
                      <p className="text-sm text-muted-foreground">Auth Services</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>System analytics and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analytics content will be displayed here.</p>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>System usage and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Usage statistics will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>View and generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notifications content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
