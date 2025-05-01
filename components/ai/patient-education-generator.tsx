"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderIcon, BookOpen, DownloadIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type EducationLevel = "simple" | "moderate" | "detailed"
type ContentType = "condition" | "medication" | "procedure" | "lifestyle" | "prevention"

export function PatientEducationGenerator() {
  const [topic, setTopic] = useState("")
  const [contentType, setContentType] = useState<ContentType>("condition")
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("moderate")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to AI-powered education generator
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock education content
      const mockEducation = `
# ${topic.toUpperCase()}: Patient Education Guide

## What is ${topic}?
${topic} is a medical condition that affects many people. This guide will help you understand the condition, its causes, symptoms, and management options.

## Common Symptoms
- Symptom 1
- Symptom 2
- Symptom 3

## Treatment Options
There are several treatment options available for ${topic}, including:
1. Medication
2. Lifestyle changes
3. Regular monitoring

## When to Seek Medical Help
Contact your healthcare provider if you experience:
- Severe symptoms
- New or worsening symptoms
- Side effects from medications

## Prevention Tips
- Tip 1
- Tip 2
- Tip 3

This information is provided for educational purposes only and should not replace professional medical advice.
`

      setResult(mockEducation)
      setActiveTab("result")
    } catch (error) {
      console.error("Error generating patient education:", error)
      setError("An error occurred while generating patient education content")
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
    a.download = `${topic.toLowerCase().replace(/\s+/g, "-")}-patient-education.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Patient Education Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Content Settings</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Generated Content
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter condition, medication, or procedure"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="condition">Medical Condition</SelectItem>
                    <SelectItem value="medication">Medication Information</SelectItem>
                    <SelectItem value="procedure">Procedure Preparation</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle Recommendations</SelectItem>
                    <SelectItem value="prevention">Preventive Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education-level">Education Level</Label>
                <Select value={educationLevel} onValueChange={(value) => setEducationLevel(value as EducationLevel)}>
                  <SelectTrigger id="education-level">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple (Basic literacy)</SelectItem>
                    <SelectItem value="moderate">Moderate (Average literacy)</SelectItem>
                    <SelectItem value="detailed">Detailed (Advanced literacy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
                <Textarea id="additional-notes" placeholder="Enter any specific information to include" rows={3} />
              </div>

              <Button onClick={handleGenerate} disabled={isLoading || !topic.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Patient Education"
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
                  Download Education Material
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
