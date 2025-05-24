"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronLeft, AlertCircle } from "lucide-react"
import { CareProfessionalDetails } from "@/components/care-professionals/care-professional-details"
import { CareProfessionalCredentials } from "@/components/care-professionals/care-professional-credentials"
import { CareProfessionalAppointments } from "@/components/care-professionals/care-professional-appointments"
import { CareProfessionalTasks } from "@/components/care-professionals/care-professional-tasks"
import { PatientAssignmentList } from "@/components/care-professionals/patient-assignment-list"

interface CareProfessionalDetailContentProps {
  id: string
  tenantId?: string
}

export default function CareProfessionalDetailContent({ id, tenantId }: CareProfessionalDetailContentProps) {
  const router = useRouter()
  const [professional, setProfessional] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const fetchCareProfessional = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/care-professionals/${id}${tenantId ? `?tenantId=${tenantId}` : ""}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setProfessional(data.data)
      } catch (err) {
        console.error("Error fetching care professional:", err)
        setError("Failed to load care professional details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareProfessional()
  }, [id, tenantId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => router.back()} disabled>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-9 w-60" />
        </div>

        <Skeleton className="h-[500px] w-full rounded-md" />
      </div>
    )
  }

  if (error || !professional) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Care Professional Details</h1>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Failed to load care professional details. Please try again."}</AlertDescription>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {professional.title ? `${professional.title} ` : ""}
            {professional.first_name} {professional.last_name}
          </h1>
        </div>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <CareProfessionalDetails professional={professional} />
        </TabsContent>

        <TabsContent value="patients" className="mt-0">
          <PatientAssignmentList
            careProfessionalId={id}
            tenantId={tenantId}
            includeEnded={false}
            allowAdd={true}
            allowRemove={true}
          />
        </TabsContent>

        <TabsContent value="credentials" className="mt-0">
          <CareProfessionalCredentials careProfessionalId={id} tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="appointments" className="mt-0">
          <CareProfessionalAppointments careProfessionalId={id} tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-0">
          <CareProfessionalTasks careProfessionalId={id} tenantId={tenantId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
