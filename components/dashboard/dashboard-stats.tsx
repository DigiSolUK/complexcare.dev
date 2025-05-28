import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Calendar, ClipboardList, Activity } from "lucide-react"

interface DashboardStatsProps {
  data: any
  isLoading: boolean
}

export function DashboardStats({ data, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
    )
  }

  const stats = data?.stats || {
    totalPatients: 0,
    activePatients: 0,
    appointmentsToday: 0,
    pendingTasks: 0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold">{stats.totalPatients}</p>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">{stats.activePatients}</span> active
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{stats.appointmentsToday}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{stats.pendingTasks}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Patient Status</p>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold">{Math.round((stats.activePatients / stats.totalPatients) * 100)}%</p>
            <div className="text-xs text-muted-foreground">Active rate</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
