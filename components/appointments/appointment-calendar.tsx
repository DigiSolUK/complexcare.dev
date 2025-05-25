"use client"

import { useState, useEffect } from "react"
import { Calendar, dateFnsLocalizer, type SlotInfo, type EventProps } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, addDays } from "date-fns"
import enGB from "date-fns/locale/en-GB"
import "react-big-calendar/lib/css/react-big-calendar.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateAppointmentDialog } from "./create-appointment-dialog"
import { EditAppointmentDialog } from "./edit-appointment-dialog"
import {
  getAppointmentsAction,
  deleteAppointmentAction,
  updateAppointmentStatusAction,
} from "@/lib/actions/appointment-actions"
import { toast } from "@/components/ui/use-toast"
import type { CalendarEvent, AppointmentStatus } from "@/types/appointment"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Setup the localizer for react-big-calendar
const locales = {
  "en-GB": enGB,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Custom event component for the calendar
const EventComponent = ({ event }: EventProps) => {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "confirmed":
        return "bg-green-100 border-green-300 text-green-800"
      case "completed":
        return "bg-purple-100 border-purple-300 text-purple-800"
      case "cancelled":
        return "bg-red-100 border-red-300 text-red-800"
      case "no-show":
        return "bg-orange-100 border-orange-300 text-orange-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  return (
    <div className={`rounded px-2 py-1 text-xs border ${getStatusColor(event.status)}`}>
      <div className="font-medium">{event.title}</div>
      <div>{event.patientName}</div>
    </div>
  )
}

interface Patient {
  id: string
  first_name: string
  last_name: string
}

interface Provider {
  id: string
  first_name: string
  last_name: string
}

interface AppointmentCalendarProps {
  patients: Patient[]
  providers: Provider[]
  initialView?: string
}

export function AppointmentCalendar({ patients, providers, initialView = "week" }: AppointmentCalendarProps) {
  const [view, setView] = useState(initialView)
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      // Calculate date range based on current view and date
      let startDate, endDate

      if (view === "day") {
        startDate = format(date, "yyyy-MM-dd")
        endDate = format(addDays(date, 1), "yyyy-MM-dd")
      } else if (view === "week") {
        const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
        startDate = format(start, "yyyy-MM-dd")
        endDate = format(addDays(start, 7), "yyyy-MM-dd")
      } else if (view === "month") {
        const year = date.getFullYear()
        const month = date.getMonth()
        startDate = format(new Date(year, month, 1), "yyyy-MM-dd")
        endDate = format(new Date(year, month + 1, 0), "yyyy-MM-dd")
      }

      const result = await getAppointmentsAction(startDate, endDate)

      if (result.success && result.data) {
        // Transform appointments to calendar events
        const calendarEvents = result.data.map((appointment) => ({
          id: appointment.id,
          title: appointment.title,
          start: new Date(appointment.start_time),
          end: new Date(appointment.end_time),
          status: appointment.status as AppointmentStatus,
          type: appointment.type,
          patientId: appointment.patient_id,
          patientName: appointment.patient_name || "Unknown Patient",
          providerId: appointment.provider_id,
          providerName: appointment.provider_name || "Unknown Provider",
          location: appointment.location,
          notes: appointment.notes,
          isRecurring: appointment.is_recurring,
        }))

        setEvents(calendarEvents)
      } else {
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading appointments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [view, date])

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Pre-fill the create appointment dialog with the selected slot info
    console.log("Selected slot:", slotInfo)
    // You could open the create appointment dialog here with pre-filled data
  }

  const handleDeleteAppointment = async () => {
    if (!selectedEvent) return

    setIsDeleting(true)
    try {
      const result = await deleteAppointmentAction(selectedEvent.id)

      if (result.success) {
        toast({
          title: "Appointment deleted",
          description: "The appointment has been deleted successfully",
        })
        setShowDeleteDialog(false)
        setSelectedEvent(null)
        fetchAppointments()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete appointment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateStatus = async (status: AppointmentStatus) => {
    if (!selectedEvent) return

    try {
      const result = await updateAppointmentStatusAction(selectedEvent.id, status)

      if (result.success) {
        toast({
          title: "Status updated",
          description: `Appointment status changed to ${status}`,
        })
        setSelectedEvent(null)
        fetchAppointments()
      } else {
        toast({
          title: "Error",
          description: "Failed to update appointment status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Scheduled
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Confirmed
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
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
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Appointment Calendar</CardTitle>
            <CardDescription>Manage and schedule patient appointments</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(date)
                if (view === "day") {
                  newDate.setDate(newDate.getDate() - 1)
                } else if (view === "week") {
                  newDate.setDate(newDate.getDate() - 7)
                } else if (view === "month") {
                  newDate.setMonth(newDate.getMonth() - 1)
                }
                setDate(newDate)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setDate(new Date())} className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Today</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(date)
                if (view === "day") {
                  newDate.setDate(newDate.getDate() + 1)
                } else if (view === "week") {
                  newDate.setDate(newDate.getDate() + 7)
                } else if (view === "month") {
                  newDate.setMonth(newDate.getMonth() + 1)
                }
                setDate(newDate)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select value={view} onValueChange={(value) => setView(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <CreateAppointmentDialog patients={patients} providers={providers} onSuccess={fetchAppointments} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              views={{
                day: true,
                week: true,
                month: true,
              }}
              view={view as any}
              date={date}
              onView={(newView) => setView(newView)}
              onNavigate={(newDate) => setDate(newDate)}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              components={{
                event: EventComponent as any,
              }}
              eventPropGetter={(event) => {
                return {
                  className: "cursor-pointer",
                }
              }}
              popup
              tooltipAccessor={null}
            />
          )}
        </div>
      </CardContent>

      {/* Event details popover */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
          <div className="absolute inset-0 bg-black bg-opacity-25" />
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-500">
                  {format(selectedEvent.start, "PPP")} • {format(selectedEvent.start, "p")} -{" "}
                  {format(selectedEvent.end, "p")}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <EditAppointmentDialog
                    appointmentId={selectedEvent.id}
                    patients={patients}
                    providers={providers}
                    onSuccess={() => {
                      fetchAppointments()
                      setSelectedEvent(null)
                    }}
                    trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Appointment</DropdownMenuItem>}
                  />
                  <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-red-600">
                    Delete Appointment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  {getStatusBadge(selectedEvent.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-sm capitalize">{selectedEvent.type.replace(/_/g, " ")}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Patient</p>
                <p className="text-sm">{selectedEvent.patientName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Provider</p>
                <p className="text-sm">{selectedEvent.providerName}</p>
              </div>

              {selectedEvent.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm">{selectedEvent.location}</p>
                </div>
              )}

              {selectedEvent.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-sm">{selectedEvent.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => handleUpdateStatus("scheduled")}
                    disabled={selectedEvent.status === "scheduled"}
                  >
                    Scheduled
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleUpdateStatus("confirmed")}
                    disabled={selectedEvent.status === "confirmed"}
                  >
                    Confirmed
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => handleUpdateStatus("completed")}
                    disabled={selectedEvent.status === "completed"}
                  >
                    Completed
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={() => handleUpdateStatus("no-show")}
                    disabled={selectedEvent.status === "no-show"}
                  >
                    No Show
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleUpdateStatus("cancelled")}
                    disabled={selectedEvent.status === "cancelled"}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the appointment. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAppointment}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
