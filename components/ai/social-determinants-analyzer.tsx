"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Home, Briefcase, Users, Utensils, PoundSterlingIcon as Pound, GraduationCap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export function SocialDeterminantsAnalyzer() {
  const [patientId, setPatientId] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<null | {
    housing: {
      status: string
      risk: "Low" | "Moderate" | "High"
      notes: string[]
    }
    employment: {
      status: string
      risk: "Low" | "Moderate" | "High"
      notes: string[]
    }
    social: {
      status: string
      risk: "Low" | "Moderate" | "High"
      notes: string[]
    }
    nutrition: {
      status: string
      risk: "Low" | "Moderate" | "High"
      notes: string[]
    }
    financial: {
      status: string
      risk: "Low" | "Moderate" | "High"
      notes: string[]
    }
    education: {
      status: string
      risk: "Low" | "Moderate" | "High"
      notes: string[]
    }
    interventions: string[]
  }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // This would be replaced with actual AI model results
      const mockResults = {
        housing: {
          status: "Stable rental accommodation",
          risk: "Low" as const,
          notes: ["No immediate housing concerns", "Rent is affordable relative to income"],
        },
        employment: {
          status: "Part-time employment, unstable hours",
          risk: "Moderate" as const,
          notes: ["Variable income affects ability to plan", "Skills mismatch with local job market"],
        },
        social: {
          status: "Limited social support network",
          risk: "High" as const,
          notes: ["Lives alone with few local connections", "Reports feelings of isolation"],
        },
        nutrition: {
          status: "Inconsistent access to nutritious food",
          risk: "Moderate" as const,
          notes: ["Limited budget for food", "Relies on convenience foods"],
        },
        financial: {
          status: "Financial strain, no savings",
          risk: "High" as const,
          notes: ["Difficulty affording medications", "Outstanding medical bills"],
        },
        education: {
          status: "Secondary education completed",
          risk: "Low" as const,
          notes: ["Basic health literacy", "Able to understand medical instructions"],
        },
        interventions: [
          "Refer to social worker for benefits assessment",
          "Connect with local community support groups",
          "Provide information on food assistance programs",
          "Explore medication assistance programs",
          "Schedule follow-up with care coordinator",
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
            toolName: "social-determinants-analyzer",
            patientId,
          }),
        })
      } catch (error) {
        console.error("Failed to log tool usage:", error)
      }
    }, 2000)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getRiskIcon = (category: string) => {
    switch (category) {
      case "housing":
        return <Home className="h-4 w-4" />
      case "employment":
        return <Briefcase className="h-4 w-4" />
      case "social":
        return <Users className="h-4 w-4" />
      case "nutrition":
        return <Utensils className="h-4 w-4" />
      case "financial":
        return <Pound className="h-4 w-4" />
      case "education":
        return <GraduationCap className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Social Determinants of Health</CardTitle>
          <CardDescription>
            Analyze social factors affecting patient health outcomes and identify intervention opportunities
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
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant social history or observations"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Sources to Include</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="source-ehr" defaultChecked />
                  <label htmlFor="source-ehr" className="text-sm">
                    Electronic Health Record
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="source-assessments" defaultChecked />
                  <label htmlFor="source-assessments" className="text-sm">
                    Previous Assessments
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="source-questionnaires" defaultChecked />
                  <label htmlFor="source-questionnaires" className="text-sm">
                    Patient Questionnaires
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="source-notes" defaultChecked />
                  <label htmlFor="source-notes" className="text-sm">
                    Clinical Notes
                  </label>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading || !patientId} className="w-full">
            {loading ? "Analyzing..." : "Analyze Social Determinants"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            AI-generated assessment of social determinants and recommended interventions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!results && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <p>Complete the form and generate an analysis to see results</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Progress value={45} className="w-full mb-4" />
              <p className="text-muted-foreground">Analyzing patient data and social determinants...</p>
            </div>
          )}

          {results && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="interventions">Interventions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {Object.entries(results)
                  .filter(([key]) => key !== "interventions")
                  .map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRiskIcon(key)}
                          <Label className="capitalize">{key}</Label>
                        </div>
                        <Badge className={getRiskColor(value.risk)}>{value.risk} Risk</Badge>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="font-medium">{value.status}</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                          {value.notes.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="interventions">
                <div className="space-y-2">
                  <Label>Recommended Interventions</Label>
                  <div className="bg-muted p-3 rounded-md">
                    <ul className="space-y-2">
                      {results.interventions.map((intervention, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Checkbox id={`intervention-${i}`} />
                          <label htmlFor={`intervention-${i}`} className="text-sm">
                            {intervention}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full">Add to Care Plan</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
