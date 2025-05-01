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
  Clock,
  FileText,
  Heart,
  Home,
  Mail,
  MapPin,
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

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPatient() {
      try {
        setLoading(true)
        const response = await fetch(`/api/patients/${id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch patient: ${response.status}`)
        }

        const data = await response.json()
        setPatient(data)
      } catch (err) {
        console.error("Error fetching patient:", err)
        setError("Failed to load patient details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [id])

  if (loading) {
    return <PatientDetailSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
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
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
                src={`/placeholder.svg?height=80&width=80&query=${patient.first_name.charAt(0)}${patient.last_name.charAt(0)}`}
                alt={`${patient.first_name} ${patient.last_name}`}
              />
              <AvatarFallback>{`${patient.first_name.charAt(0)}${patient.last_name.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">
                    {patient.first_name} {patient.last_name}
                  </CardTitle>
                  <CardDescription>
                    NHS Number: {patient.nhs_number} | DOB: {format(new Date(patient.date_of_birth), "PPP")} (
                    {calculateAge(patient.date_of_birth)} years)
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
                    <dd>{patient.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <Home className="mr-2 h-4 w-4" /> Address
                    </dt>
                    <dd>
                      {patient.address.street}
                      <br />
                      {patient.address.city}, {patient.address.postcode}
                      <br />
                      {patient.address.country}
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
                    <dd>{patient.contact.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </dt>
                    <dd>{patient.contact.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4" /> Emergency Contact
                    </dt>
                    <dd>
                      {patient.contact.emergency_contact_name} ({patient.contact.emergency_contact_relationship})<br />
                      {patient.contact.emergency_contact_phone}
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
                  <dd>{patient.medical_information.primary_condition}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Primary Care Provider</dt>
                  <dd>
                    {patient.medical_information.primary_care_provider} |{" "}
                    {patient.medical_information.primary_care_provider_contact}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Allergies</dt>
                  <dd>
                    {patient.medical_information.allergies.length > 0 ? (
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
                {patient.medications.length > 0 ? (
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
                {patient.appointments.filter((app) => new Date(app.date) > new Date() && app.status === "scheduled")
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
                  <div className="text-2xl font-bold">{patient.medical_information.height} cm</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Weight</div>
                  <div className="text-2xl font-bold">{patient.medical_information.weight} kg</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">BMI</div>
                  <div className="text-2xl font-bold">{patient.medical_information.bmi.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">{getBMICategory(patient.medical_information.bmi)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Blood Type</div>
                  <div className="font-medium">{patient.medical_information.blood_type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Smoking Status</div>
                  <div className="font-medium">{patient.medical_information.smoking_status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Alcohol Consumption</div>
                  <div className="font-medium">{patient.medical_information.alcohol_consumption}</div>
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
                  {patient.medications.length > 0 ? (
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
                <div className="text-sm text-muted-foreground">
                  Last updated: {format(new Date(patient.care_plan.updated_date), "PPP")}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Goals</h3>
                  <ul className="space-y-2">
                    {patient.care_plan.goals.map((goal, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1 h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Interventions</h3>
                  <ul className="space-y-2">
                    {patient.care_plan.interventions.map((intervention, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1 h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        {intervention}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Assigned Care Professionals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patient.care_plan.assigned_care_professionals.map((cp, index) => (
                      <div key={index} className="flex items-center p-3 border rounded-md">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>
                            {cp.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{cp.name}</div>
                          <div className="text-sm text-muted-foreground">{cp.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Update Care Plan
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Export Care Plan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Appointments
                </CardTitle>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <AppointmentsList
                    appointments={patient.appointments.filter(
                      (app) => new Date(app.date) > new Date() && app.status === "scheduled",
                    )}
                  />
                </TabsContent>

                <TabsContent value="past">
                  <AppointmentsList
                    appointments={patient.appointments.filter(
                      (app) => new Date(app.date) < new Date() || app.status === "completed",
                    )}
                  />
                </TabsContent>

                <TabsContent value="all">
                  <AppointmentsList appointments={patient.appointments} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Clinical Notes
                </CardTitle>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {patient.notes.length > 0 ? (
                <div className="space-y-4">
                  {patient.notes
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((note, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                          <div className="font-medium">{note.author}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(note.date), "PPP 'at' p")}
                          </div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No clinical notes recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentsList({ appointments }: { appointments: any[] }) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No appointments found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((appointment, index) => (
          <div key={index} className="border rounded-md p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
              <div className="font-medium">{appointment.type}</div>
              <Badge variant={appointment.status === "scheduled" ? "outline" : "secondary"}>{appointment.status}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(new Date(appointment.date), "PPP")}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(new Date(appointment.date), "p")}
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                {appointment.care_professional}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                {appointment.location}
              </div>
            </div>
            {appointment.notes && (
              <div className="mt-2 text-sm">
                <div className="font-medium">Notes:</div>
                <p className="text-muted-foreground">{appointment.notes}</p>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

function PatientDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      <Skeleton className="h-40 w-full mb-6" />

      <div className="mb-4">
        <Skeleton className="h-10 w-96" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

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

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}
