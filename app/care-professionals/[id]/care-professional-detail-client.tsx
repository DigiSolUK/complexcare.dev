"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define the interface for a care professional
interface CareProfessional {
  id: string
  title?: string
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  role?: string
  specialization?: string
  qualification?: string
  registration_number?: string
  status?: "active" | "inactive" | "pending"
  credentials?: Credential[]
  appointments?: Appointment[]
  tasks?: Task[]
  patients?: Patient[]
  avatar_url?: string
  bio?: string
  created_at?: string
  updated_at?: string
}

interface Credential {
  id: string
  type: string
  status: string
  expiry_date?: string
  issued_date?: string
  document_url?: string
}

interface Appointment {
  id: string
  title: string
  start_time: string
  end_time: string
  status: string
  patient_id?: string
  patient_name?: string
}

interface Task {
  id: string
  title: string
  description?: string
  due_date?: string
  status: string
  priority: string
}

interface Patient {
  id: string
  first_name: string
  last_name: string
}

export default function CareProfessionalDetailClient({ careProfessionalId }: { careProfessionalId: string }) {
  const router = useRouter()
  const [careProfessional, setCareProfessional] = useState<CareProfessional | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCareProfessional = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/care-professionals/${careProfessionalId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch care professional: ${response.status}`)
        }

        const data = await response.json()
        console.log("Care professional data:", data)
        setCareProfessional(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching care professional:", err)
        setError("Failed to load care professional details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (careProfessionalId) {
      fetchCareProfessional()
    }
  }, [careProfessionalId])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/care-professionals")}>Return to Care Professionals</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!careProfessional) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Care Professional Not Found</h2>
            <p className="text-gray-600 mb-4">The requested care professional could not be found.</p>
            <Button onClick={() => router.push("/care-professionals")}>Return to Care Professionals</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const fullName = `${careProfessional.title ? careProfessional.title + " " : ""}${careProfessional.first_name} ${careProfessional.last_name}`
  const initials = `${careProfessional.first_name?.charAt(0) || ""}${careProfessional.last_name?.charAt(0) || ""}`

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card with Profile Info */}
      <Card className="mx-auto max-w-4xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="w-24 h-24 border-2 border-gray-200">
              <AvatarImage src={careProfessional.avatar_url || ""} alt={fullName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{fullName}</h1>
                <p className="text-gray-500">{careProfessional.role || "Care Professional"}</p>
                {careProfessional.specialization && <p className="text-gray-600">{careProfessional.specialization}</p>}
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant={careProfessional.status === "active" ? "default" : "secondary"}>
                  {careProfessional.status?.charAt(0).toUpperCase() + careProfessional.status?.slice(1) ||
                    "Status Unknown"}
                </Badge>
                {careProfessional.qualification && <Badge variant="outline">{careProfessional.qualification}</Badge>}
              </div>

              <div className="flex flex-col gap-1 pt-2">
                {careProfessional.email && (
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {careProfessional.email}
                  </p>
                )}
                {careProfessional.phone_number && (
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {careProfessional.phone_number}
                  </p>
                )}
                {careProfessional.registration_number && (
                  <p className="text-sm">
                    <span className="font-medium">Registration No:</span> {careProfessional.registration_number}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push(`/care-professionals/${careProfessionalId}/edit`)}>
                Edit Profile
              </Button>
              <Button variant="outline" onClick={() => router.push("/care-professionals")}>
                Back to List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Card className="mx-auto max-w-4xl">
        <Tabs defaultValue="overview" className="w-full">
          <CardHeader>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Bio</h3>
                <p className="text-gray-600">{careProfessional.bio || "No biography available."}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Created</p>
                    <p>
                      {careProfessional.created_at
                        ? new Date(careProfessional.created_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p>
                      {careProfessional.updated_at
                        ? new Date(careProfessional.updated_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="credentials" className="space-y-4">
              {careProfessional.credentials && careProfessional.credentials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careProfessional.credentials.map((credential) => (
                    <Card key={credential.id}>
                      <CardHeader className="py-4">
                        <CardTitle className="text-base">{credential.type}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <Badge
                            variant={
                              credential.status === "valid"
                                ? "default"
                                : credential.status === "expired"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {credential.status}
                          </Badge>
                        </div>
                        {credential.issued_date && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Issued:</span>
                            <span>{new Date(credential.issued_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {credential.expiry_date && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expires:</span>
                            <span>{new Date(credential.expiry_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {credential.document_url && (
                          <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                            <a href={credential.document_url} target="_blank" rel="noopener noreferrer">
                              View Document
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No credentials found for this care professional.</p>
              )}
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              {careProfessional.appointments && careProfessional.appointments.length > 0 ? (
                <div className="space-y-4">
                  {careProfessional.appointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{appointment.title}</h4>
                            {appointment.patient_name && (
                              <p className="text-sm text-gray-500">Patient: {appointment.patient_name}</p>
                            )}
                          </div>
                          <Badge>{appointment.status}</Badge>
                        </div>
                        <div className="flex justify-between mt-4 text-sm">
                          <div className="flex flex-col">
                            <span className="text-gray-500">Start</span>
                            <span>{new Date(appointment.start_time).toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500">End</span>
                            <span>{new Date(appointment.end_time).toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No appointments scheduled for this care professional.</p>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {careProfessional.tasks && careProfessional.tasks.length > 0 ? (
                <div className="space-y-4">
                  {careProfessional.tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge>{task.status}</Badge>
                            <Badge variant="outline">{task.priority}</Badge>
                          </div>
                        </div>
                        {task.due_date && (
                          <div className="mt-4 text-sm">
                            <span className="text-gray-500">Due: </span>
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No tasks assigned to this care professional.</p>
              )}
            </TabsContent>

            <TabsContent value="patients" className="space-y-4">
              {careProfessional.patients && careProfessional.patients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {careProfessional.patients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/patients/${patient.id}`)}
                    >
                      <CardContent className="flex items-center p-4">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback>
                            {patient.first_name.charAt(0)}
                            {patient.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {patient.first_name} {patient.last_name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No patients assigned to this care professional.</p>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="w-24 h-24 rounded-full" />

            <div className="flex-1 space-y-4 w-full">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <div className="grid grid-cols-5 w-full gap-2">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
