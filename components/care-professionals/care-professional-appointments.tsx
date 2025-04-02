"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Plus, RefreshCw, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format, addDays, subDays } from "date-fns"

interface CareProfessionalAppointmentsProps {
  professionalId: string
}

export function CareProfessionalAppointments({ professionalId }: CareProfessionalAppointmentsProps) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [professionalId])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real app, fetch from API
      // const response = await fetch(`/api/care-professionals/${professionalId}/appointments`)
      // if (!response.ok) throw new Error("Failed to fetch appointments")
      // const data = await response.json()

      // For demo purposes, use mock data
      const demoAppointments = getDemoAppointments(professionalId)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAppointments(demoAppointments)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setError("Failed to load appointments")
      setAppointments(getDemoAppointments(professionalId)) // Fallback to demo data
    } finally {
      setLoading(false)
    }
  }

  const getDemoAppointments = (id: string) => {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    const yesterday = subDays(today, 1)
    const nextWeek = addDays(today, 7)

    // Base appointments
    const baseAppointments = [
      {
        id: `apt-${id}-1`,
        patient_id: "pat-001",
        patient_name: "John Smith",
        date: format(tomorrow, "yyyy-MM-dd"),
        time: "10:00",
        duration: 60,
        type: "Assessment",
        status: "scheduled",
        location: "Patient's Home",
        notes: "Initial assessment for new care plan",
      },
      {
        id: `apt-${id}-2`,
        patient_id: "pat-002",
        patient_name: "Mary Johnson",
        date: format(yesterday, "yyyy-MM-dd"),
        time: "14:30",
        duration: 45,
        type: "Follow-up",
        status: "completed",
        location: "Clinic",
        notes: "Review of medication changes",
      },
      {
        id: `apt-${id}-3`,
        patient_id: "pat-003",
        patient_name: "David Williams",
        date: format(nextWeek, "yyyy-MM-dd"),
        time: "11:15",
        duration: 30,
        type: "Consultation",
        status: "scheduled",
        location: "Video Call",
        notes: "Discuss test results",
      },
      {
        id: `apt-${id}-4`,
        patient_id: "pat-004",
        patient_name: "Elizabeth Brown",
        date: format(today, "yyyy-MM-dd"),
        time: "16:00",
        duration: 60,
        type: "Treatment",
        status: "in-progress",
        location: "Patient's Home",
        notes: "Weekly therapy session",
      },
    ]

    // Customize based on professional ID
    if (id === "cp-001") {
      // Nurse
      baseAppointments[0].type = "Medication Review"
      baseAppointments[1].type = "Wound Care"
    } else if (id === "cp-002") {
      // Physiotherapist
      baseAppointments[0].type = "Physical Assessment"
      baseAppointments[1].type = "Rehabilitation Session"
    } else if (id === "cp-003") {
      // Occupational Therapist
      baseAppointments[0].type = "Home Assessment"
      baseAppointments[1].type = "ADL Training"
    }

    return baseAppointments
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Scheduled
          </Badge>
        )
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Appointments</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchAppointments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Recent Appointments</CardTitle>
          <CardDescription>View and manage appointments for this care professional</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {appointment.time} ({appointment.duration} min)
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{appointment.patient_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>{appointment.location}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

