"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface ResourceData {
  staffUtilization: number
  appointmentUtilization: number
  equipmentUtilization: number
  facilityUtilization: number
  transportUtilization: number
  byDay: {
    day: string
    utilization: number
  }[]
}

interface ResourceUtilizationProps {
  data?: ResourceData
  isLoading?: boolean
}

export function ResourceUtilization({ data, isLoading = false }: ResourceUtilizationProps) {
  // Default data for when real data isn't available
  const defaultData: ResourceData = {
    staffUtilization: 78,
    appointmentUtilization: 82,
    equipmentUtilization: 65,
    facilityUtilization: 72,
    transportUtilization: 58,
    byDay: [
      { day: "Mon", utilization: 82 },
      { day: "Tue", utilization: 86 },
      { day: "Wed", utilization: 90 },
      { day: "Thu", utilization: 84 },
      { day: "Fri", utilization: 74 },
      { day: "Sat", utilization: 62 },
      { day: "Sun", utilization: 48 },
    ],
  }

  const resourceData = data || defaultData

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
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-6 w-[60px]" />
                </div>
              ))}
            </div>
            <Skeleton className="h-[150px] w-full" />
          </div>
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
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium text-muted-foreground">Staff</p>
              <p className="text-xl font-bold">{resourceData.staffUtilization}%</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium text-muted-foreground">Appointments</p>
              <p className="text-xl font-bold">{resourceData.appointmentUtilization}%</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium text-muted-foreground">Equipment</p>
              <p className="text-xl font-bold">{resourceData.equipmentUtilization}%</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium text-muted-foreground">Facilities</p>
              <p className="text-xl font-bold">{resourceData.facilityUtilization}%</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium text-muted-foreground">Transport</p>
              <p className="text-xl font-bold">{resourceData.transportUtilization}%</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Utilization by Day of Week</h4>
            <div className="flex h-[150px] items-end justify-between gap-2">
              {resourceData.byDay.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center">
                  <div className="w-full rounded-t bg-blue-500" style={{ height: `${day.utilization}%` }}></div>
                  <span className="mt-2 text-xs">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {!data && (
            <Alert variant="outline" className="mt-4">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>Showing demo data. Connect to resource API for real metrics.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
