"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LightbulbIcon, LoaderIcon, RefreshCwIcon } from "lucide-react"
import type { Patient } from "@/lib/services/patient-service"

interface PatientRecommendationsCardProps {
  patient: Patient
}

export function PatientRecommendationsCard({ patient }: PatientRecommendationsCardProps) {
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create a simplified patient profile from the patient data
      const patientProfile = `
        Patient: ${patient.title || ""} ${patient.first_name} ${patient.last_name}
        Gender: ${patient.gender}
        Date of Birth: ${new Date(patient.date_of_birth).toLocaleDateString()}
        Medical History: ${patient.medical_history || "Not available"}
        Medications: ${patient.medications || "Not available"}
        Allergies: ${patient.allergies || "None known"}
        Care Needs: ${patient.care_needs || "Not specified"}
      `

      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile: patientProfile }),
      })

      const data = await response.json()

      if (data.success) {
        setRecommendations(data.text)
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

  // Format recommendations with better styling
  const formatRecommendations = (text: string) => {
    if (!text) return null

    // Split by common section headers
    const sections = text.split(/(?=\n#+\s|^#+\s|\n\*\*|\*\*)/gm)

    return sections.map((section, index) => (
      <div key={index} className="mb-3 last:mb-0">
        <div className="whitespace-pre-line">{section}</div>
      </div>
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations ? (
          <div className="bg-muted p-3 rounded-md text-sm">{formatRecommendations(recommendations)}</div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <LoaderIcon className="h-6 w-6 animate-spin" />
                <p>Generating personalized recommendations...</p>
              </div>
            ) : (
              <p>Click the button below to generate AI-powered care recommendations for this patient.</p>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={generateRecommendations}
          disabled={isLoading}
          variant={recommendations ? "outline" : "default"}
          className="w-full"
        >
          {recommendations ? (
            <>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Regenerate Recommendations
            </>
          ) : (
            <>
              <LightbulbIcon className="mr-2 h-4 w-4" />
              Generate Recommendations
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
