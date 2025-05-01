"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderIcon, BarChart2Icon, TrendingUpIcon, AlertTriangleIcon } from "lucide-react"

export function PredictiveAnalytics() {
  const [patientData, setPatientData] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleAnalyze = async () => {
    if (!patientData.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/patient-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: patientData }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.text)
        setActiveTab("result")
      } else {
        setError(data.text || "Failed to analyze patient data")
      }
    } catch (error) {
      console.error("Error analyzing patient data:", error)
      setError("An error occurred while analyzing the patient data")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to format the analysis result with highlighted sections
  const formatAnalysisResult = (text: string) => {
    if (!text) return null

    // Split the text by common section headers
    const sections = text.split(/(?=\n#+\s|^#+\s|\n\*\*|\*\*)/gm)

    return sections.map((section, index) => {
      // Determine if this section is about risks or trends
      const isRiskSection = /risk|warning|caution|alert|concern/i.test(section)
      const isTrendSection = /trend|pattern|improvement|progress|decline/i.test(section)

      return (
        <div
          key={index}
          className={`mb-4 p-3 rounded-md ${
            isRiskSection
              ? "bg-red-50 border-l-4 border-red-400 dark:bg-red-950/20 dark:border-red-800"
              : isTrendSection
                ? "bg-blue-50 border-l-4 border-blue-400 dark:bg-blue-950/20 dark:border-blue-800"
                : "bg-gray-50 dark:bg-gray-800/50"
          }`}
        >
          {isRiskSection && (
            <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
              <AlertTriangleIcon className="h-5 w-5" />
              <span className="font-semibold">Potential Risk Identified</span>
            </div>
          )}
          {isTrendSection && (
            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
              <TrendingUpIcon className="h-5 w-5" />
              <span className="font-semibold">Trend Analysis</span>
            </div>
          )}
          <div className="whitespace-pre-line">{section}</div>
        </div>
      )
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2Icon className="h-5 w-5" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Patient Data</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Analysis Result
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Enter patient data including vital signs, lab results, medication history, and symptoms for AI
                  analysis.
                </p>
                <Textarea
                  placeholder="Enter patient data here... (e.g., Blood Pressure: 140/90, Heart Rate: 85, Glucose: 130 mg/dL, Medications: Lisinopril 10mg daily, Metformin 500mg twice daily, Symptoms: Fatigue, dizziness when standing)"
                  className="min-h-[250px]"
                  value={patientData}
                  onChange={(e) => setPatientData(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleAnalyze} disabled={isLoading || !patientData.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Patient Data"
                )}
              </Button>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          <TabsContent value="result" className="mt-4">
            {result && <div className="bg-muted p-4 rounded-md min-h-[300px]">{formatAnalysisResult(result)}</div>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
