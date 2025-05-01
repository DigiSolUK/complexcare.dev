import type React from "react"
import type { Metadata } from "next"
import { Download, FileText, Calendar, BarChart3, Users, ClipboardList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: "Reports",
  description: "Generate and download reports",
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download comprehensive reports</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange className="hidden md:flex" />
        </div>
      </div>

      <Tabs defaultValue="patient" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patient">Patient Reports</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Reports</TabsTrigger>
          <TabsTrigger value="operational">Operational Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="patient" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard
              title="Patient Demographics"
              description="Comprehensive breakdown of patient demographics including age, gender, and location."
              icon={<Users className="h-5 w-5" />}
            />
            <ReportCard
              title="Patient Activity"
              description="Summary of patient interactions, appointments, and engagement metrics."
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <ReportCard
              title="Care Plan Progress"
              description="Analysis of care plan completion rates and patient outcomes."
              icon={<ClipboardList className="h-5 w-5" />}
            />
            <ReportCard
              title="Medication Compliance"
              description="Report on patient medication adherence and prescription patterns."
              icon={<FileText className="h-5 w-5" />}
            />
            <ReportCard
              title="Patient Satisfaction"
              description="Analysis of patient feedback and satisfaction metrics."
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <ReportCard
              title="Patient Referrals"
              description="Summary of patient referral sources and conversion rates."
              icon={<Users className="h-5 w-5" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="clinical" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard
              title="Clinical Outcomes"
              description="Analysis of patient outcomes by condition, treatment, and care professional."
              icon={<ClipboardList className="h-5 w-5" />}
            />
            <ReportCard
              title="Treatment Efficacy"
              description="Evaluation of treatment protocols and their effectiveness."
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <ReportCard
              title="Readmission Analysis"
              description="Detailed analysis of patient readmissions and contributing factors."
              icon={<Users className="h-5 w-5" />}
            />
            <ReportCard
              title="Medication Analysis"
              description="Insights into medication usage, interactions, and effectiveness."
              icon={<FileText className="h-5 w-5" />}
            />
            <ReportCard
              title="Care Plan Effectiveness"
              description="Evaluation of care plan strategies and patient progress."
              icon={<ClipboardList className="h-5 w-5" />}
            />
            <ReportCard
              title="Clinical Risk Assessment"
              description="Identification of high-risk patients and intervention opportunities."
              icon={<BarChart3 className="h-5 w-5" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard
              title="Staff Productivity"
              description="Analysis of staff workload, productivity, and performance metrics."
              icon={<Users className="h-5 w-5" />}
            />
            <ReportCard
              title="Appointment Analysis"
              description="Insights into appointment scheduling, attendance, and utilization."
              icon={<Calendar className="h-5 w-5" />}
            />
            <ReportCard
              title="Task Completion"
              description="Summary of task assignment, completion rates, and efficiency."
              icon={<ClipboardList className="h-5 w-5" />}
            />
            <ReportCard
              title="Resource Utilization"
              description="Analysis of resource allocation and utilization across services."
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <ReportCard
              title="Document Management"
              description="Overview of document creation, access, and usage patterns."
              icon={<FileText className="h-5 w-5" />}
            />
            <ReportCard
              title="Operational Efficiency"
              description="Comprehensive analysis of operational workflows and bottlenecks."
              icon={<BarChart3 className="h-5 w-5" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard
              title="Revenue Analysis"
              description="Detailed breakdown of revenue streams, trends, and projections."
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <ReportCard
              title="Expense Report"
              description="Comprehensive analysis of operational expenses and cost centers."
              icon={<FileText className="h-5 w-5" />}
            />
            <ReportCard
              title="Billing Efficiency"
              description="Insights into billing cycles, collection rates, and outstanding balances."
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <ReportCard
              title="Financial Forecasting"
              description="Projections of future financial performance based on historical data."
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <ReportCard
              title="Service Profitability"
              description="Analysis of profitability by service type, location, and patient segment."
              icon={<FileText className="h-5 w-5" />}
            />
            <ReportCard
              title="Payment Analysis"
              description="Breakdown of payment methods, timing, and processing efficiency."
              icon={<BarChart3 className="h-5 w-5" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create customized reports by selecting data sources, filters, and output formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input id="report-name" placeholder="Enter report name" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="data-source">Data Source</Label>
                  <Select>
                    <SelectTrigger id="data-source">
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patients">Patients</SelectItem>
                      <SelectItem value="appointments">Appointments</SelectItem>
                      <SelectItem value="care-plans">Care Plans</SelectItem>
                      <SelectItem value="medications">Medications</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                      <SelectItem value="finances">Finances</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="report-fields">Fields to Include</Label>
                  <Select>
                    <SelectTrigger id="report-fields">
                      <SelectValue placeholder="Select fields" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fields</SelectItem>
                      <SelectItem value="basic">Basic Information</SelectItem>
                      <SelectItem value="detailed">Detailed Information</SelectItem>
                      <SelectItem value="summary">Summary Only</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="report-format">Output Format</Label>
                  <Select>
                    <SelectTrigger id="report-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="html">HTML Report</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button>Generate Custom Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ReportCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function ReportCard({ title, description, icon }: ReportCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-bold">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-1 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
