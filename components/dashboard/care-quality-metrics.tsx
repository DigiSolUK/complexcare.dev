"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface CareQualityData {
  patientSatisfaction: number
  carePlanAdherence: number
  readmissionRate: number
  incidentReports: number
  avgResponseTime: number
}

interface CareQualityMetricsProps {
  data?: CareQualityData
  isLoading?: boolean
}

export function CareQualityMetrics({ data, isLoading = false }: CareQualityMetricsProps) {
  // Default data for when real data isn't available
  const defaultData: CareQualityData = {
    patientSatisfaction: 92,
    carePlanAdherence: 87,
    readmissionRate: 4.2,
    incidentReports: 3,
    avgResponseTime: 18,
  }

  const metrics = data || defaultData

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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
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
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Patient Satisfaction</p>
            <p className="text-2xl font-bold text-green-600">{metrics.patientSatisfaction}%</p>
            <p className="text-xs text-muted-foreground">Based on feedback surveys</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Care Plan Adherence</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.carePlanAdherence}%</p>
            <p className="text-xs text-muted-foreground">Compliance with care plans</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Readmission Rate</p>
            <p className="text-2xl font-bold text-amber-600">{metrics.readmissionRate}%</p>
            <p className="text-xs text-muted-foreground">30-day readmissions</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Incident Reports</p>
            <p className="text-2xl font-bold text-red-600">{metrics.incidentReports}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
            <p className="text-2xl font-bold text-purple-600">{metrics.avgResponseTime} min</p>
            <p className="text-xs text-muted-foreground">For urgent requests</p>
          </div>
        </div>

        {!data && (
          <Alert variant="outline" className="mt-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>Showing demo data. Connect to quality API for real metrics.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
