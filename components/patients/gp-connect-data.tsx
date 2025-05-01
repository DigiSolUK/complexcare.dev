"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { getPatient, getMedications, getAllergies, getConditions } from "@/lib/integrations/gp-connect"

interface GPConnectDataProps {
  nhsNumber: string
  patientName: string
}

interface GPConnectPatient {
  nhsNumber: string
  name: string
  dateOfBirth: string
  gender: string
  address: string
  telephone: string
  gpPractice: string
}

interface Medication {
  name: string
  dosage: string
  startDate: string
  endDate?: string
  prescribedBy: string
}

interface Allergy {
  substance: string
  severity: string
  recordedDate: string
  recordedBy: string
}

interface Condition {
  name: string
  onsetDate: string
  status: string
  recordedBy: string
}

export function GPConnectData({ nhsNumber, patientName }: GPConnectDataProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patient, setPatient] = useState<GPConnectPatient | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])

  useEffect(() => {
    async function fetchGPConnectData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch patient data
        const patientData = await getPatient(nhsNumber)
        setPatient(patientData)

        // Fetch medications
        const medicationsData = await getMedications(nhsNumber)
        setMedications(medicationsData)

        // Fetch allergies
        const allergiesData = await getAllergies(nhsNumber)
        setAllergies(allergiesData)

        // Fetch conditions
        const conditionsData = await getConditions(nhsNumber)
        setConditions(conditionsData)
      } catch (err) {
        console.error("Error fetching GP Connect data:", err)
        setError("Failed to fetch GP Connect data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchGPConnectData()
  }, [nhsNumber])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!patient) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>No GP Connect data found for this patient.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="font-medium">Name</div>
              <div className="text-sm text-muted-foreground">{patient.name}</div>
            </div>
            <div>
              <div className="font-medium">Date of Birth</div>
              <div className="text-sm text-muted-foreground">{patient.dateOfBirth}</div>
            </div>
            <div>
              <div className="font-medium">Gender</div>
              <div className="text-sm text-muted-foreground">{patient.gender}</div>
            </div>
            <div>
              <div className="font-medium">Address</div>
              <div className="text-sm text-muted-foreground">{patient.address}</div>
            </div>
            <div>
              <div className="font-medium">Telephone</div>
              <div className="text-sm text-muted-foreground">{patient.telephone}</div>
            </div>
            <div>
              <div className="font-medium">GP Practice</div>
              <div className="text-sm text-muted-foreground">{patient.gpPractice}</div>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">GP Connect Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Medications prescribed by GP</CardDescription>
            </CardHeader>
            <CardContent>
              {medications.length > 0 ? (
                <div className="divide-y">
                  {medications.map((med, index) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="font-medium">{med.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {med.dosage} - Started: {med.startDate}
                        {med.endDate && ` - Ended: ${med.endDate}`}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Prescribed by: {med.prescribedBy}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No medications found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allergies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>Known allergies and reactions</CardDescription>
            </CardHeader>
            <CardContent>
              {allergies.length > 0 ? (
                <div className="divide-y">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="font-medium">{allergy.substance}</div>
                      <div className="text-sm text-muted-foreground">
                        Severity: {allergy.severity} - Recorded: {allergy.recordedDate}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Recorded by: {allergy.recordedBy}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No allergies found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions</CardTitle>
              <CardDescription>Diagnosed conditions</CardDescription>
            </CardHeader>
            <CardContent>
              {conditions.length > 0 ? (
                <div className="divide-y">
                  {conditions.map((condition, index) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="font-medium">{condition.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Onset: {condition.onsetDate} - Status: {condition.status}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Recorded by: {condition.recordedBy}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No conditions found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
