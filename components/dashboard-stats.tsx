import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, ClipboardList, CreditCard } from "lucide-react"

interface DashboardStatsProps {
  patientCount?: number
  appointmentCount?: number
  taskCount?: number
  pendingTaskCount?: number
  completedTaskCount?: number
  revenue?: number
}

export function DashboardStats({
  patientCount = 1248,
  appointmentCount = 42,
  taskCount = 18,
  pendingTaskCount = 10,
  completedTaskCount = 8,
  revenue = 24780,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-blue-800 text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{patientCount.toLocaleString()}</div>
          <p className="text-xs text-blue-600">+12% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-purple-800 text-sm font-medium">Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{appointmentCount}</div>
          <p className="text-xs text-purple-600">Today's scheduled appointments</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-green-800 text-sm font-medium">Tasks</CardTitle>
          <ClipboardList className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{taskCount}</div>
          <p className="text-xs text-green-600">
            {completedTaskCount} completed, {pendingTaskCount} pending
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-orange-800 text-sm font-medium">Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">£{revenue.toLocaleString()}</div>
          <p className="text-xs text-orange-600">+8% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}
