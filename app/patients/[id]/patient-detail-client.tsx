"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronLeft, AlertCircle } from "lucide-react"
import { PatientHeader } from "@/components/patients/patient-header"
import { PatientMedicationsSummary } from "@/components/patients/patient-medications-summary"
import { PatientAppointmentsSummary } from "@/components/patients/patient-appointments-summary"
import { PatientCarePlansSummary } from "@/components/patients/patient-care-plans-summary"
import { PatientClinicalNotesSummary } from "@/components/patients/patient-clinical-notes-summary"
import { PatientDocumentsSummary } from "@/components/patients/patient-documents-summary"
import { PatientVitalsSummary } from "@/components/patients/patient-vitals-summary"
import { PatientCareProviders } from "@/components/patients/patient-care-providers"
import { PatientAssessmentsSummary } from "@/components/patients/patient-assessments-summary"
import { PatientDailyLogs } from "@/components/patients/patient-daily-logs"
import { BodyMap } from "@/components/patients/body-map"
import { MedicalHistorySummary } from "@/components/ai/medical-history-summary"
import { PatientRecommendationsCard } from "@/components/ai/patient-recommendations-card"
import { GpConnectData } from "@/components/patients/gp-connect-data"
import { PatientDetailSkeleton } from "@/components/patients/patient-detail-skeleton"

interface PatientDetailClientProps {
  id: string
}

export default function PatientDetailClient({ id }: PatientDetailClientProps) {
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/patients/${id}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setPatient(data.data)
      } catch (err) {
        console.error("Error fetching patient:", err)
        setError("Failed to load patient details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatient()
  }, [id])

  if (isLoading) {
    return <PatientDetailSkeleton />
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Patient Details</h1>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Failed to load patient details. Please try again."}</AlertDescription>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Patient Details</h1>
      </div>

      <PatientHeader patient={patient} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="care-providers">Care Providers</TabsTrigger>
          <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientMedicationsSummary patientId={id} limit={3} />
            <PatientAppointmentsSummary patientId={id} limit={3} />
            <PatientClinicalNotesSummary patientId={id} limit={3} />
            <PatientCarePlansSummary patientId={id} limit={3} />
            <PatientVitalsSummary patientId={id} />
            <PatientDailyLogs patientId={id} limit={3} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BodyMap patientId={id} />
            <div className="space-y-6">
              <MedicalHistorySummary patientId={id} />
              <PatientRecommendationsCard patientId={id} />
            </div>
          </div>
          <GpConnectData patientId={id} />
        </TabsContent>

        <TabsContent value="care-providers" className="mt-0">
          <PatientCareProviders patientId={id} />
        </TabsContent>

        <TabsContent value="care-plans" className="mt-0">
          <PatientCarePlansSummary patientId={id} showAll />
        </TabsContent>

        <TabsContent value="medications" className="mt-0">
          <PatientMedicationsSummary patientId={id} showAll />
        </TabsContent>

        <TabsContent value="appointments" className="mt-0">
          <PatientAppointmentsSummary patientId={id} showAll />
        </TabsContent>

        <TabsContent value="clinical-notes" className="mt-0">
          <PatientClinicalNotesSummary patientId={id} showAll />
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <PatientDocumentsSummary patientId={id} showAll />
        </TabsContent>

        <TabsContent value="assessments" className="mt-0">
          <PatientAssessmentsSummary patientId={id} showAll />
        </TabsContent>
      </Tabs>
    </div>
  )
}
