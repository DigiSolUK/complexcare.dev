"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { PatientDemographics } from "@/components/patients/patient-demographics"
import { PatientMedicalHistory } from "@/components/patients/patient-medical-history"
import { PatientAllergies } from "@/components/patients/patient-allergies"
import { PatientDocuments } from "@/components/patients/patient-documents"
import { PatientRiskAssessment } from "@/components/patients/patient-risk-assessment"
import { PatientClinicalNotesSummary } from "@/components/patients/patient-clinical-notes-summary"
import { PatientMedicationsSummary } from "@/components/patients/patient-medications-summary"
import { PatientCarePlansSummary } from "@/components/patients/patient-care-plans-summary"
import { PatientHeader } from "@/components/patients/patient-header"
import type { Patient } from "@/types/patient"
import { ErrorBoundary } from "@/components/error-boundary"

export function PatientDetailContent({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch(`/api/patients/${patientId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch patient data")
        }
        const data = await response.json()
        setPatient(data)
      } catch (err) {
        setError("Error loading patient data. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  if (loading) {
    return <div>Loading patient information...</div>
  }

  if (error || !patient) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Patient not found. Please check the patient ID and try again."}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />

      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
          <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="demographics">
            <ErrorBoundary fallback={<ErrorCard title="Demographics" />}>
              <PatientDemographics patient={patient} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="medical-history">
            <ErrorBoundary fallback={<ErrorCard title="Medical History" />}>
              <PatientMedicalHistory patientId={patient.id} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="allergies">
            <ErrorBoundary fallback={<ErrorCard title="Allergies" />}>
              <PatientAllergies patientId={patient.id} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="medications">
            <ErrorBoundary fallback={<ErrorCard title="Medications" />}>
              <PatientMedicationsSummary patientId={patient.id} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="care-plans">
            <ErrorBoundary fallback={<ErrorCard title="Care Plans" />}>
              <PatientCarePlansSummary patientId={patient.id} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="clinical-notes">
            <ErrorBoundary fallback={<ErrorCard title="Clinical Notes" />}>
              <PatientClinicalNotesSummary patientId={patient.id} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="documents">
            <ErrorBoundary fallback={<ErrorCard title="Documents" />}>
              <PatientDocuments patientId={patient.id} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="risk">
            <ErrorBoundary fallback={<ErrorCard title="Risk Assessment" />}>
              <PatientRiskAssessment patientId={patient.id} />
            </ErrorBoundary>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function ErrorCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load {title.toLowerCase()} data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
