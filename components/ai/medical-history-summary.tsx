"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileTextIcon, LoaderIcon, RefreshCwIcon } from "lucide-react"
import type { Patient } from "@/lib/services/patient-service"

interface MedicalHistorySummaryProps {
  patient: Patient
}

export function MedicalHistorySummary({ patient }: MedicalHistorySummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = async () => {
    if (!patient.medical_history) {
      setError("No medical history available to summarize")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/document-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document: patient.medical_history }),
      })

      const data = await response.json()

      if (data.success) {
        setSummary(data.text)
      } else {
        setError(data.text || "Failed to generate summary")
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      setError("An error occurred while generating the summary")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          Medical History Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-line">{summary}</div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <LoaderIcon className="h-6 w-6 animate-spin" />
                <p>Analyzing medical history...</p>
              </div>
            ) : (
              <p>
                {patient.medical_history
                  ? "Click the button below to generate an AI-powered summary of this patient's medical history."
                  : "No medical history available to summarize."}
              </p>
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
          onClick={generateSummary}
          disabled={isLoading || !patient.medical_history}
          variant={summary ? "outline" : "default"}
          className="w-full"
        >
          {summary ? (
            <>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Regenerate Summary
            </>
          ) : (
            <>
              <FileTextIcon className="mr-2 h-4 w-4" />
              Generate Summary
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
