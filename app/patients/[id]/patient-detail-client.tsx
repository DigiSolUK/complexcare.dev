"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Mail, Phone, PlusCircle, ArrowLeft, Edit, AlertTriangle, RefreshCcw } from "lucide-react"

interface Patient {
  id: string
  title?: string
  first_name: string
  last_name: string
  nhs_number?: string
  date_of_birth: string
  gender?: string
  address?: string
  postcode?: string
  phone_number?: string
  email?: string
  status?: string
  is_active?: boolean
  medical_history?: string
  medications?: string
  allergies?: string
  care_needs?: string
  created_at: string
  updated_at: string
  avatar_url?: string
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

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)

  const fetchPatient = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log(`Fetching patient with ID: ${patientId}`)
      const response = await fetch(`/api/patients/${patientId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch patient: ${response.status}`)
      }

      const data = await response.json()
      console.log("Patient data received:", data)
      setPatient(data)
    } catch (err: any) {
      console.error("Error fetching patient:", err)
      setError(err.message || "Failed to load patient data.")
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }

  const handleRetry = () => {
    setRetrying(true)
    fetchPatient()
  }

  useEffect(() => {
    fetchPatient()
  }, [patientId])

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-center">
            <div className="h-12 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-6 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    )
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

  // Function to safely format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "PPP")
    } catch (e) {
      console.error("Error formatting date:", e)
      return dateString
    }
  }

  // Function to safely get status
  const getStatus = () => {
    if (patient.status) return patient.status
    if (patient.is_active !== undefined) return patient.is_active ? "Active" : "Inactive"
    return "Unknown"
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
              {patient.avatar_url ? (
                <AvatarImage
                  src={patient.avatar_url || "/placeholder.svg"}
                  alt={`${patient.first_name} ${patient.last_name}`}
                />
              ) : (
                <AvatarImage
                  src={`https://avatars.dicebear.com/api/initials/${patient.first_name?.charAt(0)}${patient.last_name?.charAt(0)}.svg`}
                  alt={`${patient.first_name} ${patient.last_name}`}
                />
              )}
              <AvatarFallback>{`${patient.first_name?.charAt(0) || ""}${patient.last_name?.charAt(0) || ""}`}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">
                    {patient.title ? `${patient.title} ` : ""}
                    {patient.first_name || "Unknown"} {patient.last_name || ""}
                  </CardTitle>
                  <CardDescription>
                    NHS Number: {patient.nhs_number || "N/A"} | DOB: {formatDate(patient.date_of_birth)} (
                    {patient.date_of_birth ? calculateAge(patient.date_of_birth) : "N/A"} years)
                  </CardDescription>
                </div>
                <Badge variant={getStatus().toLowerCase() === "active" ? "default" : "secondary"} className="h-6">
                  {getStatus()}
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
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{patient.phone_number || "N/A"}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{patient.email || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>
                    {patient.address || "N/A"}
                    {patient.address && patient.postcode ? `, ${patient.postcode}` : patient.postcode || ""}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Care Needs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patient.care_needs || "No care needs recorded"}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{patient.medical_history || "No medical history recorded"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{patient.medications || "No medications recorded"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patient.allergies || "No allergies recorded"}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clinical Notes</CardTitle>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                No clinical notes available. Add a new note to get started.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
