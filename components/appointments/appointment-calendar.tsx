"use client"

import { useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Setup the localizer
const localizer = momentLocalizer(moment)

// Sample appointment data
const appointments = [
  {
    id: 1,
    title: "John Doe - Initial Assessment",
    start: new Date(2023, 5, 15, 9, 0),
    end: new Date(2023, 5, 15, 10, 0),
    resourceId: 1,
    patientId: "P001",
    patientName: "John Doe",
    careProfessional: "Dr. Sarah Johnson",
    appointmentType: "Initial Assessment",
    status: "confirmed",
    notes: "First appointment for new patient",
  },
  {
    id: 2,
    title: "Jane Smith - Follow-up",
    start: new Date(2023, 5, 15, 11, 0),
    end: new Date(2023, 5, 15, 12, 0),
    resourceId: 1,
    patientId: "P002",
    patientName: "Jane Smith",
    careProfessional: "Dr. Sarah Johnson",
    appointmentType: "Follow-up",
    status: "confirmed",
    notes: "Monthly follow-up appointment",
  },
  {
    id: 3,
    title: "Robert Johnson - Therapy Session",
    start: new Date(2023, 5, 15, 14, 0),
    end: new Date(2023, 5, 15, 15, 0),
    resourceId: 2,
    patientId: "P003",
    patientName: "Robert Johnson",
    careProfessional: "Dr. Michael Chen",
    appointmentType: "Therapy Session",
    status: "confirmed",
    notes: "Weekly therapy session",
  },
  {
    id: 4,
    title: "Emily Williams - Care Review",
    start: new Date(2023, 5, 16, 10, 0),
    end: new Date(2023, 5, 16, 11, 0),
    resourceId: 1,
    patientId: "P004",
    patientName: "Emily Williams",
    careProfessional: "Dr. Sarah Johnson",
    appointmentType: "Care Review",
    status: "confirmed",
    notes: "Quarterly care plan review",
  },
  {
    id: 5,
    title: "Michael Brown - Follow-up",
    start: new Date(2023, 5, 16, 13, 0),
    end: new Date(2023, 5, 16, 14, 0),
    resourceId: 2,
    patientId: "P005",
    patientName: "Michael Brown",
    careProfessional: "Dr. Michael Chen",
    appointmentType: "Follow-up",
    status: "confirmed",
    notes: "Follow-up after treatment change",
  },
]

export function AppointmentCalendar() {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSelectEvent = (event: any) => {
    setSelectedAppointment(event)
    setIsDialogOpen(true)
  }

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day", "agenda"]}
        defaultView="week"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>View and manage appointment information</DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Patient:</span>
                <span className="col-span-3">{selectedAppointment.patientName}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Care Professional:</span>
                <span className="col-span-3">{selectedAppointment.careProfessional}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Type:</span>
                <span className="col-span-3">{selectedAppointment.appointmentType}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Date & Time:</span>
                <span className="col-span-3">
                  {moment(selectedAppointment.start).format("MMMM D, YYYY h:mm A")} -
                  {moment(selectedAppointment.end).format("h:mm A")}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3 capitalize">{selectedAppointment.status}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Notes:</span>
                <span className="col-span-3">{selectedAppointment.notes}</span>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Edit</Button>
                <Button variant="outline" className="text-red-500">
                  Cancel Appointment
                </Button>
                <Button>Complete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
