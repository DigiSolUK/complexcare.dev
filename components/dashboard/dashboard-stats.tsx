import { Users, Calendar, ClipboardList, Heart, Activity, PoundSterling } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStatsProps {
  data: {
    patientCount: number
    patientGrowth: number
    appointmentsToday: number
    appointmentsPending: number
    carePlansActive: number
    carePlansReview: number
    staffCompliance: number
    certificationsExpiring: number
    tasksAssigned: number
    tasksCompleted: number
    outstandingInvoices: number
    overduePayments: number
  }
}

export function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.patientCount}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+{data.patientGrowth}%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-200 dark:border-cyan-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-cyan-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.appointmentsToday}</div>
          <p className="text-xs text-muted-foreground">{data.appointmentsPending} pending confirmation</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Care Plans</CardTitle>
          <Heart className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.carePlansActive}</div>
          <p className="text-xs text-muted-foreground">{data.carePlansReview} require review</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Staff Compliance</CardTitle>
          <Activity className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.staffCompliance}%</div>
          <p className="text-xs text-muted-foreground">{data.certificationsExpiring} certifications expiring</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Assigned</CardTitle>
          <ClipboardList className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.tasksAssigned}</div>
          <p className="text-xs text-muted-foreground">{data.tasksCompleted} completed today</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-200 dark:border-red-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Invoices</CardTitle>
          <PoundSterling className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">£{data.outstandingInvoices.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{data.overduePayments} overdue payments</p>
        </CardContent>
      </Card>
    </div>
  )
}

