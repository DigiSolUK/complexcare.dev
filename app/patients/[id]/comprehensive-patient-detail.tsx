"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Edit, ArrowLeft } from "lucide-react"
import PatientTabs from "@/components/patients/patient-tabs"
import PatientHeader from "@/components/patients/patient-header"
import PatientMedicationsSummary from "@/components/patients/patient-medications-summary"
import PatientAppointmentsSummary from "@/components/patients/patient-appointments-summary"
import PatientCarePlansSummary from "@/components/patients/patient-care-plans-summary"
import PatientClinicalNotesSummary from "@/components/patients/patient-clinical-notes-summary"
import PatientVitalsSummary from "@/components/patients/patient-vitals-summary"
import PatientAssessmentsSummary from "@/components/patients/patient-assessments-summary"
import PatientDocumentsSummary from "@/components/patients/patient-documents-summary"
import { useToast } from "@/components/ui/use-toast"

interface ComprehensivePatientDetailProps {
  patientId: string
  initialPatientData?: any
}

export default function ComprehensivePatientDetail({ patientId, initialPatientData }: ComprehensivePatientDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [patient, setPatient] = useState(initialPatientData)
  const [loading, setLoading] = useState(!initialPatientData)

  useEffect(() => {
    if (!initialPatientData) {
      const fetchPatient = async () => {
        try {
          const response = await fetch(`/api/patients/${patientId}`)
          if (!response.ok) {
            throw new Error("Failed to fetch patient")
          }
          const data = await response.json()
          setPatient(data)
        } catch (error) {
          console.error("Error fetching patient:", error)
          toast({
            title: "Error",
            description: "Failed to load patient data",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchPatient()
    }
  }, [patientId, initialPatientData, toast])

  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/patients/${patientId}/edit`)
  }

  if (loading) {
    return <div>Loading patient details...</div>
  }

  if (!patient) {
    return <div>Patient not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
        <Button size="sm" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Patient
        </Button>
      </div>

      <PatientHeader patient={patient} />

      <PatientTabs patientId={patientId} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientMedicationsSummary patientId={patientId} />
            <PatientAppointmentsSummary patientId={patientId} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientClinicalNotesSummary patientId={patientId} />
            <PatientCarePlansSummary patientId={patientId} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientVitalsSummary patientId={patientId} />
            <PatientAssessmentsSummary patientId={patientId} />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <PatientDocumentsSummary patientId={patientId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
