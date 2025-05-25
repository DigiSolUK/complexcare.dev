"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  AlertCircle,
  FileText,
  Pill,
  Calendar,
  ClipboardList,
  Activity,
  HeartPulse,
  FileSpreadsheet,
} from "lucide-react"
import { PatientHeader } from "@/components/patients/patient-header"
import PatientMedicalHistory from "@/components/patients/patient-medical-history"
import PatientMedicationsList from "@/components/patients/patient-medications-list"
import PatientAppointmentsList from "@/components/patients/patient-appointments-list"
import PatientClinicalNotesList from "@/components/patients/patient-clinical-notes-list"
import PatientCarePlansList from "@/components/patients/patient-care-plans-list"
import PatientVitalsList from "@/components/patients/patient-vitals-list"
import PatientAssessmentsList from "@/components/patients/patient-assessments-list"
import PatientDocumentsList from "@/components/patients/patient-documents-list"
import { PatientDemographicsEditor } from "@/components/patients/patient-demographics-editor"

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
  avatar_url?: string
  phone?: string
  contact_number?: string
  email?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_history?: string
  allergies?: string
  current_medications?: string
  notes?: string
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

  const handlePatientUpdated = (updatedPatient: Patient) => {
    setPatient(updatedPatient)
  }

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
      <PatientHeader patient={patient} onPatientUpdated={handlePatientUpdated} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="medical-history" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Medical History
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center">
            <Pill className="mr-2 h-4 w-4" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="clinical-notes" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Clinical Notes
          </TabsTrigger>
          <TabsTrigger value="care-plans" className="flex items-center">
            <ClipboardList className="mr-2 h-4 w-4" />
            Care Plans
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center">
            <HeartPulse className="mr-2 h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <PatientDemographicsEditor patient={patient} onPatientUpdated={handlePatientUpdated} />
        </TabsContent>

        <TabsContent value="medical-history">
          <PatientMedicalHistory patientId={patientId} />
        </TabsContent>

        <TabsContent value="medications">
          <PatientMedicationsList patientId={patientId} />
        </TabsContent>

        <TabsContent value="appointments">
          <PatientAppointmentsList patientId={patientId} />
        </TabsContent>

        <TabsContent value="clinical-notes">
          <PatientClinicalNotesList patientId={patientId} />
        </TabsContent>

        <TabsContent value="care-plans">
          <PatientCarePlansList patientId={patientId} />
        </TabsContent>

        <TabsContent value="vitals">
          <PatientVitalsList patientId={patientId} />
        </TabsContent>

        <TabsContent value="assessments">
          <PatientAssessmentsList patientId={patientId} />
        </TabsContent>

        <TabsContent value="documents">
          <PatientDocumentsList patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
