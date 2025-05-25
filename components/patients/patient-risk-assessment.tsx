"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Plus, Shield } from "lucide-react"
import { format, parseISO } from "date-fns"

interface RiskAssessment {
  id: string
  title: string
  risk_level: "low" | "medium" | "high" | "critical"
  assessment_date: string
  next_review_date?: string
  assessed_by_name?: string
  notes?: string
}

interface PatientRiskAssessmentProps {
  patientId: string
}

export function PatientRiskAssessment({ patientId }: PatientRiskAssessmentProps) {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/risk-assessments?limit=3`)
        if (response.ok) {
          const data = await response.json()
          setAssessments(data)
        }
      } catch (error) {
        console.error("Error fetching risk assessments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssessments()
  }, [patientId])

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Patient risk evaluations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Patient risk evaluations</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Assessment
        </Button>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <div className="text-center py-6">
            <Shield className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No risk assessments recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{assessment.title}</h4>
                    {assessment.risk_level === "high" || assessment.risk_level === "critical" ? (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    ) : null}
                  </div>
                  <Badge className={getRiskLevelColor(assessment.risk_level)}>
                    {assessment.risk_level.charAt(0).toUpperCase() + assessment.risk_level.slice(1)} Risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Assessed on {format(parseISO(assessment.assessment_date), "PPP")}
                  {assessment.assessed_by_name && ` by ${assessment.assessed_by_name}`}
                </p>
                {assessment.next_review_date && (
                  <p className="text-xs text-muted-foreground">
                    Next review: {format(parseISO(assessment.next_review_date), "PPP")}
                  </p>
                )}
                {assessment.notes && <p className="text-sm mt-1 line-clamp-2">{assessment.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Assessments
        </Button>
      </CardFooter>
    </Card>
  )
}
