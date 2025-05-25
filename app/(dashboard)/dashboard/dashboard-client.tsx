"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"

// Sample data for the charts
const barChartData = [
  { name: "Jan", value: 420 },
  { name: "Feb", value: 340 },
  { name: "Mar", value: 560 },
  { name: "Apr", value: 580 },
  { name: "May", value: 690 },
  { name: "Jun", value: 390 },
]

const lineChartData = [
  { date: "Jan", patients: 10, appointments: 20 },
  { date: "Feb", patients: 15, appointments: 25 },
  { date: "Mar", patients: 20, appointments: 30 },
  { date: "Apr", patients: 25, appointments: 35 },
  { date: "May", patients: 30, appointments: 40 },
  { date: "Jun", patients: 35, appointments: 45 },
]

export function DashboardClient() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Care Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Care Professionals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Patient Registrations</CardTitle>
            <CardDescription>New patient registrations over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <BarChart data={barChartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Patients and appointments over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={lineChartData}
              categories={["patients", "appointments"]}
              index="date"
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
