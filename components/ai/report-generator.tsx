"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderIcon, FileTextIcon, DownloadIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type ReportType = "patient-summary" | "care-plan-progress" | "medication-review" | "treatment-outcome" | "compliance"

export function ReportGenerator() {
  const [reportData, setReportData] = useState("")
  const [reportType, setReportType] = useState<ReportType>("patient-summary")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleGenerate = async () => {
    if (!reportData.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/report-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: reportData, reportType }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.text)
        setActiveTab("result")
      } else {
        setError(data.text || "Failed to generate report")
      }
    } catch (error) {
      console.error("Error generating report:", error)
      setError("An error occurred while generating the report")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getReportTypeDescription = () => {
    switch (reportType) {
      case "patient-summary":
        return "A comprehensive overview of the patient's health status, medical history, and current care plan."
      case "care-plan-progress":
        return "An evaluation of the patient's progress against their care plan goals and objectives."
      case "medication-review":
        return "A detailed review of the patient's current medications, including effectiveness, side effects, and recommendations."
      case "treatment-outcome":
        return "An analysis of treatment outcomes, including effectiveness, complications, and future recommendations."
      case "compliance":
        return "An assessment of the patient's compliance with prescribed treatments, medications, and lifestyle recommendations."
      default:
        return ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Report Input</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Generated Report
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient-summary">Patient Summary</SelectItem>
                    <SelectItem value="care-plan-progress">Care Plan Progress</SelectItem>
                    <SelectItem value="medication-review">Medication Review</SelectItem>
                    <SelectItem value="treatment-outcome">Treatment Outcome</SelectItem>
                    <SelectItem value="compliance">Compliance Assessment</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">{getReportTypeDescription()}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-data">Report Data</Label>
                <Textarea
                  id="report-data"
                  placeholder="Enter patient data, observations, and relevant information for the report..."
                  className="min-h-[200px]"
                  value={reportData}
                  onChange={(e) => setReportData(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button onClick={handleGenerate} disabled={isLoading || !reportData.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          <TabsContent value="result" className="mt-4">
            {result && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-line">{result}</div>
                <Button onClick={handleDownload} className="w-full" variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
