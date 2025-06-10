"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Clock, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Demo appointments data
const demoAppointments = [
  {
    id: "apt-001",
    patientName: "John Smith",
    patientId: "p-001",
    providerName: "Dr. Sarah Johnson",
    providerId: "cp-001",
    date: "2025-05-28",
    startTime: "10:00",
    endTime: "10:30",
    type: "Check-up",
    status: "Scheduled",
    notes: "Regular diabetes check-up",
    location: "Main Clinic - Room 3",
  },
  {
    id: "apt-002",
    patientName: "Emily Johnson",
    patientId: "p-002",
    providerName: "Dr. James Williams",
    providerId: "cp-002",
    date: "2025-05-28",
    startTime: "11:30",
    endTime: "12:15",
    type: "Follow-up",
    status: "Confirmed",
    notes: "Follow-up on asthma treatment",
    location: "Main Clinic - Room 2",
  },
  {
    id: "apt-003",
    patientName: "Michael Williams",
    patientId: "p-003",
    providerName: "Dr. Emily Brown",
    providerId: "cp-003",
    date: "2025-05-28",
    startTime: "14:00",
    endTime: "14:45",
    type: "Consultation",
    status: "Scheduled",
    notes: "Initial consultation for anxiety management",
    location: "Main Clinic - Room 1",
  },
  {
    id: "apt-004",
    patientName: "Sarah Brown",
    patientId: "p-004",
    providerName: "Dr. Robert Smith",
    providerId: "cp-004",
    date: "2025-05-28",
    startTime: "16:30",
    endTime: "17:15",
    type: "Assessment",
    status: "Confirmed",
    notes: "Annual health assessment",
    location: "Main Clinic - Room 4",
  },
  {
    id: "apt-005",
    patientName: "Robert Taylor",
    patientId: "p-005",
    providerName: "Dr. Olivia Taylor",
    providerId: "cp-005",
    date: "2025-05-29",
    startTime: "09:15",
    endTime: "10:00",
    type: "Therapy",
    status: "Scheduled",
    notes: "Back pain therapy session",
    location: "Therapy Center - Room 2",
  },
]

export function AppointmentsList() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [statusFilter, setStatusFilter] = useState("all")

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Format date for filtering
  const formatDateForFilter = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Navigate to previous day
  const previousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  // Navigate to next day
  const nextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  // Navigate to today
  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // Filter appointments by selected date and status
  const filteredAppointments = demoAppointments.filter((appointment) => {
    const matchesDate = appointment.date === formatDateForFilter(selectedDate)
    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesDate && matchesStatus
  })

  // Sort appointments by start time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Appointments</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-lg font-medium">{formatDate(selectedDate)}</div>
      </CardHeader>
      <CardContent>
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No appointments</h3>
            <p className="text-sm text-gray-500">There are no appointments scheduled for this day.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start border-b pb-4">
                <div className="bg-blue-50 text-blue-700 rounded-md p-2 flex flex-col items-center justify-center min-w-[80px] mr-4">
                  <Clock className="h-4 w-4 mb-1" />
                  <span className="text-xs font-medium">{appointment.startTime}</span>
                  <span className="text-xs">to</span>
                  <span className="text-xs font-medium">{appointment.endTime}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{appointment.patientName}</h4>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Mark as Confirmed</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                          <DropdownMenuItem>Mark as No-Show</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Cancel Appointment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">Provider:</span> {appointment.providerName}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {appointment.location}
                    </p>
                    {appointment.notes && (
                      <p>
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
