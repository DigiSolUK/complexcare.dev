"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, Plus } from "lucide-react"
import { format, parseISO } from "date-fns"

interface RiskAssessment {
  id: string
  risk_level: "low" | "medium" | "high" | "critical"
  category: string
  assessment_date: string
  assessed_by: string
  next_review_date?: string
  notes?: string
}

interface PatientRiskAssessmentProps {
  patientId: string
}

export function PatientRiskAssessment({ patientId }: PatientRiskAssessmentProps) {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRiskAssessments = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        // This would be a real API call in production
        // const response = await fetch(`/api/patients/${patientId}/risk-assessments?limit=3`)
        // if (response.ok) {
        //   const data = await response.json()
        //   setAssessments(data)
        // }

        // Mock data for now
        setTimeout(() => {
          setAssessments([
            {
              id: "1",
              risk_level: "medium",
              category: "Fall Risk",
              assessment_date: new Date().toISOString(),
              assessed_by: "Nurse Williams",
              next_review_date: new Date(Date.now() + 30 * 86400000).toISOString(),
              notes: "Patient has history of falls. Mobility aids recommended.",
            },
            {
              id: "2",
              risk_level: "low",
              category: "Pressure Ulcer",
              assessment_date: new Date(Date.now() - 15 * 86400000).toISOString(),
              assessed_by: "Dr. Sarah Johnson",
              next_review_date: new Date(Date.now() + 60 * 86400000).toISOString(),
              notes: "No current pressure areas. Regular position changes advised.",
            },
            {
              id: "3",
              risk_level: "high",
              category: "Medication Compliance",
              assessment_date: new Date(Date.now() - 7 * 86400000).toISOString(),
              assessed_by: "Pharmacist Thompson",
              next_review_date: new Date(Date.now() + 14 * 86400000).toISOString(),
              notes: "Patient has difficulty remembering medication schedule. Consider dosette box.",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching risk assessments:", error)
        setIsLoading(false)
      }
    }

    fetchRiskAssessments()
  }, [patientId])

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High Risk</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical Risk</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <ShieldCheck className="h-4 w-4 text-green-500" />
      case "medium":
        return <Shield className="h-4 w-4 text-yellow-500" />
      case "high":
        return <ShieldAlert className="h-4 w-4 text-orange-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessments</CardTitle>
          <CardDescription>Patient risk evaluations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
          <CardTitle>Risk Assessments</CardTitle>
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
                    {getRiskIcon(assessment.risk_level)}
                    <h4 className="font-medium text-sm">{assessment.category}</h4>
                  </div>
                  {getRiskLevelBadge(assessment.risk_level)}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Assessed on {format(parseISO(assessment.assessment_date), "PPP")} by {assessment.assessed_by}
                </p>
                {assessment.notes && <p className="text-sm line-clamp-1 mb-1">{assessment.notes}</p>}
                {assessment.next_review_date && (
                  <p className="text-xs text-muted-foreground">
                    Next review: {format(parseISO(assessment.next_review_date), "PPP")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Risk Assessments
        </Button>
      </CardFooter>
    </Card>
  )
}
