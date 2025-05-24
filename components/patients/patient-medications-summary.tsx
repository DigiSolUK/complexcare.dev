"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Pill, Plus, AlertTriangle } from "lucide-react"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  status: string
  prescribed_date: string
  prescriber_name?: string
}

interface PatientMedicationsSummaryProps {
  patientId: string
}

function PatientMedicationsSummary({ patientId }: PatientMedicationsSummaryProps) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMedications = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/medications?limit=3`)
        if (response.ok) {
          const data = await response.json()
          setMedications(data)
        }
      } catch (error) {
        console.error("Error fetching medications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedications()
  }, [patientId])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "discontinued":
        return "bg-red-100 text-red-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
          <CardDescription>Active prescriptions and treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Current Medications</CardTitle>
          <CardDescription>Active prescriptions and treatments</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Medication
        </Button>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="text-center py-6">
            <Pill className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No medications prescribed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{medication.name}</h4>
                    {medication.status === "active" && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                  </div>
                  <Badge className={getStatusColor(medication.status)}>{medication.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {medication.dosage} - {medication.frequency}
                </p>
                {medication.prescriber_name && (
                  <p className="text-xs text-muted-foreground">Prescribed by {medication.prescriber_name}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Medications
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PatientMedicationsSummary
