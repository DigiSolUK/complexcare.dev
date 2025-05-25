"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, RefreshCw, Pill, AlertCircle, Stethoscope, Syringe, ExternalLink } from "lucide-react"
import { MedicationDetails } from "@/components/medications/medication-details"

interface GPConnectMedicalHistoryProps {
  patientId: string
  nhsNumber: string
}

export function GPConnectMedicalHistory({ patientId, nhsNumber }: GPConnectMedicalHistoryProps) {
  const [activeTab, setActiveTab] = useState("medications")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null)
  const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false)

  const fetchGPConnectData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/integrations/gp-connect/${nhsNumber}?dataType=all`)

      if (!response.ok) {
        throw new Error("Failed to fetch GP Connect data")
      }

      const responseData = await response.json()
      setData(responseData)
    } catch (error) {
      console.error("Error fetching GP Connect data:", error)
      setError("Failed to load GP Connect data. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load GP Connect data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (nhsNumber) {
      fetchGPConnectData()
    }
  }, [nhsNumber])

  const handleViewMedication = (medicationId: string) => {
    setSelectedMedicationId(medicationId)
    setIsMedicationDialogOpen(true)
  }

  const renderMedicationsTab = () => {
    if (!data || !data.medications || data.medications.length === 0) {
      return <p className="text-center py-4 text-muted-foreground">No medication data available</p>
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Prescribed By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.medications.map((medication: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{medication.name}</TableCell>
              <TableCell>{medication.dosage}</TableCell>
              <TableCell>{medication.startDate}</TableCell>
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
    )
  }

  const renderAllergiesTab = () => {
    if (!data || !data.allergies || data.allergies.length === 0) {
      return <p className="text-center py-4 text-muted-foreground">No allergy data available</p>
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Substance</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Reaction</TableHead>
            <TableHead>Recorded Date</TableHead>
            <TableHead>Recorded By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.allergies.map((allergy: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{allergy.substance}</TableCell>
              <TableCell>
                <Badge variant={allergy.severity === "Severe" ? "destructive" : "outline"}>{allergy.severity}</Badge>
              </TableCell>
              <TableCell>{allergy.reaction || "Not specified"}</TableCell>
              <TableCell>{allergy.recordedDate}</TableCell>
              <TableCell>{allergy.recordedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const renderConditionsTab = () => {
    if (!data || !data.conditions || data.conditions.length === 0) {
      return <p className="text-center py-4 text-muted-foreground">No condition data available</p>
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Onset Date</TableHead>
            <TableHead>Recorded By</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.conditions.map((condition: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {condition.name}
                {condition.snomedCode && (
                  <div className="text-xs text-muted-foreground mt-1">SNOMED: {condition.snomedCode}</div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={condition.status === "Active" ? "default" : "outline"}>{condition.status}</Badge>
              </TableCell>
              <TableCell>{condition.onsetDate}</TableCell>
              <TableCell>{condition.recordedBy}</TableCell>
              <TableCell className="max-w-xs truncate">{condition.notes || "None"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const renderImmunizationsTab = () => {
    if (!data || !data.immunizations || data.immunizations.length === 0) {
      return <p className="text-center py-4 text-muted-foreground">No immunization data available</p>
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vaccine</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Administered By</TableHead>
            <TableHead>Batch Number</TableHead>
            <TableHead>Site/Route</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.immunizations.map((immunization: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{immunization.name}</TableCell>
              <TableCell>{immunization.date}</TableCell>
              <TableCell>{immunization.administeredBy}</TableCell>
              <TableCell>{immunization.batchNumber || "Not recorded"}</TableCell>
              <TableCell>
                {immunization.site && immunization.route
                  ? `${immunization.site} / ${immunization.route}`
                  : "Not specified"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GP Connect Data</CardTitle>
          <CardDescription>Loading data from GP systems...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
            GP Connect Error
          </CardTitle>
          <CardDescription>Failed to load data from GP systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/15 p-4 rounded-md">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchGPConnectData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
            <CardTitle>GP Connect Data</CardTitle>
            <CardDescription>Medical history from GP systems for NHS Number: {nhsNumber}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchGPConnectData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="medications" className="flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="allergies" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Allergies
            </TabsTrigger>
            <TabsTrigger value="conditions" className="flex items-center">
              <Stethoscope className="h-4 w-4 mr-2" />
              Conditions
            </TabsTrigger>
            <TabsTrigger value="immunizations" className="flex items-center">
              <Syringe className="h-4 w-4 mr-2" />
              Immunizations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications">{renderMedicationsTab()}</TabsContent>

          <TabsContent value="allergies">{renderAllergiesTab()}</TabsContent>

          <TabsContent value="conditions">{renderConditionsTab()}</TabsContent>

          <TabsContent value="immunizations">{renderImmunizationsTab()}</TabsContent>
        </Tabs>

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
