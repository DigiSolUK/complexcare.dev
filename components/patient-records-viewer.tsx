"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Calendar, FileText, Heart, Pill, Shield, User } from "lucide-react"
import type { GPConnectPatientRecord } from "@/lib/services/gp-connect-service"
import { format } from "date-fns"

interface PatientRecordsViewerProps {
  nhsNumber: string
}

export function PatientRecordsViewer({ nhsNumber }: PatientRecordsViewerProps) {
  const [patientRecord, setPatientRecord] = useState<GPConnectPatientRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/gp-connect/${nhsNumber}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch patient data: ${response.statusText}`)
        }

        const data = await response.json()
        setPatientRecord(data)
      } catch (err) {
        console.error("Error fetching patient data:", err)
        setError("Failed to load patient records. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (nhsNumber) {
      fetchPatientData()
    }
  }, [nhsNumber])

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy")
    } catch (e) {
      return dateString
    }
  }

  // Format date and time for display
  const formatDateTime = (dateTimeString: string) => {
    try {
      return format(new Date(dateTimeString), "dd/MM/yyyy HH:mm")
    } catch (e) {
      return dateTimeString
    }
  }

  // Get medication name from coding
  const getMedicationName = (medication: any) => {
    return medication.medicationReference?.display || medication.code?.coding?.[0]?.display || "Unknown Medication"
  }

  // Get condition name from coding
  const getConditionName = (condition: any) => {
    return condition.code?.coding?.[0]?.display || "Unknown Condition"
  }

  // Get allergy name from coding
  const getAllergyName = (allergy: any) => {
    return allergy.code?.coding?.[0]?.display || "Unknown Allergy"
  }

  // Get immunization name from coding
  const getImmunizationName = (immunization: any) => {
    return (
      immunization.vaccineCode?.coding?.[0]?.display ||
      immunization.code?.coding?.[0]?.display ||
      "Unknown Immunization"
    )
  }

  // Get severity badge variant
  const getSeverityVariant = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
      case "severe":
        return "destructive"
      case "moderate":
        return "default"
      case "low":
      case "mild":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "booked":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Patient Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!patientRecord) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Patient Records Found</CardTitle>
          <CardDescription>No records were found for NHS number {nhsNumber}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { demographics, medications, allergies, immunizations, conditions, appointments } = patientRecord

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              Patient Demographics
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              NHS: {demographics.nhsNumber}
            </Badge>
          </div>
          <CardDescription>
            GP: {demographics.gpDetails.name} | {demographics.gpDetails.organization}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {demographics.name.prefix?.[0] || ""}{" "}
                {demographics.name.given.join(" ")} {demographics.name.family}
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span> {formatDate(demographics.birthDate)} (
                {calculateAge(demographics.birthDate)} years)
              </div>
              <div>
                <span className="font-medium">Gender:</span>{" "}
                {demographics.gender.charAt(0).toUpperCase() + demographics.gender.slice(1)}
              </div>
              <div>
                <span className="font-medium">Address:</span> {demographics.address.line.join(", ")},{" "}
                {demographics.address.city}, {demographics.address.postalCode}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Contact:</span>
                <ul className="list-disc list-inside ml-2">
                  {demographics.telecom.map((contact, index) => (
                    <li key={index}>
                      {contact.system.charAt(0).toUpperCase() + contact.system.slice(1)} ({contact.use}):{" "}
                      {contact.value}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium">GP Contact:</span> {demographics.gpDetails.phone}
              </div>
              <div>
                <span className="font-medium">Registered Since:</span>{" "}
                {formatDate(demographics.registrationDetails.registrationDate)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="medications">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="medications" className="flex items-center gap-1">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Medications</span>
          </TabsTrigger>
          <TabsTrigger value="allergies" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Allergies</span>
          </TabsTrigger>
          <TabsTrigger value="conditions" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Conditions</span>
          </TabsTrigger>
          <TabsTrigger value="immunizations" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Immunizations</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Medications
              </CardTitle>
              <CardDescription>Current and past medications prescribed to the patient</CardDescription>
            </CardHeader>
            <CardContent>
              {medications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Prescribed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prescriber</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medications.map((medication) => (
                      <TableRow key={medication.id}>
                        <TableCell className="font-medium">{getMedicationName(medication)}</TableCell>
                        <TableCell>{medication.dosageInstructions || "Not specified"}</TableCell>
                        <TableCell>{formatDate(medication.prescriptionDate || medication.effectiveDate)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(medication.status)}>
                            {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{medication.prescribedBy || "Unknown"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No medication records found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allergies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Allergies
              </CardTitle>
              <CardDescription>Known allergies and adverse reactions</CardDescription>
            </CardHeader>
            <CardContent>
              {allergies.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Allergy</TableHead>
                      <TableHead>Reaction</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Recorded Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allergies.map((allergy) => (
                      <TableRow key={allergy.id}>
                        <TableCell className="font-medium">{getAllergyName(allergy)}</TableCell>
                        <TableCell>
                          {allergy.reaction?.[0]?.manifestation?.[0]?.coding?.[0]?.display || "Not specified"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSeverityVariant(allergy.reaction?.[0]?.severity || allergy.criticality)}>
                            {(allergy.reaction?.[0]?.severity || allergy.criticality || "Unknown")
                              .charAt(0)
                              .toUpperCase() +
                              (allergy.reaction?.[0]?.severity || allergy.criticality || "Unknown").slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(allergy.effectiveDate)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(allergy.clinicalStatus)}>
                            {allergy.clinicalStatus.charAt(0).toUpperCase() + allergy.clinicalStatus.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No allergy records found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Conditions
              </CardTitle>
              <CardDescription>Diagnosed conditions and medical history</CardDescription>
            </CardHeader>
            <CardContent>
              {conditions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Condition</TableHead>
                      <TableHead>Onset Date</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conditions.map((condition) => (
                      <TableRow key={condition.id}>
                        <TableCell className="font-medium">{getConditionName(condition)}</TableCell>
                        <TableCell>{formatDate(condition.onsetDateTime || condition.effectiveDate)}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityVariant(condition.severity?.coding?.[0]?.display || "")}>
                            {(condition.severity?.coding?.[0]?.display || "Unknown").charAt(0).toUpperCase() +
                              (condition.severity?.coding?.[0]?.display || "Unknown").slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(condition.clinicalStatus)}>
                            {condition.clinicalStatus.charAt(0).toUpperCase() + condition.clinicalStatus.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No condition records found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="immunizations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Immunizations
              </CardTitle>
              <CardDescription>Vaccination history and immunization records</CardDescription>
            </CardHeader>
            <CardContent>
              {immunizations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Dose</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {immunizations.map((immunization) => (
                      <TableRow key={immunization.id}>
                        <TableCell className="font-medium">{getImmunizationName(immunization)}</TableCell>
                        <TableCell>{formatDate(immunization.effectiveDate)}</TableCell>
                        <TableCell>{immunization.site || "Not specified"}</TableCell>
                        <TableCell>
                          {immunization.doseQuantity
                            ? `${immunization.doseQuantity.value} ${immunization.doseQuantity.unit}`
                            : "Not specified"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(immunization.status)}>
                            {immunization.status.charAt(0).toUpperCase() + immunization.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No immunization records found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointments
              </CardTitle>
              <CardDescription>Past and upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {formatDateTime(appointment.start)}
                          <div className="text-xs text-muted-foreground">{appointment.minutesDuration} minutes</div>
                        </TableCell>
                        <TableCell>
                          <div>{appointment.type.coding[0].display}</div>
                          <div className="text-xs text-muted-foreground">{appointment.reason}</div>
                        </TableCell>
                        <TableCell>
                          {appointment.participant.find((p) => !p.actor.reference.includes("Patient/"))?.actor
                            .display || "Unknown"}
                        </TableCell>
                        <TableCell>{appointment.location?.[0]?.display || "Not specified"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No appointment records found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            GP Connect Integration
          </CardTitle>
          <CardDescription>
            This data is currently using mock GP Connect data. In a production environment, this would be connected to
            the NHS GP Connect API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This component is designed to be easily integrated with the real GP Connect API. The
            data structures match the FHIR resources used by GP Connect, allowing for a seamless transition from mock
            data to real patient records when API access is established.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

