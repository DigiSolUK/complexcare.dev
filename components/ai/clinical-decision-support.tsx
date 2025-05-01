"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Brain, RefreshCw } from "lucide-react"
import type { Patient } from "@/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ClinicalDecisionSupportProps {
  patient: Patient
  tenantId: string
}

export function ClinicalDecisionSupport({ patient, tenantId }: ClinicalDecisionSupportProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/clinical-decision-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: patient.id,
          tenantId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch clinical decision support")
      }

      const data = await response.json()
      setRecommendations(data.result.text)
    } catch (err) {
      setError("Failed to generate clinical recommendations. Please try again.")
      console.error("Error fetching clinical decision support:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Don't auto-fetch on component mount to avoid unnecessary API calls
    // User must click the button to generate recommendations
  }, [])

  const formatRecommendations = (text: string) => {
    // Split by numbered sections and convert to HTML
    return text.split(/\n(?=\d\.\s)/).map((section, index) => {
      // Further split each section into title and content
      const [title, ...content] = section.split("\n")
      return (
        <div key={index} className="mb-4">
          <h3 className="font-semibold text-md">{title}</h3>
          <div className="mt-1">
            {content.map((line, i) => (
              <p key={i} className="text-sm">
                {line}
              </p>
            ))}
          </div>
        </div>
      )
    })
  }

  return (
    <Card className="h-full">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Clinical Decision Support</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRecommendations} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : recommendations ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            ) : (
              "Generate Insights"
            )}
          </Button>
        </div>
        <CardDescription>AI-powered clinical insights and recommendations based on patient data</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : recommendations ? (
          <div className="prose prose-sm max-w-none">{formatRecommendations(recommendations)}</div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Brain className="mb-2 h-12 w-12 opacity-20" />
            <p>Click the button above to generate clinical insights for this patient</p>
          </div>
        )}
      </CardContent>
      {recommendations && (
        <CardFooter className="border-t bg-muted/20 px-6 py-3 text-xs text-muted-foreground">
          AI-generated insights should be reviewed by qualified healthcare professionals
        </CardFooter>
      )}
    </Card>
  )
}
