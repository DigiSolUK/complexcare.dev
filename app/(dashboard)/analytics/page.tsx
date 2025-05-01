import type { Metadata } from "next"
import { Download, BarChart3, LineChart, PieChart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import {
  PatientAnalytics,
  AppointmentAnalytics,
  ClinicalOutcomeAnalytics,
  StaffPerformanceAnalytics,
  FinancialAnalytics,
} from "@/components/analytics/charts"

export const metadata: Metadata = {
  title: "Analytics",
  description: "Advanced analytics and reporting",
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analytics and reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange className="hidden md:flex" />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">246</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patient Satisfaction</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Care Plan Completion</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Missed Appointments</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-1.5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patient" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patient">Patient Analytics</TabsTrigger>
          <TabsTrigger value="appointment">Appointment Analytics</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Outcomes</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="patient" className="space-y-4">
          <PatientAnalytics />
        </TabsContent>

        <TabsContent value="appointment" className="space-y-4">
          <AppointmentAnalytics />
        </TabsContent>

        <TabsContent value="clinical" className="space-y-4">
          <ClinicalOutcomeAnalytics />
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffPerformanceAnalytics />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialAnalytics />
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">AI-Driven Insights</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle>Patient Engagement</CardTitle>
              <CardDescription>Based on patient activity patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Patients with chronic conditions show higher engagement when assigned weekly check-ins compared to
                monthly ones. Consider adjusting care plans accordingly.
              </p>
              <Button variant="link" className="px-0 mt-2">
                View Detailed Analysis <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle>Risk Stratification</CardTitle>
              <CardDescription>Based on clinical data trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                15 patients currently show elevated risk scores for readmission. Early intervention recommended for
                patients with IDs: P042, P078, P103.
              </p>
              <Button variant="link" className="px-0 mt-2">
                View At-Risk Patients <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle>Resource Optimization</CardTitle>
              <CardDescription>Based on operational data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Wednesday mornings show consistently low appointment utilization. Consider reallocating staff or adding
                specialty appointments in this time slot.
              </p>
              <Button variant="link" className="px-0 mt-2">
                View Schedule Analysis <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
