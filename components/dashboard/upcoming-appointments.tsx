"use client"

import { Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Appointment = {
  id: string
  patientName: string
  patientInitials: string
  careProfessionalName: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  appointmentType: string
  location: string
  status: "scheduled" | "confirmed" | "cancelled" | "completed" | "no_show"
}

export function UpcomingAppointments() {
  const appointments: Appointment[] = [
    {
      id: "A001",
      patientName: "John Doe",
      patientInitials: "JD",
      careProfessionalName: "Dr. Sarah Johnson",
      appointmentDate: "2023-06-15",
      appointmentTime: "09:00",
      duration: 30,
      appointmentType: "Check-up",
      location: "Room 101",
      status: "scheduled",
    },
    {
      id: "A002",
      patientName: "Jane Smith",
      patientInitials: "JS",
      careProfessionalName: "Dr. Michael Chen",
      appointmentDate: "2023-06-15",
      appointmentTime: "10:30",
      duration: 45,
      appointmentType: "Consultation",
      location: "Room 102",
      status: "confirmed",
    },
    {
      id: "A003",
      patientName: "Robert Brown",
      patientInitials: "RB",
      careProfessionalName: "Nurse Williams",
      appointmentDate: "2023-06-15",
      appointmentTime: "13:15",
      duration: 15,
      appointmentType: "Blood Test",
      location: "Lab 3",
      status: "scheduled",
    },
  ]

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Scheduled
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        )
      case "no_show":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            No Show
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {appointment.patientInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{appointment.patientName}</p>
              {getStatusBadge(appointment.status)}
            </div>
            <p className="text-xs text-muted-foreground">{appointment.appointmentType}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{appointment.appointmentTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{appointment.careProfessionalName}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link href="/appointments">View all appointments</Link>
      </Button>
    </div>
  )
}
