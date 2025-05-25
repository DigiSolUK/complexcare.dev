"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientHeader } from "@/components/patients/patient-header"
import { PatientDemographics } from "@/components/patients/patient-demographics"
import { PatientMedicationsTable } from "@/components/patients/patient-medications-table"
import { PatientAppointmentsTable } from "@/components/patients/patient-appointments-table"
import { PatientDocumentsTable } from "@/components/patients/patient-documents-table"
import { PatientCarePlansTable } from "@/components/patients/patient-care-plans-table"
import { PatientActivityHistory } from "@/components/patients/patient-activity-history"
import { EnhancedMedicalHistory } from "@/components/patients/enhanced-medical-history"
import { toast } from "@/components/ui/use-toast"

export default function PatientDetailContent() {
  const params = useParams()
  const patientId = params.id as string
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // In a real implementation, this would fetch from an API
        // For demo purposes, we'll use mock data
        const mockPatient = {
          id: patientId,
          firstName: "John",
          lastName: "Smith",
          dateOfBirth: "1975-05-15",
          gender: "Male",
          nhsNumber: "1234567890",
          address: "123 Main St, London, UK",
          phone: "020 1234 5678",
          email: "john.smith@example.com",
          tenantId: "demo-tenant",
        }

        setPatient(mockPatient)
      } catch (error) {
        console.error("Error fetching patient:", error)
        toast({
          title: "Error",
          description: "Failed to load patient details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchPatient()
    }
  }, [patientId])

  if (loading || !patient) {
    return <div>Loading patient details...</div>
  }

  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <PatientDemographics patient={patient} />
            {/* Other overview components */}
          </div>
        </TabsContent>

        <TabsContent value="medical-history">
          <EnhancedMedicalHistory patientId={patient.id} nhsNumber={patient.nhsNumber} tenantId={patient.tenantId} />
        </TabsContent>

        <TabsContent value="medications">
          <PatientMedicationsTable patientId={patient.id} />
        </TabsContent>

        <TabsContent value="appointments">
          <PatientAppointmentsTable patientId={patient.id} />
        </TabsContent>

        <TabsContent value="documents">
          <PatientDocumentsTable patientId={patient.id} />
        </TabsContent>

        <TabsContent value="care-plans">
          <PatientCarePlansTable patientId={patient.id} />
        </TabsContent>

        <TabsContent value="activity">
          <PatientActivityHistory patientId={patient.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
