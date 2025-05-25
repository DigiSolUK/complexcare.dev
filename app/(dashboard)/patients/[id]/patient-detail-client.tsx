"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { User, AlertCircle } from "lucide-react"
import PatientHeader from "@/components/patients/patient-header"
import PatientMedicationsSummary from "@/components/patients/patient-medications-summary"
import PatientAppointmentsSummary from "@/components/patients/patient-appointments-summary"
import PatientCarePlansSummary from "@/components/patients/patient-care-plans-summary"
import PatientClinicalNotesSummary from "@/components/patients/patient-clinical-notes-summary"
import PatientVitalsSummary from "@/components/patients/patient-vitals-summary"
import PatientAssessmentsSummary from "@/components/patients/patient-assessments-summary"
import PatientDocumentsSummary from "@/components/patients/patient-documents-summary"

interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  nhs_number: string
  gender: string
  status: string
  primary_condition: string
  primary_care_provider: string
  avatar_url: string
  phone: string
  email: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_history: string
  allergies: string
  current_medications: string
}

interface PatientDetailClientProps {
  patientId: string
}

function PatientDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Skeleton className="h-8 w-[100px]" />
          </TabsTrigger>
          <TabsTrigger value="clinical-notes">
            <Skeleton className="h-8 w-[100px]" />
          </TabsTrigger>
          <TabsTrigger value="medications">
            <Skeleton className="h-8 w-[100px]" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinical-notes">
          <Skeleton className="h-48 w-full" />
        </TabsContent>

        <TabsContent value="medications">
          <Skeleton className="h-48 w-full" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function PatientDetailClient({ patientId }: PatientDetailClientProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPatient() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/patients/${patientId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch patient: ${response.status}`)
        }

        const data = await response.json()
        setPatient(data)
      } catch (err: any) {
        console.error("Error fetching patient:", err)
        setError(err.message || "Failed to load patient details")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchPatient()
    }
  }, [patientId])

  if (loading) {
    return <PatientDetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Patient</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!patient) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Patient Not Found</h3>
            <p className="text-muted-foreground">The requested patient could not be found.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PatientMedicationsSummary patientId={patient.id} />
            <PatientAppointmentsSummary patientId={patient.id} />
            <PatientCarePlansSummary patientId={patient.id} />
            <PatientClinicalNotesSummary patientId={patient.id} />
            <PatientVitalsSummary patientId={patient.id} />
            <PatientAssessmentsSummary patientId={patient.id} />
          </div>
        </TabsContent>

        <TabsContent value="clinical-notes">
          <PatientClinicalNotesSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="medications">
          <PatientMedicationsSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="appointments">
          <PatientAppointmentsSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="care-plans">
          <PatientCarePlansSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="vitals">
          <PatientVitalsSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="assessments">
          <PatientAssessmentsSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="documents">
          <PatientDocumentsSummary patientId={patient.id} detailed />
        </TabsContent>
      </Tabs>
    </div>
  )
}
