"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Plus, Pill } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  prescribedBy: string
  notes?: string
  isActive: boolean
}

interface PatientMedicationsListProps {
  patientId: string
}

export default function PatientMedicationsList({ patientId }: PatientMedicationsListProps) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMedications() {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would fetch from an API
        // For now, we'll use mock data
        const mockMedications: Medication[] = [
          {
            id: "1",
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            startDate: "2018-03-15",
            endDate: undefined,
            prescribedBy: "Dr. Smith",
            notes: "Take in the morning with food.",
            isActive: true,
          },
          {
            id: "2",
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            startDate: "2019-07-22",
            endDate: undefined,
            prescribedBy: "Dr. Johnson",
            notes: "Take with breakfast and dinner.",
            isActive: true,
          },
          {
            id: "3",
            name: "Cetirizine",
            dosage: "10mg",
            frequency: "As needed",
            startDate: "2010-05-18",
            endDate: undefined,
            prescribedBy: "Dr. Williams",
            notes: "Take during allergy season.",
            isActive: true,
          },
          {
            id: "4",
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "Three times daily",
            startDate: "2022-01-10",
            endDate: "2022-01-17",
            prescribedBy: "Dr. Brown",
            notes: "Course completed for respiratory infection.",
            isActive: false,
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        setMedications(mockMedications)
      } catch (err: any) {
        console.error("Error fetching medications:", err)
        setError(err.message || "Failed to load medications")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchMedications()
    }
  }, [patientId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md p-4">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Medications</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medications</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="text-center py-6">
            <Pill className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Medications</h3>
            <p className="text-muted-foreground">No medications found for this patient.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{medication.name}</h3>
                  <Badge variant={medication.isActive ? "default" : "outline"}>
                    {medication.isActive ? "Active" : "Discontinued"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Dosage: </span>
                    <span className="text-sm">{medication.dosage}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Frequency: </span>
                    <span className="text-sm">{medication.frequency}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Started: </span>
                    <span className="text-sm">{new Date(medication.startDate).toLocaleDateString()}</span>
                  </div>
                  {medication.endDate && (
                    <div>
                      <span className="text-sm text-muted-foreground">Ended: </span>
                      <span className="text-sm">{new Date(medication.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">Prescribed by: </span>
                    <span className="text-sm">{medication.prescribedBy}</span>
                  </div>
                </div>
                {medication.notes && <p className="text-sm">{medication.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
