"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentPatients } from "@/components/recent-patients"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { PatientActivityChart } from "@/components/patient-activity-chart"
import { DashboardStats } from "@/components/dashboard-stats"

export function DashboardClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <DashboardStats />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Patient Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <PatientActivityChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Patients</CardTitle>
                    <CardDescription>{isLoaded ? "Recently updated patient records" : "Loading..."}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentPatients />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>You have {isLoaded ? "8" : "..."} appointments scheduled</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UpcomingAppointments />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>You have {isLoaded ? "5" : "..."} tasks due today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* TasksList component would go here */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                        <div>Review patient notes for John Smith</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                        <div>Follow up on lab results for Jane Doe</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                        <div>Schedule follow-up appointment for Tom Johnson</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>Patient and appointment analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex items-center justify-center border rounded">
                      <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>View and generate reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex items-center justify-center border rounded">
                      <p className="text-muted-foreground">Reports dashboard coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
