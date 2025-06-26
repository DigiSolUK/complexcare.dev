"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { EditCareProfessionalDialog } from "@/components/care-professionals/edit-care-professional-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CareProfessionalDetails } from "@/components/care-professionals/care-professional-details"
import { CareProfessionalCredentials } from "@/components/care-professionals/care-professional-credentials"
import { CareProfessionalAppointments } from "@/components/care-professionals/care-professional-appointments"
import { CareProfessionalTasks } from "@/components/care-professionals/care-professional-tasks"
import type { CareProfessional, ProfessionalCredential, Appointment, Task } from "@/types"

export default function CareProfessionalPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const [careProfessional, setCareProfessional] = useState<CareProfessional | null>(null)
  const [credentials, setCredentials] = useState<ProfessionalCredential[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const [loadingProfessional, setLoadingProfessional] = useState(true)
  const [loadingCredentials, setLoadingCredentials] = useState(true)
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)

  const [errorProfessional, setErrorProfessional] = useState<string | null>(null)
  const [errorCredentials, setErrorCredentials] = useState<string | null>(null)
  const [errorAppointments, setErrorAppointments] = useState<string | null>(null)
  const [errorTasks, setErrorTasks] = useState<string | null>(null)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchCareProfessional = async () => {
    try {
      setLoadingProfessional(true)
      const response = await fetch(`/api/care-professionals/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch care professional: ${response.status}`)
      }

      const data = await response.json()
      setCareProfessional(data)
    } catch (err) {
      console.error("Error fetching care professional:", err)
      setErrorProfessional("Failed to load care professional details. Please try again later.")
    } finally {
      setLoadingProfessional(false)
    }
  }

  const fetchCredentials = async () => {
    try {
      setLoadingCredentials(true)
      const response = await fetch(`/api/care-professionals/${id}/credentials`)
      if (!response.ok) {
        throw new Error(`Failed to fetch credentials: ${response.status}`)
      }
      const data = await response.json()
      setCredentials(data)
    } catch (err) {
      console.error("Error fetching credentials:", err)
      setErrorCredentials("Failed to load credentials.")
    } finally {
      setLoadingCredentials(false)
    }
  }

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true)
      const response = await fetch(`/api/care-professionals/${id}/appointments`)
      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status}`)
      }
      const data = await response.json()
      setAppointments(data)
    } catch (err) {
      console.error("Error fetching appointments:", err)
      setErrorAppointments("Failed to load appointments.")
    } finally {
      setLoadingAppointments(false)
    }
  }

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true)
      const response = await fetch(`/api/care-professionals/${id}/tasks`)
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`)
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setErrorTasks("Failed to load tasks.")
    } finally {
      setLoadingTasks(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCareProfessional()
      fetchCredentials()
      fetchAppointments()
      fetchTasks()
    }
  }, [id])

  const handleCareProfessionalUpdated = () => {
    fetchCareProfessional() // Re-fetch data after update
    setIsEditDialogOpen(false)
  }

  const handleDeleteCareProfessional = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/care-professionals/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to deactivate care professional")
      }

      toast({
        title: "Success!",
        description: "Care professional deactivated successfully.",
      })
      router.push("/care-professionals") // Redirect to list after deactivation
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (loadingProfessional) {
    return <CareProfessionalSkeleton />
  }

  if (errorProfessional) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-3xl">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{errorProfessional}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!careProfessional) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-3xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Care professional not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={careProfessional.avatar_url || "/placeholder.svg?height=80&width=80&query=user avatar"}
                alt={`${careProfessional.first_name} ${careProfessional.last_name}`}
              />
              <AvatarFallback>{`${careProfessional.first_name.charAt(0)}${careProfessional.last_name.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">
                {careProfessional.first_name} {careProfessional.last_name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant={careProfessional.is_active ? "default" : "secondary"}>
                  {careProfessional.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{careProfessional.role}</Badge>
                {careProfessional.employment_status && (
                  <Badge variant="outline">{careProfessional.employment_status}</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                Deactivate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="mb-4 grid w-full grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <CareProfessionalDetails
                professional={careProfessional}
                isLoading={loadingProfessional}
                error={errorProfessional}
              />
            </TabsContent>

            <TabsContent value="credentials" className="space-y-4">
              <CareProfessionalCredentials
                credentials={credentials}
                isLoading={loadingCredentials}
                error={errorCredentials}
                onCredentialUpdated={fetchCredentials} // Pass refetch function
                onCredentialDeleted={fetchCredentials} // Pass refetch function
              />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              <CareProfessionalAppointments
                appointments={appointments}
                isLoading={loadingAppointments}
                error={errorAppointments}
                onAppointmentUpdated={fetchAppointments} // Pass refetch function
                onAppointmentDeleted={fetchAppointments} // Pass refetch function
              />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <CareProfessionalTasks
                tasks={tasks}
                isLoading={loadingTasks}
                error={errorTasks}
                onTaskUpdated={fetchTasks} // Pass refetch function
                onTaskDeleted={fetchTasks} // Pass refetch function
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {careProfessional && (
        <EditCareProfessionalDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onCareProfessionalUpdated={handleCareProfessionalUpdated}
          careProfessional={careProfessional}
        />
      )}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCareProfessional}
        title="Deactivate Care Professional"
        description="Are you sure you want to deactivate this care professional? They will no longer be active in the system, but their data will be retained."
        confirmText="Deactivate"
        isDestructive
        loading={deleting}
      />
    </div>
  )
}

function CareProfessionalSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="h-20 w-20 rounded-full">
              <div className="h-20 w-20 rounded-full" />
            </div>
            <div className="flex-1">
              <div className="h-8 w-48 mb-2" />
              <div className="flex gap-2">
                <div className="h-5 w-16" />
                <div className="h-5 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32" />
              <div className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-2 mb-4">
            <div className="h-10 w-64" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-20" />
                <div className="h-6 w-40" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20" />
                <div className="h-6 w-40" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20" />
                <div className="h-6 w-40" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20" />
                <div className="h-6 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
