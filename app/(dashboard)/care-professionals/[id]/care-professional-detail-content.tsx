"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { CareProfessionalDetails } from "@/components/care-professionals/care-professional-details"
import { CareProfessionalCredentials } from "@/components/care-professionals/care-professional-credentials"
import { CareProfessionalAppointments } from "@/components/care-professionals/care-professional-appointments"
import { CareProfessionalTasks } from "@/components/care-professionals/care-professional-tasks"
import { ChevronLeft, Pencil, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { CareProfessional } from "@/types"

interface CareProfessionalDetailContentProps {
  careProfessionalId: string
}

export default function CareProfessionalDetailContent({ careProfessionalId }: CareProfessionalDetailContentProps) {
  const router = useRouter()
  const [professional, setProfessional] = useState<CareProfessional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCareProfessional = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/care-professionals/${careProfessionalId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch care professional: ${response.status}`)
        }

        const data = await response.json()
        setProfessional(data)
      } catch (err) {
        console.error("Error fetching care professional:", err)
        setError("Failed to load care professional details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareProfessional()
  }, [careProfessionalId])

  const handleBack = () => {
    router.push("/care-professionals")
  }

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit care professional:", careProfessionalId)
  }

  const handleDelete = () => {
    // Implement delete functionality
    console.log("Delete care professional:", careProfessionalId)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Care Professionals
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Care Professionals
      </Button>

      {isLoading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : professional ? (
        <>
          <PageHeader
            title={`${professional.first_name} ${professional.last_name}`}
            description={professional.role || "Care Professional"}
            actions={
              <>
                <Button variant="outline" onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            }
          />

          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <CareProfessionalDetails professional={professional} />
            </TabsContent>
            <TabsContent value="credentials">
              <CareProfessionalCredentials careProfessionalId={careProfessionalId} />
            </TabsContent>
            <TabsContent value="appointments">
              <CareProfessionalAppointments careProfessionalId={careProfessionalId} />
            </TabsContent>
            <TabsContent value="tasks">
              <CareProfessionalTasks careProfessionalId={careProfessionalId} />
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  )
}
