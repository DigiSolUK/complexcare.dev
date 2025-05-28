"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { LineChart, BarChart } from "@/components/charts"

export function AdvancedAnalyticsDashboard() {
  const [date, setDate] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })

  // Sample data for charts
  const patientGrowthData = [
    { month: "Jan", actual: 45, predicted: 42 },
    { month: "Feb", actual: 52, predicted: 48 },
    { month: "Mar", actual: 49, predicted: 50 },
    { month: "Apr", actual: 62, predicted: 55 },
    { month: "May", actual: 58, predicted: 60 },
    { month: "Jun", actual: 66, predicted: 65 },
  ]

  const appointmentCompletionData = [
    { month: "Jan", completed: 82, missed: 18 },
    { month: "Feb", completed: 85, missed: 15 },
    { month: "Mar", completed: 88, missed: 12 },
    { month: "Apr", completed: 84, missed: 16 },
    { month: "May", completed: 90, missed: 10 },
    { month: "Jun", completed: 92, missed: 8 },
  ]

  const demographicsData = [
    { age: "0-18", count: 120 },
    { age: "19-35", count: 250 },
    { age: "36-50", count: 310 },
    { age: "51-65", count: 280 },
    { age: "66+", count: 190 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive analytics with predictive insights</p>
        </div>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Total Patients", value: "1,248" },
          { name: "Appointment Completion", value: "87.5%" },
          { name: "Care Plan Adherence", value: "78.3%" },
          { name: "Notes Per Patient", value: "3.7" },
        ].map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="quality">Care Quality</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth Prediction</CardTitle>
                <CardDescription>Actual and predicted new patient registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart
                    data={patientGrowthData}
                    categories={["actual", "predicted"]}
                    index="month"
                    colors={["#0ea5e9", "#6366f1"]}
                    valueFormatter={(value) => `${value} patients`}
                    className="h-[300px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Completion Rate</CardTitle>
                <CardDescription>Monthly completion rate trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    data={appointmentCompletionData}
                    categories={["completed", "missed"]}
                    index="month"
                    colors={["#10b981", "#f43f5e"]}
                    valueFormatter={(value) => `${value}%`}
                    className="h-[300px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
              <CardDescription>Age distribution of registered patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={demographicsData}
                  categories={["count"]}
                  index="age"
                  colors={["#8b5cf6"]}
                  valueFormatter={(value) => `${value} patients`}
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder for other tabs */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Appointment analytics data loading...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Care Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Care quality metrics loading...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Staff performance data loading...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Financial data loading...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
