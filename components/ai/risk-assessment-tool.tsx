"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, ArrowRight, BarChart3 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function RiskAssessmentTool() {
  const [patientId, setPatientId] = useState("")
  const [assessmentType, setAssessmentType] = useState("readmission")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<null | {
    riskScore: number
    riskLevel: "Low" | "Moderate" | "High" | "Critical"
    factors: string[]
    recommendations: string[]
  }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // This would be replaced with actual AI model results
      const mockResults = {
        riskScore: Math.floor(Math.random() * 100),
        riskLevel: ["Low", "Moderate", "High", "Critical"][Math.floor(Math.random() * 4)] as
          | "Low"
          | "Moderate"
          | "High"
          | "Critical",
        factors: [
          "Recent hospitalization within 30 days",
          "Multiple chronic conditions",
          "Medication non-adherence history",
          "Limited social support",
        ],
        recommendations: [
          "Increase follow-up frequency to weekly",
          "Implement medication adherence program",
          "Arrange social worker consultation",
          "Consider home health services",
        ],
      }

      setResults(mockResults)
      setLoading(false)

      // Log usage to analytics
      try {
        fetch("/api/log-ai-tool-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolName: "risk-assessment",
            patientId,
            assessmentType,
            result: mockResults.riskLevel,
          }),
        })
      } catch (error) {
        console.error("Failed to log tool usage:", error)

        // Log the error to the analytics table
        fetch("/api/log-ai-tool-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolName: "risk-assessment-error",
            input_text: JSON.stringify({ patientId, assessmentType }),
            output_text: null,
            error_message: error instanceof Error ? error.message : String(error),
            success: false,
          }),
        }).catch((e) => console.error("Failed to log error:", e))
      }
    }, 2000)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500"
      case "Moderate":
        return "bg-yellow-500"
      case "High":
        return "bg-orange-500"
      case "Critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Patient Risk Assessment</CardTitle>
          <CardDescription>
            Predict patient risks using AI analysis of clinical data, demographics, and social determinants of health.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-id">Patient ID or NHS Number</Label>
              <Textarea
                id="patient-id"
                placeholder="Enter patient identifier"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessment-type">Assessment Type</Label>
              <Select value={assessmentType} onValueChange={setAssessmentType}>
                <SelectTrigger id="assessment-type">
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="readmission">Readmission Risk</SelectItem>
                  <SelectItem value="deterioration">Clinical Deterioration</SelectItem>
                  <SelectItem value="falls">Falls Risk</SelectItem>
                  <SelectItem value="social">Social Vulnerability</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Context (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant clinical notes or observations"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading || !patientId} className="w-full">
            {loading ? "Analyzing..." : "Generate Risk Assessment"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>AI-generated risk profile and recommended interventions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!results && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mb-4" />
              <p>Complete the form and generate an assessment to see results</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Progress value={45} className="w-full mb-4" />
              <p className="text-muted-foreground">Analyzing patient data and generating risk assessment...</p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Risk Score</Label>
                  <span className="font-bold">{results.riskScore}/100</span>
                </div>
                <Progress value={results.riskScore} className="w-full" />
              </div>

              <div className="space-y-2">
                <Label>Risk Level</Label>
                <div
                  className={`px-4 py-2 rounded-md font-medium flex items-center ${
                    results.riskLevel === "High" || results.riskLevel === "Critical" ? "text-white" : ""
                  } ${getRiskColor(results.riskLevel)}`}
                >
                  {(results.riskLevel === "High" || results.riskLevel === "Critical") && (
                    <AlertTriangle className="mr-2 h-4 w-4" />
                  )}
                  {results.riskLevel}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contributing Factors</Label>
                <ul className="list-disc pl-5 space-y-1">
                  {results.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <Label>Recommended Interventions</Label>
                <ul className="list-disc pl-5 space-y-1">
                  {results.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
