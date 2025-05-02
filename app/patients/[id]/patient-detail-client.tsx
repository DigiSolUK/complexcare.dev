"use client"

import { useState, useEffect } from "react"
import { getPatientById } from "@/lib/services/patient-service"
import { withErrorHandling } from "@/lib/error-utils"

import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Heart,
  Home,
  Mail,
  Phone,
  PlusCircle,
  User,
  ArrowLeft,
  Edit,
  CalendarClock,
  ClipboardList,
  Activity,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Patient interface and other utility functions remain the same...

// Wrap the API call with error handling
const getPatientWithErrorHandling = withErrorHandling(getPatientById, {
  section: "Patient Detail",
  operation: "Fetch Patient Data",
})

interface Patient {
  id: string
  first_name: string
  last_name: string
  nhs_number: string
  date_of_birth: string
  gender: string
  address: string
  phone_number: string
  email: string
  status: string
  created_at: string
  updated_at: string
}

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

const fetchPatientData = async (id: string): Promise<Patient> => {
  try {
    const response = await fetch(`/api/patients/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch patient: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  } catch (error: any) {
    console.error("Error fetching patient:", error)
    throw error
  }
}

export default function PatientDetailClient() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)

  const fetchPatient = async () => {
    setLoading(true)
    setError(null)
    try {
      const patientData = await fetchPatientData(id)
      setPatient(patientData)
    } catch (err: any) {
      setError(err.message || "Failed to load patient data.")
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setRetrying(true)
    fetchPatient()
    setTimeout(() => {
      setRetrying(false)
    }, 5000) // Stop retrying after 5 seconds
  }

  useEffect(() => {
    fetchPatient()
  }, [id])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        if (error) {
          handleRetry()
        }
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <AnimatedContainer animation="fadeIn">
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
      </AnimatedContainer>
    )
  }

  if (!patient) {
    return (
      <AnimatedContainer animation="fadeIn">
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
      </AnimatedContainer>
    )
  }

  // Rest of the component remains the same, but wrap sections in AnimatedContainer
  return (
    <div className="container mx-auto py-6 px-4">
      <AnimatedContainer animation="slideUp" duration={0.4}>
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
      </AnimatedContainer>

      <AnimatedContainer animation="fadeIn" delay={0.1}>
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
      </AnimatedContainer>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Wrap each TabsContent in AnimatedContainer */}
        <TabsContent value="overview" className="space-y-4">
          <AnimatedContainer animation="fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Details about the patient's contact information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.phone_number || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.address || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animation="fadeIn" delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>Details about the patient's emergency contact.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>John Doe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>(123) 456-7890</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>Son</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </TabsContent>

        {/* Other TabsContent sections remain the same */}
        <TabsContent value="medical" className="space-y-4">
          <AnimatedContainer animation="fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Past medical conditions and treatments.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Condition</TableHead>
                      <TableHead>Date Diagnosed</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Hypertension</TableCell>
                      <TableCell>2018-05-15</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Diabetes</TableCell>
                      <TableCell>2020-02-20</TableCell>
                      <TableCell>Controlled</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </TabsContent>

        <TabsContent value="care-plan" className="space-y-4">
          <AnimatedContainer animation="fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Care Plan</CardTitle>
                <CardDescription>Details of the patient's current care plan.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <span>Regular check-ups</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>Physical therapy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AnimatedContainer animation="fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Scheduled appointments for the patient.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-03-10</TableCell>
                      <TableCell>10:00 AM</TableCell>
                      <TableCell>Check-up with Dr. Smith</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-03-15</TableCell>
                      <TableCell>02:00 PM</TableCell>
                      <TableCell>Physical therapy session</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <AnimatedContainer animation="fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
                <CardDescription>Important notes about the patient's condition and treatment.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Patient reports feeling better after starting new medication.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>Next appointment scheduled for March 10, 2024.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}
