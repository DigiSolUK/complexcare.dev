"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, FileEdit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react"
import moment from "moment"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Appointment = {
  id: number
  patientId: string
  patientName: string
  careProfessional: string
  appointmentType: string
  start: Date
  end: Date
  status: "confirmed" | "completed" | "cancelled" | "no-show"
  notes: string
}

const appointments: Appointment[] = [
  {
    id: 1,
    patientId: "P001",
    patientName: "John Doe",
    careProfessional: "Dr. Sarah Johnson",
    appointmentType: "Initial Assessment",
    start: new Date(2023, 5, 15, 9, 0),
    end: new Date(2023, 5, 15, 10, 0),
    status: "confirmed",
    notes: "First appointment for new patient",
  },
  {
    id: 2,
    patientId: "P002",
    patientName: "Jane Smith",
    careProfessional: "Dr. Sarah Johnson",
    appointmentType: "Follow-up",
    start: new Date(2023, 5, 15, 11, 0),
    end: new Date(2023, 5, 15, 12, 0),
    status: "confirmed",
    notes: "Monthly follow-up appointment",
  },
  {
    id: 3,
    patientId: "P003",
    patientName: "Robert Johnson",
    careProfessional: "Dr. Michael Chen",
    appointmentType: "Therapy Session",
    start: new Date(2023, 5, 15, 14, 0),
    end: new Date(2023, 5, 15, 15, 0),
    status: "confirmed",
    notes: "Weekly therapy session",
  },
  {
    id: 4,
    patientId: "P004",
    patientName: "Emily Williams",
    careProfessional: "Dr. Sarah Johnson",
    appointmentType: "Care Review",
    start: new Date(2023, 5, 16, 10, 0),
    end: new Date(2023, 5, 16, 11, 0),
    status: "confirmed",
    notes: "Quarterly care plan review",
  },
  {
    id: 5,
    patientId: "P005",
    patientName: "Michael Brown",
    careProfessional: "Dr. Michael Chen",
    appointmentType: "Follow-up",
    start: new Date(2023, 5, 16, 13, 0),
    end: new Date(2023, 5, 16, 14, 0),
    status: "confirmed",
    notes: "Follow-up after treatment change",
  },
  {
    id: 6,
    patientId: "P006",
    patientName: "Sarah Thompson",
    careProfessional: "Dr. Emily Williams",
    appointmentType: "Initial Assessment",
    start: new Date(2023, 5, 10, 9, 0),
    end: new Date(2023, 5, 10, 10, 0),
    status: "completed",
    notes: "New patient assessment completed successfully",
  },
  {
    id: 7,
    patientId: "P007",
    patientName: "David Wilson",
    careProfessional: "Dr. James Wilson",
    appointmentType: "Follow-up",
    start: new Date(2023, 5, 11, 14, 0),
    end: new Date(2023, 5, 11, 15, 0),
    status: "no-show",
    notes: "Patient did not attend appointment",
  },
  {
    id: 8,
    patientId: "P008",
    patientName: "Lisa Johnson",
    careProfessional: "Dr. Michael Chen",
    appointmentType: "Therapy Session",
    start: new Date(2023, 5, 12, 11, 0),
    end: new Date(2023, 5, 12, 12, 0),
    status: "cancelled",
    notes: "Appointment cancelled by patient",
  },
]

interface AppointmentListProps {
  filter?: "upcoming" | "past" | "all"
}

export function AppointmentList({ filter = "all" }: AppointmentListProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter appointments based on the prop
  const now = new Date()
  const filteredAppointments =
    filter === "upcoming"
      ? appointments.filter((appt) => appt.start > now)
      : filter === "past"
        ? appointments.filter((appt) => appt.start < now)
        : appointments

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue, bValue

    if (sortColumn === "start" || sortColumn === "end") {
      aValue = a[sortColumn].getTime()
      bValue = b[sortColumn].getTime()
    } else {
      aValue = a[sortColumn as keyof Appointment]
      bValue = b[sortColumn as keyof Appointment]
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "no-show":
        return <XCircle className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Confirmed
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      case "no-show":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            No Show
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("patientName")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Patient</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Care Professional</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("start")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Date & Time</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {appointment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{appointment.patientName}</div>
                    <div className="text-xs text-muted-foreground">ID: {appointment.patientId}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{appointment.careProfessional}</TableCell>
              <TableCell>{appointment.appointmentType}</TableCell>
              <TableCell>
                <div>
                  <div>{moment(appointment.start).format("MMM D, YYYY")}</div>
                  <div className="text-xs text-muted-foreground">
                    {moment(appointment.start).format("h:mm A")} - {moment(appointment.end).format("h:mm A")}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(appointment.status)}
                  {getStatusBadge(appointment.status)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit Appointment</span>
                    </DropdownMenuItem>
                    {appointment.status === "confirmed" && (
                      <>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Mark as Completed</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Mark as No-Show</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Cancel Appointment</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
