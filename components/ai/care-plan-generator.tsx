"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderIcon, FileHeartIcon, DownloadIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function CarePlanGenerator() {
  const [patientId, setPatientId] = useState("")
  const [tenantId, setTenantId] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleGenerate = async () => {
    if (!patientId || !tenantId) {
      setError("Patient ID and Tenant ID are required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/care-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId, tenantId }),
      })

      const data = await response.json()

      if (response.ok && data.result?.success) {
        setResult(data.result.text)
        setActiveTab("result")
      } else {
        setError(data.error || "Failed to generate care plan")
      }
    } catch (error) {
      console.error("Error generating care plan:", error)
      setError("An error occurred while generating the care plan")
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
    a.download = `care-plan-${patientId}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Function to format the care plan with sections
  const formatCarePlan = (text: string) => {
    if (!text) return null

    // Split the text by sections
    const sections = text.split(/(?=\n#+\s|^#+\s|\n\d\.\s|^\d\.\s)/gm)

    return sections.map((section, index) => {
      // Determine section type
      const isGoals = /goals|objectives|aims/i.test(section)
      const isInterventions = /interventions|treatments|therapy|actions/i.test(section)
      const isMonitoring = /monitoring|assessment|evaluation|measure/i.test(section)
      const isEducation = /education|teaching|learning|instruct/i.test(section)
      const isOutcomes = /outcomes|results|expectations/i.test(section)
      const isTimeline = /timeline|schedule|review|follow-up/i.test(section)

      let sectionClass = "bg-gray-50 dark:bg-gray-800/50"

      if (isGoals) {
        sectionClass = "bg-blue-50 dark:bg-blue-950/20"
      } else if (isInterventions) {
        sectionClass = "bg-purple-50 dark:bg-purple-950/20"
      } else if (isMonitoring) {
        sectionClass = "bg-amber-50 dark:bg-amber-950/20"
      } else if (isEducation) {
        sectionClass = "bg-green-50 dark:bg-green-950/20"
      } else if (isOutcomes) {
        sectionClass = "bg-cyan-50 dark:bg-cyan-950/20"
      } else if (isTimeline) {
        sectionClass = "bg-pink-50 dark:bg-pink-950/20"
      }

      return (
        <div key={index} className={`mb-4 p-3 rounded-md ${sectionClass}`}>
          <div className="whitespace-pre-line">{section}</div>
        </div>
      )
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileHeartIcon className="h-5 w-5" />
          AI Care Plan Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Patient Information</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Generated Care Plan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant-id">Tenant ID</Label>
                <Input
                  id="tenant-id"
                  placeholder="Enter tenant ID"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input
                  id="patient-id"
                  placeholder="Enter patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleGenerate} disabled={isLoading || !patientId || !tenantId} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Generating Care Plan...
                  </>
                ) : (
                  "Generate Care Plan"
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="result" className="mt-4">
            {result && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md min-h-[300px]">{formatCarePlan(result)}</div>
                <Button onClick={handleDownload} className="w-full" variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download Care Plan
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
