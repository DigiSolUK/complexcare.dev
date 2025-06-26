"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, MoreHorizontal, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  const [appointments, setAppointments] = useState<Appointment[]>([
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
    {
      id: "A004",
      patientName: "Emily Williams",
      patientInitials: "EW",
      careProfessionalName: "Dr. James Wilson",
      appointmentDate: "2023-06-16",
      appointmentTime: "11:00",
      duration: 60,
      appointmentType: "Therapy Session",
      location: "Room 105",
      status: "scheduled",
    },
    {
      id: "A005",
      patientName: "Michael Parker",
      patientInitials: "MP",
      careProfessionalName: "Dr. Lisa Thompson",
      appointmentDate: "2023-06-16",
      appointmentTime: "14:45",
      duration: 30,
      appointmentType: "Follow-up",
      location: "Room 103",
      status: "scheduled",
    },
  ])

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
        <div key={appointment.id} className="flex items-start gap-4 rounded-lg border p-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {appointment.patientInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{appointment.patientName}</p>
              <div className="flex items-center gap-2">
                {getStatusBadge(appointment.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem>Confirm</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Cancel Appointment</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-sm font-medium">{appointment.appointmentType}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {appointment.appointmentTime} ({appointment.duration} min)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{appointment.careProfessionalName}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{appointment.location}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
