"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Search, Stethoscope } from "lucide-react"
import { getClinicalDecisionSupport } from "@/lib/ai/groq-client"

export default function ClinicalDecisionSupportPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [queryType, setQueryType] = useState<string>("symptoms")

  // Form states
  const [symptoms, setSymptoms] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [patientGender, setPatientGender] = useState("")
  const [medicalHistory, setMedicalHistory] = useState("")
  const [medications, setMedications] = useState("")
  const [customQuery, setCustomQuery] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let prompt = ""

      if (queryType === "symptoms") {
        prompt = `Patient presents with the following symptoms: ${symptoms}. `
        if (patientAge) prompt += `Age: ${patientAge}. `
        if (patientGender) prompt += `Gender: ${patientGender}. `
        if (medicalHistory) prompt += `Medical history: ${medicalHistory}. `
        if (medications) prompt += `Current medications: ${medications}. `

        prompt += "Provide potential diagnoses, recommended tests, and next steps."
      } else {
        prompt = customQuery
      }

      const patientData = {
        symptoms,
        date_of_birth: patientAge
          ? new Date(new Date().setFullYear(new Date().getFullYear() - Number.parseInt(patientAge))).toISOString()
          : undefined,
        gender: patientGender,
        medical_history: medicalHistory,
        medications: medications,
      }

      const response = await getClinicalDecisionSupport(patientData)

      if (response.success) {
        setResult(response.text)
      } else {
        setResult("Failed to generate clinical decision support. Please try again.")
      }
    } catch (error) {
      console.error("Error generating clinical decision support:", error)
      setResult("An error occurred while generating clinical decision support.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Clinical Decision Support</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Query Parameters</CardTitle>
              <CardDescription>Enter patient information to receive clinical decision support</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="symptoms" onValueChange={(value) => setQueryType(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="symptoms">Structured</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>

                  <TabsContent value="symptoms" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label htmlFor="symptoms" className="text-sm font-medium">
                        Symptoms
                      </label>
                      <Textarea
                        id="symptoms"
                        placeholder="Enter patient symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="age" className="text-sm font-medium">
                          Age
                        </label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Age"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="gender" className="text-sm font-medium">
                          Gender
                        </label>
                        <Select value={patientGender} onValueChange={setPatientGender}>
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="medical-history" className="text-sm font-medium">
                        Medical History
                      </label>
                      <Textarea
                        id="medical-history"
                        placeholder="Relevant medical history"
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="medications" className="text-sm font-medium">
                        Current Medications
                      </label>
                      <Textarea
                        id="medications"
                        placeholder="Current medications"
                        value={medications}
                        onChange={(e) => setMedications(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label htmlFor="custom-query" className="text-sm font-medium">
                        Custom Clinical Query
                      </label>
                      <Textarea
                        id="custom-query"
                        placeholder="Enter your clinical question"
                        className="min-h-[200px]"
                        value={customQuery}
                        onChange={(e) => setCustomQuery(e.target.value)}
                        required
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Generate Insights
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Clinical Insights</CardTitle>
              <CardDescription>AI-generated clinical decision support based on provided information</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="prose prose-sm max-w-none">
                  {result.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <Brain className="mb-4 h-16 w-16 opacity-20" />
                  <p>Enter patient information and click "Generate Insights" to receive clinical decision support</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Important Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This AI-powered clinical decision support tool is designed to assist healthcare professionals and should
              not replace clinical judgment. All recommendations should be reviewed and validated by qualified
              healthcare providers before making clinical decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
