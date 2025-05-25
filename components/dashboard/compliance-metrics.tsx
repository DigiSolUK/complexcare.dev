"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface ComplianceMetricsProps {
  isLoading?: boolean
}

export function ComplianceMetrics({ isLoading = false }: ComplianceMetricsProps) {
  // In a real implementation, this data would come from an API
  const complianceData = {
    overall: 87,
    dbsChecks: 92,
    staffTraining: 85,
    policyAdherence: 90,
    certifications: 82,
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
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[40px]" />
              </div>
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
        <CardDescription>Regulatory and policy compliance overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Overall Compliance</span>
            <span className="text-sm font-medium">{complianceData.overall}%</span>
          </div>
          <Progress value={complianceData.overall} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">DBS Checks</span>
            <span className="text-sm">{complianceData.dbsChecks}%</span>
          </div>
          <Progress value={complianceData.dbsChecks} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Staff Training</span>
            <span className="text-sm">{complianceData.staffTraining}%</span>
          </div>
          <Progress value={complianceData.staffTraining} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Policy Adherence</span>
            <span className="text-sm">{complianceData.policyAdherence}%</span>
          </div>
          <Progress value={complianceData.policyAdherence} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Certifications</span>
            <span className="text-sm">{complianceData.certifications}%</span>
          </div>
          <Progress value={complianceData.certifications} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
