"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionErrorBoundary } from "@/components/error-boundaries"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { useDashboard } from "./dashboard-context"

// Sample data for charts
const patientActivityData = [
  { name: "Jan", value: 45 },
  { name: "Feb", value: 52 },
  { name: "Mar", value: 49 },
  { name: "Apr", value: 62 },
  { name: "May", value: 55 },
  { name: "Jun", value: 71 },
  { name: "Jul", value: 68 },
]

const appointmentData = [
  { name: "Mon", scheduled: 24, completed: 21 },
  { name: "Tue", scheduled: 18, completed: 17 },
  { name: "Wed", scheduled: 27, completed: 24 },
  { name: "Thu", scheduled: 23, completed: 19 },
  { name: "Fri", scheduled: 19, completed: 16 },
]

const patientStatusData = [
  { name: "Active", value: 65 },
  { name: "Inactive", value: 15 },
  { name: "Critical", value: 8 },
  { name: "Stable", value: 12 },
]

const medicationAdherenceData = [
  { name: "Jan", adherence: 78 },
  { name: "Feb", adherence: 82 },
  { name: "Mar", adherence: 79 },
  { name: "Apr", adherence: 85 },
  { name: "May", adherence: 88 },
  { name: "Jun", adherence: 91 },
]

export function EnhancedDashboard() {
  const { filters } = useDashboard()

  // In a real app, we would filter the data based on the filters
  // For now, we'll just use the sample data

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <CardDescription>Active patients in system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CardDescription>This week's appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">+3.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Care Professionals</CardTitle>
            <CardDescription>Active care providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+5.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CardDescription>Overall compliance score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.3%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionErrorBoundary>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Patient Activity</CardTitle>
              <CardDescription>Patient interactions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart data={patientActivityData} xAxisKey="name" yAxisKey="value" height={300} />
            </CardContent>
          </Card>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Appointment Statistics</CardTitle>
              <CardDescription>Scheduled vs. completed appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={appointmentData} xAxisKey="name" yAxisKeys={["scheduled", "completed"]} height={300} />
            </CardContent>
          </Card>
        </SectionErrorBoundary>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionErrorBoundary>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Patient Status Distribution</CardTitle>
              <CardDescription>Current status of all patients</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PieChart data={patientStatusData} nameKey="name" valueKey="value" height={300} />
            </CardContent>
          </Card>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Medication Adherence</CardTitle>
              <CardDescription>Patient medication adherence rates</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart data={medicationAdherenceData} xAxisKey="name" yAxisKey="adherence" height={300} />
            </CardContent>
          </Card>
        </SectionErrorBoundary>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="recent">Recent Patients</TabsTrigger>
          <TabsTrigger value="tasks">Pending Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-medium mb-2">Upcoming Appointments</h3>
          <p className="text-muted-foreground">No upcoming appointments for the selected filters.</p>
        </TabsContent>
        <TabsContent value="recent" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-medium mb-2">Recent Patients</h3>
          <p className="text-muted-foreground">No recent patients for the selected filters.</p>
        </TabsContent>
        <TabsContent value="tasks" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-medium mb-2">Pending Tasks</h3>
          <p className="text-muted-foreground">No pending tasks for the selected filters.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
