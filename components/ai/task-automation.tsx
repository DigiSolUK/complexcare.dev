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

type TaskType = "appointment-scheduling" | "follow-up-reminders" | "medication-reminders"

export function TaskAutomation() {
  const [taskDescription, setTaskDescription] = useState("")
  const [taskType, setTaskType] = useState<TaskType>("appointment-scheduling")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleGenerate = async () => {
    if (!taskDescription.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/report-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: taskDescription, reportType: taskType }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.text)
        setActiveTab("result")
      } else {
        setError(data.text || "Failed to generate task automation script")
      }
    } catch (error) {
      console.error("Error generating task automation script:", error)
      setError("An error occurred while generating the task automation script")
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
    a.download = `${taskType}-automation-script-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTaskTypeDescription = () => {
    switch (taskType) {
      case "appointment-scheduling":
        return "Automate appointment scheduling and reminders for patients."
      case "follow-up-reminders":
        return "Automate follow-up reminders for patients after appointments or treatments."
      case "medication-reminders":
        return "Automate medication reminders for patients to improve adherence."
      default:
        return ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          AI-Driven Task Automation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Task Input</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Generated Script
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-type">Task Type</Label>
                <Select value={taskType} onValueChange={(value) => setTaskType(value as TaskType)}>
                  <SelectTrigger id="task-type">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment-scheduling">Appointment Scheduling</SelectItem>
                    <SelectItem value="follow-up-reminders">Follow-up Reminders</SelectItem>
                    <SelectItem value="medication-reminders">Medication Reminders</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">{getTaskTypeDescription()}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">Task Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Enter a detailed description of the task to automate..."
                  className="min-h-[200px]"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button onClick={handleGenerate} disabled={isLoading || !taskDescription.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Automation Script"
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
            {result && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-line">{result}</div>
                <Button onClick={handleDownload} className="w-full" variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download Script
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
