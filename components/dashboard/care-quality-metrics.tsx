"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface CareQualityMetricsProps {
  isLoading?: boolean
}

export function CareQualityMetrics({ isLoading = false }: CareQualityMetricsProps) {
  // In a real implementation, this data would come from an API
  const qualityData = {
    patientSatisfaction: 92,
    carePlanAdherence: 87,
    readmissionRate: 4.2,
    incidentReports: 3,
    responseTime: 18, // minutes
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
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Quality Metrics</CardTitle>
        <CardDescription>Key indicators of care quality performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Patient Satisfaction</h4>
            <div className="flex items-center justify-between">
              <Progress value={qualityData.patientSatisfaction} className="h-2" />
              <span className="ml-2 text-sm font-medium">{qualityData.patientSatisfaction}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Based on patient feedback surveys</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Care Plan Adherence</h4>
            <div className="flex items-center justify-between">
              <Progress value={qualityData.carePlanAdherence} className="h-2" />
              <span className="ml-2 text-sm font-medium">{qualityData.carePlanAdherence}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Percentage of care plans followed correctly</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Readmission Rate</h4>
            <div className="flex items-center justify-between">
              <Progress value={qualityData.readmissionRate * 10} className="h-2" />
              <span className="ml-2 text-sm font-medium">{qualityData.readmissionRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground">30-day readmission percentage</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Incident Reports</h4>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{qualityData.incidentReports}</div>
            </div>
            <p className="text-xs text-muted-foreground">Reports filed this month</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Average Response Time</h4>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{qualityData.responseTime} min</div>
            </div>
            <p className="text-xs text-muted-foreground">Time to respond to patient requests</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
