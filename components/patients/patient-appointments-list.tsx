"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Plus, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Appointment {
  id: string
  title: string
  date: string
  time: string
  duration: number
  provider: string
  location: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes?: string
}

interface PatientAppointmentsListProps {
  patientId: string
}

export default function PatientAppointmentsList({ patientId }: PatientAppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would fetch from an API
        // For now, we'll use mock data
        const mockAppointments: Appointment[] = [
          {
            id: "1",
            title: "Regular Checkup",
            date: "2023-06-15",
            time: "09:30",
            duration: 30,
            provider: "Dr. Smith",
            location: "Main Clinic, Room 3",
            status: "completed",
            notes: "Blood pressure normal. Weight stable. Discussed diet and exercise.",
          },
          {
            id: "2",
            title: "Diabetes Review",
            date: "2023-09-22",
            time: "14:00",
            duration: 45,
            provider: "Dr. Johnson",
            location: "Diabetes Clinic, Room 5",
            status: "completed",
            notes: "HbA1c improved to 6.8%. Continuing current medication regimen.",
          },
          {
            id: "3",
            title: "Annual Physical",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            time: "10:15",
            duration: 60,
            provider: "Dr. Smith",
            location: "Main Clinic, Room 2",
            status: "scheduled",
            notes: "Comprehensive annual physical examination.",
          },
          {
            id: "4",
            title: "Blood Test",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            time: "08:00",
            duration: 15,
            provider: "Nurse Williams",
            location: "Laboratory, Floor 1",
            status: "scheduled",
            notes: "Fasting blood test for lipid profile and glucose levels.",
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        setAppointments(mockAppointments)
      } catch (err: any) {
        console.error("Error fetching appointments:", err)
        setError(err.message || "Failed to load appointments")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchAppointments()
    }
  }, [patientId])

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      case "no-show":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">No Show</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md p-4">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Appointments</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort appointments by date (upcoming first, then past)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    const now = new Date()

    // Check if appointments are in the future or past
    const aInFuture = dateA > now
    const bInFuture = dateB > now

    // If one is in the future and one is in the past, prioritize future
    if (aInFuture && !bInFuture) return -1
    if (!aInFuture && bInFuture) return 1

    // If both are in the future or both in the past, sort by date
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Appointments</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Appointments</h3>
            <p className="text-muted-foreground">No appointments found for this patient.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{appointment.title}</h3>
                  {getStatusBadge(appointment.status)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Date: </span>
                    <span className="text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Time: </span>
                    <span className="text-sm">{appointment.time}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Duration: </span>
                    <span className="text-sm">{appointment.duration} minutes</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Provider: </span>
                    <span className="text-sm">{appointment.provider}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm text-muted-foreground">Location: </span>
                    <span className="text-sm">{appointment.location}</span>
                  </div>
                </div>
                {appointment.notes && <p className="text-sm">{appointment.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
