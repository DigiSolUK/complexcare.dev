"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

interface ResourceUtilizationProps {
  isLoading?: boolean
}

export function ResourceUtilization({ isLoading = false }: ResourceUtilizationProps) {
  // In a real implementation, this data would come from an API
  const utilizationData = {
    staff: 82,
    appointments: 76,
    equipment: 68,
    facilities: 91,
    transport: 64,
    dayOfWeek: [
      { day: "Mon", utilization: 85 },
      { day: "Tue", utilization: 92 },
      { day: "Wed", utilization: 88 },
      { day: "Thu", utilization: 90 },
      { day: "Fri", utilization: 86 },
      { day: "Sat", utilization: 62 },
      { day: "Sun", utilization: 45 },
    ],
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[180px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Utilization</CardTitle>
        <CardDescription>Efficiency metrics for resource allocation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Staff</span>
              <span className="text-sm font-medium">{utilizationData.staff}%</span>
            </div>
            <Progress value={utilizationData.staff} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Appointments</span>
              <span className="text-sm font-medium">{utilizationData.appointments}%</span>
            </div>
            <Progress value={utilizationData.appointments} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Equipment</span>
              <span className="text-sm font-medium">{utilizationData.equipment}%</span>
            </div>
            <Progress value={utilizationData.equipment} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Facilities</span>
              <span className="text-sm font-medium">{utilizationData.facilities}%</span>
            </div>
            <Progress value={utilizationData.facilities} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Transport</span>
              <span className="text-sm font-medium">{utilizationData.transport}%</span>
            </div>
            <Progress value={utilizationData.transport} className="h-2" />
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium">Day of Week Utilization</h4>
          <div className="flex h-16 items-end justify-between">
            {utilizationData.dayOfWeek.map((day) => (
              <div key={day.day} className="flex flex-col items-center">
                <div className="w-8 bg-primary" style={{ height: `${day.utilization * 0.16}px` }} />
                <div className="mt-2 text-xs">{day.day}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
