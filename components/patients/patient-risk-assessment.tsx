"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Shield, Plus } from "lucide-react"
import { format, parseISO } from "date-fns"

interface RiskFactor {
  id: string
  name: string
  level: "low" | "medium" | "high" | "critical"
  description: string
  identified_at: string
  identified_by: string
  mitigation_plan?: string
}

interface PatientRiskAssessmentProps {
  patientId: string
}

export function PatientRiskAssessment({ patientId }: PatientRiskAssessmentProps) {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRiskFactors = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        // This would be replaced with a real API call
        // const response = await fetch(`/api/patients/${patientId}/risk-assessment`)
        // const data = await response.json()

        // Mock data for now
        const mockRiskFactors = [
          {
            id: "1",
            name: "Fall Risk",
            level: "high",
            description: "Patient has history of falls and mobility issues",
            identified_at: new Date().toISOString(),
            identified_by: "Dr. Sarah Johnson",
            mitigation_plan: "Mobility aids, home assessment, physical therapy",
          },
          {
            id: "2",
            name: "Medication Interaction",
            level: "medium",
            description: "Potential interaction between current medications",
            identified_at: new Date(Date.now() - 86400000).toISOString(),
            identified_by: "Pharmacist",
            mitigation_plan: "Medication review scheduled",
          },
          {
            id: "3",
            name: "Cognitive Decline",
            level: "low",
            description: "Early signs of mild cognitive impairment",
            identified_at: new Date(Date.now() - 172800000).toISOString(),
            identified_by: "Neurologist",
            mitigation_plan: "Cognitive assessment in 3 months",
          },
        ] as RiskFactor[]

        setTimeout(() => {
          setRiskFactors(mockRiskFactors)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching risk factors:", error)
        setIsLoading(false)
      }
    }

    fetchRiskFactors()
  }, [patientId])

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-blue-100 text-blue-800"
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
          <CardDescription>Identified risk factors and mitigation plans</CardDescription>
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
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Identified risk factors and mitigation plans</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Risk Factor
        </Button>
      </CardHeader>
      <CardContent>
        {riskFactors.length === 0 ? (
          <div className="text-center py-6">
            <Shield className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No risk factors identified</p>
          </div>
        ) : (
          <div className="space-y-4">
            {riskFactors.map((risk) => (
              <div key={risk.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 ${risk.level === "high" || risk.level === "critical" ? "text-red-500" : "text-yellow-500"}`}
                    />
                    <h4 className="font-medium text-sm">{risk.name}</h4>
                  </div>
                  <Badge className={getRiskLevelColor(risk.level)}>{risk.level}</Badge>
                </div>
                <p className="text-sm mt-1">{risk.description}</p>
                {risk.mitigation_plan && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground">Mitigation Plan:</p>
                    <p className="text-sm">{risk.mitigation_plan}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Identified on {format(parseISO(risk.identified_at), "PPP")} by {risk.identified_by}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Full Risk Assessment
        </Button>
      </CardFooter>
    </Card>
  )
}
