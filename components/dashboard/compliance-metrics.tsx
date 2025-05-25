"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ComplianceMetricsProps {
  data?: {
    overall: number
    dbs: number
    training: number
    policies: number
    certifications: number
  }
  isLoading?: boolean
}

export function ComplianceMetrics({ data, isLoading = false }: ComplianceMetricsProps) {
  // Default data for when real data isn't available
  const defaultData = {
    overall: 87,
    dbs: 92,
    training: 85,
    policies: 94,
    certifications: 78,
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
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Metrics</CardTitle>
        <CardDescription>Regulatory and policy compliance status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Compliance</span>
            <span className={`text-sm font-bold ${getComplianceColor(metrics.overall)}`}>{metrics.overall}%</span>
          </div>
          <Progress value={metrics.overall} className={getComplianceProgressColor(metrics.overall)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">DBS Checks</span>
            <span className={`text-sm font-bold ${getComplianceColor(metrics.dbs)}`}>{metrics.dbs}%</span>
          </div>
          <Progress value={metrics.dbs} className={getComplianceProgressColor(metrics.dbs)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Staff Training</span>
            <span className={`text-sm font-bold ${getComplianceColor(metrics.training)}`}>{metrics.training}%</span>
          </div>
          <Progress value={metrics.training} className={getComplianceProgressColor(metrics.training)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Policy Adherence</span>
            <span className={`text-sm font-bold ${getComplianceColor(metrics.policies)}`}>{metrics.policies}%</span>
          </div>
          <Progress value={metrics.policies} className={getComplianceProgressColor(metrics.policies)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Certifications</span>
            <span className={`text-sm font-bold ${getComplianceColor(metrics.certifications)}`}>
              {metrics.certifications}%
            </span>
          </div>
          <Progress value={metrics.certifications} className={getComplianceProgressColor(metrics.certifications)} />
        </div>

        {!data && (
          <Alert variant="outline" className="mt-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>Showing demo data. Connect to compliance API for real metrics.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function getComplianceColor(value: number): string {
  if (value >= 90) return "text-green-600"
  if (value >= 80) return "text-amber-600"
  return "text-red-600"
}

function getComplianceProgressColor(value: number): string {
  if (value >= 90) return "bg-green-600"
  if (value >= 80) return "bg-amber-600"
  return "bg-red-600"
}
