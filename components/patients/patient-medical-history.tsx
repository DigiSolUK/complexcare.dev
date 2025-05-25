"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Plus, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MedicalHistoryItem {
  id: string
  condition: string
  diagnosedDate: string
  resolvedDate?: string
  notes?: string
  isActive: boolean
}

interface PatientMedicalHistoryProps {
  patientId: string
}

export default function PatientMedicalHistory({ patientId }: PatientMedicalHistoryProps) {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMedicalHistory() {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would fetch from an API
        // For now, we'll use mock data
        const mockMedicalHistory: MedicalHistoryItem[] = [
          {
            id: "1",
            condition: "Hypertension",
            diagnosedDate: "2018-03-15",
            resolvedDate: undefined,
            notes: "Diagnosed with stage 1 hypertension. Prescribed lisinopril 10mg daily.",
            isActive: true,
          },
          {
            id: "2",
            condition: "Type 2 Diabetes",
            diagnosedDate: "2019-07-22",
            resolvedDate: undefined,
            notes: "HbA1c at diagnosis: 7.8%. Started on metformin 500mg twice daily.",
            isActive: true,
          },
          {
            id: "3",
            condition: "Appendicitis",
            diagnosedDate: "2015-11-03",
            resolvedDate: "2015-11-10",
            notes: "Underwent appendectomy. Recovery without complications.",
            isActive: false,
          },
          {
            id: "4",
            condition: "Seasonal Allergies",
            diagnosedDate: "2010-05-18",
            resolvedDate: undefined,
            notes: "Allergic to pollen. Prescribed cetirizine 10mg as needed during spring and summer.",
            isActive: true,
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        setMedicalHistory(mockMedicalHistory)
      } catch (err: any) {
        console.error("Error fetching medical history:", err)
        setError(err.message || "Failed to load medical history")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchMedicalHistory()
    }
  }, [patientId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
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
            <h3 className="text-lg font-semibold mb-2">Error Loading Medical History</h3>
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
        <CardTitle>Medical History</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </CardHeader>
      <CardContent>
        {medicalHistory.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Medical History</h3>
            <p className="text-muted-foreground">No medical history records found for this patient.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalHistory.map((item) => (
              <div key={item.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{item.condition}</h3>
                  <Badge variant={item.isActive ? "default" : "outline"}>{item.isActive ? "Active" : "Resolved"}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <span>Diagnosed: {new Date(item.diagnosedDate).toLocaleDateString()}</span>
                  {item.resolvedDate && <span> • Resolved: {new Date(item.resolvedDate).toLocaleDateString()}</span>}
                </div>
                {item.notes && <p className="text-sm">{item.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
