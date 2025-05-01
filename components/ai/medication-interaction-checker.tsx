"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderIcon, PillIcon, AlertTriangleIcon, XIcon, PlusIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function MedicationInteractionChecker() {
  const [medications, setMedications] = useState<string[]>([])
  const [currentMed, setCurrentMed] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const addMedication = () => {
    if (currentMed.trim() && !medications.includes(currentMed.trim())) {
      setMedications([...medications, currentMed.trim()])
      setCurrentMed("")
    }
  }

  const removeMedication = (med: string) => {
    setMedications(medications.filter((m) => m !== med))
  }

  const handleCheck = async () => {
    if (medications.length < 2) {
      setError("Please add at least two medications to check for interactions")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/medication-interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medications }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.text)
        setActiveTab("result")
      } else {
        setError(data.text || "Failed to check medication interactions")
      }
    } catch (error) {
      console.error("Error checking medication interactions:", error)
      setError("An error occurred while checking medication interactions")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to format the interaction results with color-coded severity
  const formatInteractionResults = (text: string) => {
    if (!text) return null

    // Split the text by sections
    const sections = text.split(/(?=\n#+\s|^#+\s|\n\*\*|\*\*)/gm)

    return sections.map((section, index) => {
      // Determine severity level
      const isSevere = /severe|high risk|contraindicated|dangerous/i.test(section)
      const isModerate = /moderate|medium risk|caution/i.test(section)
      const isMild = /mild|low risk|minor/i.test(section)

      let severityClass = ""
      let severityIcon = null

      if (isSevere) {
        severityClass = "bg-red-50 border-l-4 border-red-400 dark:bg-red-950/20 dark:border-red-800"
        severityIcon = <AlertTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
      } else if (isModerate) {
        severityClass = "bg-amber-50 border-l-4 border-amber-400 dark:bg-amber-950/20 dark:border-amber-800"
        severityIcon = <AlertTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      } else if (isMild) {
        severityClass = "bg-blue-50 border-l-4 border-blue-400 dark:bg-blue-950/20 dark:border-blue-800"
        severityIcon = <AlertTriangleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      } else {
        severityClass = "bg-gray-50 border-l-4 border-gray-400 dark:bg-gray-800/50 dark:border-gray-600"
      }

      return (
        <div key={index} className={`mb-4 p-3 rounded-md ${severityClass}`}>
          {severityIcon && (
            <div className="flex items-center gap-2 mb-2">
              {severityIcon}
              <span className="font-semibold">
                {isSevere ? "Severe Interaction" : isModerate ? "Moderate Interaction" : "Mild Interaction"}
              </span>
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
          <PillIcon className="h-5 w-5" />
          Medication Interaction Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Medications</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Interactions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter medication name"
                  value={currentMed}
                  onChange={(e) => setCurrentMed(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addMedication()
                    }
                  }}
                />
                <Button type="button" size="icon" onClick={addMedication} disabled={!currentMed.trim()}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[100px]">
                {medications.length > 0 ? (
                  medications.map((med) => (
                    <Badge key={med} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {med}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => removeMedication(med)}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground w-full text-center py-4">
                    Add medications to check for interactions
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleCheck} disabled={isLoading || medications.length < 2} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Checking Interactions...
                  </>
                ) : (
                  "Check Interactions"
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="result" className="mt-4">
            {result && <div className="bg-muted p-4 rounded-md min-h-[300px]">{formatInteractionResults(result)}</div>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
