"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderIcon, LightbulbIcon, CheckCircleIcon, PillIcon, HeartIcon, ActivityIcon } from "lucide-react"

export function RecommendationsGenerator() {
  const [patientProfile, setPatientProfile] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleGenerate = async () => {
    if (!patientProfile.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile: patientProfile }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.text)
        setActiveTab("result")
      } else {
        setError(data.text || "Failed to generate recommendations")
      }
    } catch (error) {
      console.error("Error generating recommendations:", error)
      setError("An error occurred while generating recommendations")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to format the recommendations with icons and sections
  const formatRecommendations = (text: string) => {
    if (!text) return null

    // Split the text by common section headers
    const sections = text.split(/(?=\n#+\s|^#+\s|\n\*\*|\*\*)/gm)

    return sections.map((section, index) => {
      // Determine the type of recommendation
      const isMedication = /medication|drug|prescription|dosage/i.test(section)
      const isLifestyle = /lifestyle|exercise|diet|nutrition|activity|sleep/i.test(section)
      const isTreatment = /treatment|therapy|procedure|intervention/i.test(section)

      let icon = <CheckCircleIcon className="h-5 w-5" />
      let color = "text-green-600 dark:text-green-400"

      if (isMedication) {
        icon = <PillIcon className="h-5 w-5" />
        color = "text-purple-600 dark:text-purple-400"
      } else if (isLifestyle) {
        icon = <ActivityIcon className="h-5 w-5" />
        color = "text-blue-600 dark:text-blue-400"
      } else if (isTreatment) {
        icon = <HeartIcon className="h-5 w-5" />
        color = "text-red-600 dark:text-red-400"
      }

      return (
        <div
          key={index}
          className={`mb-4 p-3 rounded-md ${
            isMedication
              ? "bg-purple-50 border-l-4 border-purple-400 dark:bg-purple-950/20 dark:border-purple-800"
              : isLifestyle
                ? "bg-blue-50 border-l-4 border-blue-400 dark:bg-blue-950/20 dark:border-blue-800"
                : isTreatment
                  ? "bg-red-50 border-l-4 border-red-400 dark:bg-red-950/20 dark:border-red-800"
                  : "bg-green-50 border-l-4 border-green-400 dark:bg-green-950/20 dark:border-green-800"
          }`}
        >
          <div className={`flex items-center gap-2 mb-2 ${color}`}>
            {icon}
            <span className="font-semibold">
              {isMedication
                ? "Medication Recommendation"
                : isLifestyle
                  ? "Lifestyle Recommendation"
                  : isTreatment
                    ? "Treatment Recommendation"
                    : "General Recommendation"}
            </span>
          </div>
          <div className="whitespace-pre-line">{section}</div>
        </div>
      )
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Patient Profile</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Recommendations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Enter patient profile including medical history, current conditions, medications, lifestyle factors,
                  and treatment goals to receive personalized recommendations.
                </p>
                <Textarea
                  placeholder="Enter patient profile here... (e.g., 65-year-old male with Type 2 Diabetes, Hypertension, and Osteoarthritis. Current medications include Metformin 1000mg twice daily, Lisinopril 20mg daily, and Paracetamol as needed. Patient is overweight with BMI of 32, sedentary lifestyle, and reports difficulty with mobility due to joint pain.)"
                  className="min-h-[250px]"
                  value={patientProfile}
                  onChange={(e) => setPatientProfile(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleGenerate} disabled={isLoading || !patientProfile.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Recommendations"
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
            {result && <div className="bg-muted p-4 rounded-md min-h-[300px]">{formatRecommendations(result)}</div>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
