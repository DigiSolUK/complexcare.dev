"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionErrorBoundary } from "@/components/error-boundaries"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { useDashboard } from "./dashboard-context"

// Sample data for charts
const patientStatusData = [
  { name: "Active", value: 65 },
  { name: "Inactive", value: 15 },
  { name: "Critical", value: 8 },
  { name: "Stable", value: 12 },
]

const appointmentData = [
  { name: "Mon", count: 24 },
  { name: "Tue", count: 18 },
  { name: "Wed", count: 27 },
  { name: "Thu", count: 23 },
  { name: "Fri", count: 19 },
]

export function SimpleDashboard() {
  const { filters } = useDashboard()

  // In a real app, we would filter the data based on the filters
  // For now, we'll just use the sample data

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Care Professionals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.3%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionErrorBoundary>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Patient Status</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PieChart data={patientStatusData} nameKey="name" valueKey="value" height={300} />
            </CardContent>
          </Card>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Weekly Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={appointmentData} xAxisKey="name" yAxisKeys={["count"]} height={300} />
            </CardContent>
          </Card>
        </SectionErrorBoundary>
      </div>
    </div>
  )
}
