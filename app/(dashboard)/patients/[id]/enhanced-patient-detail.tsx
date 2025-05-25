"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, FileText, Pill, ClipboardList, Upload, History, Shield, Activity } from "lucide-react"
import PatientHeader from "@/components/patients/patient-header"
import { PatientDemographics } from "@/components/patients/patient-demographics"
import { PatientMedicalHistory } from "@/components/patients/patient-medical-history"
import { PatientAllergies } from "@/components/patients/patient-allergies"
import { PatientMedicationsSummary } from "@/components/patients/patient-medications-summary"
import { PatientCarePlansSummary } from "@/components/patients/patient-care-plans-summary"
import { PatientClinicalNotesSummary } from "@/components/patients/patient-clinical-notes-summary"
import { PatientDocuments } from "@/components/patients/patient-documents"
import { PatientActivityHistory } from "@/components/patients/patient-activity-history"
import { PatientVitalsSummary } from "@/components/patients/patient-vitals-summary"
import { PatientRiskAssessment } from "@/components/patients/patient-risk-assessment"

interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  nhs_number?: string
  gender: string
  status: string
  primary_condition?: string
  primary_care_provider?: string
  avatar_url?: string
  contact_number?: string
  email?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  notes?: string
}

interface EnhancedPatientDetailProps {
  patientId: string
}

export default function EnhancedPatientDetail({ patientId }: EnhancedPatientDetailProps) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

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
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-9 lg:grid-cols-9 h-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Demographics</span>
          </TabsTrigger>
          <TabsTrigger value="medical-history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden md:inline">Medical History</span>
          </TabsTrigger>
          <TabsTrigger value="allergies" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Allergies</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden md:inline">Medications</span>
          </TabsTrigger>
          <TabsTrigger value="care-plans" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden md:inline">Care Plans</span>
          </TabsTrigger>
          <TabsTrigger value="clinical-notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Clinical Notes</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden md:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PatientRiskAssessment patientId={patient.id} />
            <PatientVitalsSummary patientId={patient.id} />
            <PatientMedicationsSummary patientId={patient.id} />
            <PatientCarePlansSummary patientId={patient.id} />
            <PatientClinicalNotesSummary patientId={patient.id} />
          </div>
        </TabsContent>

        <TabsContent value="demographics">
          <PatientDemographics patient={patient} />
        </TabsContent>

        <TabsContent value="medical-history">
          <PatientMedicalHistory patientId={patient.id} />
        </TabsContent>

        <TabsContent value="allergies">
          <PatientAllergies patientId={patient.id} />
        </TabsContent>

        <TabsContent value="medications">
          <PatientMedicationsSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="care-plans">
          <PatientCarePlansSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="clinical-notes">
          <PatientClinicalNotesSummary patientId={patient.id} detailed />
        </TabsContent>

        <TabsContent value="documents">
          <PatientDocuments patientId={patient.id} />
        </TabsContent>

        <TabsContent value="activity">
          <PatientActivityHistory patientId={patient.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
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
          <TabsTrigger value="demographics">
            <Skeleton className="h-8 w-[100px]" />
          </TabsTrigger>
          <TabsTrigger value="medical-history">
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
      </Tabs>
    </div>
  )
}
