"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AddMedicationDialog } from "@/components/medications/add-medication-dialog"
import { MedicationDetails } from "@/components/medications/medication-details"
import { toast } from "@/components/ui/use-toast"
import { ExternalLink, AlertTriangle, RefreshCw } from "lucide-react"

interface PatientMedicationsTableProps {
  patientId: string
}

export function PatientMedicationsTable({ patientId }: PatientMedicationsTableProps) {
  const [medications, setMedications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null)
  const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false)

  const fetchMedications = async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would fetch from an API
      // For demo purposes, we'll use mock data
      const mockMedications = [
        {
          id: "1",
          name: "Metformin",
          dosage: "500mg twice daily",
          startDate: "2022-01-10",
          endDate: null,
          prescribedBy: "Dr. Johnson",
          status: "active",
          medicationId: "vmp123456",
          medicationType: "VMP",
        },
        {
          id: "2",
          name: "Lisinopril",
          dosage: "10mg once daily",
          startDate: "2022-03-15",
          endDate: null,
          prescribedBy: "Dr. Johnson",
          status: "active",
          medicationId: "vmp234567",
          medicationType: "VMP",
        },
        {
          id: "3",
          name: "Atorvastatin",
          dosage: "20mg once daily",
          startDate: "2022-02-05",
          endDate: null,
          prescribedBy: "Dr. Williams",
          status: "active",
          medicationId: "vmp345678",
          medicationType: "VMP",
        },
      ]

      setMedications(mockMedications)
    } catch (err) {
      console.error("Error fetching medications:", err)
      setError("Failed to load medications. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load medications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedications()
  }, [patientId])

  const handleViewMedication = (medicationId: string) => {
    setSelectedMedicationId(medicationId)
    setIsMedicationDialogOpen(true)
  }

  const handleMedicationAdded = () => {
    fetchMedications()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medications</CardTitle>
          <CardDescription>Loading medications...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/15 p-4 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-destructive">Error</h3>
              <p className="text-destructive/90 text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchMedications}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Medications</CardTitle>
            <CardDescription>Current and past medications for this patient</CardDescription>
          </div>
          <AddMedicationDialog patientId={patientId} onMedicationAdded={handleMedicationAdded} />
        </div>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No medications found for this patient.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prescribed By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell className="font-medium">{medication.name}</TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell>{new Date(medication.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={medication.status === "active" ? "default" : "outline"}>{medication.status}</Badge>
                  </TableCell>
                  <TableCell>{medication.prescribedBy}</TableCell>
                  <TableCell className="text-right">
                    {medication.medicationId && (
                      <Button variant="ghost" size="sm" onClick={() => handleViewMedication(medication.medicationId)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isMedicationDialogOpen} onOpenChange={setIsMedicationDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Medication Details</DialogTitle>
            </DialogHeader>
            {selectedMedicationId && (
              <MedicationDetails medicationId={selectedMedicationId} onClose={() => setIsMedicationDialogOpen(false)} />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
