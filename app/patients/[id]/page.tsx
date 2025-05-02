"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calendar,
  FileText,
  Heart,
  Home,
  Mail,
  Phone,
  PlusCircle,
  User,
  ArrowLeft,
  Edit,
  AlertCircle,
  Pill,
  CalendarClock,
  ClipboardList,
  Activity,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react"

interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  nhs_number: string
  gender: string
  status: string
  address: {
    street: string
    city: string
    postcode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    emergency_contact_name: string
    emergency_contact_phone: string
    emergency_contact_relationship: string
  }
  medical_information: {
    primary_care_provider: string
    primary_care_provider_contact: string
    primary_condition: string
    allergies: string[]
    blood_type: string
    height: number
    weight: number
    bmi: number
    smoking_status: string
    alcohol_consumption: string
  }
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    start_date: string
    prescribing_doctor: string
  }>
  care_plan: {
    id: string
    created_date: string
    updated_date: string
    goals: string[]
    interventions: string[]
    assigned_care_professionals: Array<{
      id: string
      name: string
      role: string
    }>
  }
  appointments: Array<{
    id: string
    date: string
    type: string
    care_professional: string
    location: string
    status: string
    notes: string
  }>
  notes: Array<{
    id: string
    date: string
    author: string
    content: string
  }>
  created_at: string
  updated_at: string
}

// Skeleton component for loading state
const PatientDetailSkeleton = () => (
  <div className="container mx-auto py-6 px-4">
    <div className="mb-6">
      <Skeleton className="h-8 w-32" />
    </div>
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardHeader>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </CardContent>
      </Card>
    </div>
  </div>
)

// Function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

// Function to determine BMI category
const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) {
    return "Underweight"
  } else if (bmi < 25) {
    return "Normal weight"
  } else if (bmi < 30) {
    return "Overweight"
  } else {
    return "Obese"
  }
}

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)

  async function fetchPatient() {
    try {
      setLoading(true)
      setError(null)

      console.log(`Fetching patient with ID: ${id}`)
      const response = await fetch(`/api/patients/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch patient: ${response.status}`)
      }

      const data = await response.json()
      console.log("Patient data received:", data)
      setPatient(data)
    } catch (err) {
      console.error("Error fetching patient:", err)
      setError("Failed to load patient details. Please try again later.")
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }

  // Function to handle retry
  const handleRetry = () => {
    setRetrying(true)
    fetchPatient()
  }

  useEffect(() => {
    fetchPatient()

    // Auto retry once after a delay if there's an error
    return () => {
      // Cleanup
    }
  }, [id])

  // Auto retry once after initial error
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout

    if (error && !retrying) {
      retryTimeout = setTimeout(() => {
        console.log("Auto-retrying patient fetch...")
        handleRetry()
      }, 2000)
    }

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout)
    }
  }, [error, retrying])

  if (loading) {
    return <PatientDetailSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Patient</h2>
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={handleRetry} disabled={retrying}>
                {retrying ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retry
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Patient not found</p>
              <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Patients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Safely access nested properties
  const getNestedProperty = (obj: any, path: string, defaultValue: any = "N/A") => {
    const properties = path.split(".")
    let value = obj

    for (const prop of properties) {
      if (value === null || value === undefined || typeof value !== "object") {
        return defaultValue
      }
      value = value[prop]
    }

    return value !== null && value !== undefined ? value : defaultValue
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Care Plan
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`/placeholder.svg?height=80&width=80&query=${patient.first_name?.charAt(0) || ""}${patient.last_name?.charAt(0) || ""}`}
                alt={`${patient.first_name || ""} ${patient.last_name || ""}`}
              />
              <AvatarFallback>{`${patient.first_name?.charAt(0) || ""}${patient.last_name?.charAt(0) || ""}`}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">
                    {patient.first_name || "Unknown"} {patient.last_name || ""}
                  </CardTitle>
                  <CardDescription>
                    NHS Number: {patient.nhs_number || "N/A"} | DOB:{" "}
                    {patient.date_of_birth ? format(new Date(patient.date_of_birth), "PPP") : "N/A"} (
                    {patient.date_of_birth ? calculateAge(patient.date_of_birth) : "N/A"} years)
                  </CardDescription>
                </div>
                <Badge variant={patient.status === "active" ? "default" : "secondary"} className="h-6">
                  {patient.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                    <dd>{patient.gender || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <Home className="mr-2 h-4 w-4" /> Address
                    </dt>
                    <dd>
                      {getNestedProperty(patient, "address.street")}
                      <br />
                      {getNestedProperty(patient, "address.city")}, {getNestedProperty(patient, "address.postcode")}
                      <br />
                      {getNestedProperty(patient, "address.country")}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <Phone className="mr-2 h-4 w-4" /> Phone
                    </dt>
                    <dd>{getNestedProperty(patient, "contact.phone")}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </dt>
                    <dd>{getNestedProperty(patient, "contact.email")}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4" /> Emergency Contact
                    </dt>
                    <dd>
                      {getNestedProperty(patient, "contact.emergency_contact_name")} (
                      {getNestedProperty(patient, "contact.emergency_contact_relationship")})<br />
                      {getNestedProperty(patient, "contact.emergency_contact_phone")}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Medical Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Primary Condition</dt>
                  <dd>{getNestedProperty(patient, "medical_information.primary_condition")}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Primary Care Provider</dt>
                  <dd>
                    {getNestedProperty(patient, "medical_information.primary_care_provider")} |{" "}
                    {getNestedProperty(patient, "medical_information.primary_care_provider_contact")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Allergies</dt>
                  <dd>
                    {patient.medical_information?.allergies && patient.medical_information.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {patient.medical_information.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "None reported"
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Pill className="mr-2 h-5 w-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medications && patient.medications.length > 0 ? (
                  <ul className="space-y-2">
                    {patient.medications.map((medication, index) => (
                      <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                        <div className="font-medium">
                          {medication.name} ({medication.dosage})
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {medication.frequency} | Prescribed by {medication.prescribing_doctor}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No current medications</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.appointments &&
                patient.appointments.filter((app) => new Date(app.date) > new Date() && app.status === "scheduled")
                  .length > 0 ? (
                  <ul className="space-y-2">
                    {patient.appointments
                      .filter((app) => new Date(app.date) > new Date() && app.status === "scheduled")
                      .slice(0, 3)
                      .map((appointment, index) => (
                        <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                          <div className="font-medium">{appointment.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(appointment.date), "PPP 'at' p")} | {appointment.care_professional}
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>No upcoming appointments</p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Height</div>
                  <div className="text-2xl font-bold">
                    {getNestedProperty(patient, "medical_information.height", "N/A")}{" "}
                    {patient.medical_information?.height ? "cm" : ""}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Weight</div>
                  <div className="text-2xl font-bold">
                    {getNestedProperty(patient, "medical_information.weight", "N/A")}{" "}
                    {patient.medical_information?.weight ? "kg" : ""}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">BMI</div>
                  <div className="text-2xl font-bold">
                    {patient.medical_information?.bmi ? patient.medical_information.bmi.toFixed(1) : "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {patient.medical_information?.bmi ? getBMICategory(patient.medical_information.bmi) : ""}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Blood Type</div>
                  <div className="font-medium">{getNestedProperty(patient, "medical_information.blood_type")}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Smoking Status</div>
                  <div className="font-medium">{getNestedProperty(patient, "medical_information.smoking_status")}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Alcohol Consumption</div>
                  <div className="font-medium">
                    {getNestedProperty(patient, "medical_information.alcohol_consumption")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="mr-2 h-5 w-5" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Prescribing Doctor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.medications && patient.medications.length > 0 ? (
                    patient.medications.map((medication, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{medication.name}</TableCell>
                        <TableCell>{medication.dosage}</TableCell>
                        <TableCell>{medication.frequency}</TableCell>
                        <TableCell>{format(new Date(medication.start_date), "PPP")}</TableCell>
                        <TableCell>{medication.prescribing_doctor}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No medications recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Medication
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="care-plan" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <CardTitle className="flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Care Plan
                </CardTitle>
                {patient.care_plan?.updated_date && (
                  <div className="text-sm text-muted-foreground">
                    Last updated: {format(new Date(patient.care_plan.updated_date), "PPP")}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {patient.care_plan ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Goals</h3>
                    <ul className="space-y-2">
                      {patient.care_plan.goals?.map((goal, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1 h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          {goal}
                        </li>
                      )) || <p>No goals defined</p>}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Interventions</h3>
                    <ul className="space-y-2">
                      {patient.care_plan.interventions?.map((intervention, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1 h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          {intervention}
                        </li>
                      )) || <p>No interventions defined</p>}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Assigned Care Professionals</h3>
                    {patient.care_plan.assigned_care_professionals &&
                    patient.care_plan.assigned_care_professionals.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patient.care_plan.assigned_care_professionals.map((professional) => (
                            <TableRow key={professional.id}>
                              <TableCell className="font-medium">{professional.name}</TableCell>
                              <TableCell>{professional.role}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p>No care professionals assigned</p>
                    )}
                  </div>
                </div>
              ) : (
                <p>No care plan available</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Care Plan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Care Professional</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.appointments && patient.appointments.length > 0 ? (
                    patient.appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{format(new Date(appointment.date), "PPP")}</TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>{appointment.care_professional}</TableCell>
                        <TableCell>{appointment.location}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                        <TableCell>{appointment.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No appointments recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.notes && patient.notes.length > 0 ? (
                <ul className="space-y-4">
                  {patient.notes.map((note) => (
                    <li key={note.id} className="border rounded-md p-4">
                      <div className="mb-2">
                        <div className="font-medium">{note.author}</div>
                        <div className="text-sm text-muted-foreground">{format(new Date(note.date), "PPP p")}</div>
                      </div>
                      <p>{note.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notes recorded</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
