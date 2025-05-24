"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CareProfessionalDetails } from "@/components/care-professionals/care-professional-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, FileText, User, Award } from "lucide-react"
import type { CareProfessional } from "@/types"

interface CareProfessionalDetailClientProps {
  careProfessional?: CareProfessional
  careProfessionalId?: string
}

export default function CareProfessionalDetailClient({
  careProfessional,
  careProfessionalId,
}: CareProfessionalDetailClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(!careProfessional)
  const [error, setError] = useState<string | null>(null)
  const [professional, setProfessional] = useState<CareProfessional | null>(careProfessional || null)

  useEffect(() => {
    // If we already have the care professional data, no need to fetch
    if (careProfessional) {
      setProfessional(careProfessional)
      return
    }

    // If we have an ID but no data, fetch the data
    if (careProfessionalId) {
      const fetchCareProfessional = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/care-professionals/${careProfessionalId}`)

          if (!response.ok) {
            throw new Error(`Failed to fetch care professional: ${response.statusText}`)
          }

          const data = await response.json()
          setProfessional(data)
        } catch (err) {
          console.error("Error fetching care professional:", err)
          setError(err instanceof Error ? err.message : "Failed to load care professional details")
        } finally {
          setLoading(false)
        }
      }

      fetchCareProfessional()
    }
  }, [careProfessional, careProfessionalId])

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Care Professional Details</h1>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">
            <User className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="credentials">
            <Award className="h-4 w-4 mr-2" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="pt-4">
          <CareProfessionalDetails professional={professional} isLoading={loading} error={error || undefined} />
        </TabsContent>
        <TabsContent value="credentials" className="pt-4">
          <div className="rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Credentials</h3>
            <p className="text-muted-foreground">Professional credentials and certifications will be displayed here.</p>
          </div>
        </TabsContent>
        <TabsContent value="appointments" className="pt-4">
          <div className="rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Appointments</h3>
            <p className="text-muted-foreground">Upcoming and past appointments will be displayed here.</p>
          </div>
        </TabsContent>
        <TabsContent value="notes" className="pt-4">
          <div className="rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-muted-foreground">Clinical notes and observations will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
