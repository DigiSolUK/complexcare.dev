"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileCheck, Plus, Star } from "lucide-react"
import { format, parseISO } from "date-fns"

interface Assessment {
  id: string
  title: string
  type: string
  status: string
  score?: number
  max_score?: number
  completed_date: string
  assessor_name?: string
  risk_level?: string
}

interface PatientAssessmentsSummaryProps {
  patientId: string
}

function PatientAssessmentsSummary({ patientId }: PatientAssessmentsSummaryProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/assessments?limit=3`)
        if (response.ok) {
          const data = await response.json()
          setAssessments(data)
        }
      } catch (error) {
        console.error("Error fetching assessments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssessments()
  }, [patientId])

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assessments</CardTitle>
          <CardDescription>Recent clinical assessments</CardDescription>
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
          <CardTitle>Assessments</CardTitle>
          <CardDescription>Recent clinical assessments</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Assessment
        </Button>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <div className="text-center py-6">
            <FileCheck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No assessments completed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{assessment.title}</h4>
                    {assessment.score && assessment.max_score && <Star className="h-3 w-3 text-yellow-500" />}
                  </div>
                  {assessment.risk_level && (
                    <Badge className={getRiskLevelColor(assessment.risk_level)}>{assessment.risk_level} Risk</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {assessment.type} - {format(parseISO(assessment.completed_date), "PPP")}
                </p>
                <div className="flex items-center justify-between">
                  {assessment.score && assessment.max_score && (
                    <span className="text-sm font-medium">
                      Score: {assessment.score}/{assessment.max_score}
                    </span>
                  )}
                  {assessment.assessor_name && (
                    <span className="text-xs text-muted-foreground">by {assessment.assessor_name}</span>
                  )}
                </div>
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

export default PatientAssessmentsSummary
