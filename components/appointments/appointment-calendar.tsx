"use client"

import { useState, useCallback, useEffect } from "react"
import { Calendar, momentLocalizer, type View } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreateAppointmentDialog } from "./create-appointment-dialog"
import { EditAppointmentDialog } from "./edit-appointment-dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { useErrorTracking } from "@/lib/error-tracking"
import { toast } from "@/components/ui/use-toast"

const localizer = momentLocalizer(moment)

interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  patient_id: string
  patient_name: string
  provider_id: string
  provider_name: string
  appointment_type: string
  status: string
  notes?: string
}

interface AppointmentCalendarProps {
  patients: any[]
  providers: any[]
}

export function AppointmentCalendar({ patients, providers }: AppointmentCalendarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [view, setView] = useState<View>("month")
  const [date, setDate] = useState(new Date())
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { trackError } = useErrorTracking()

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/appointments")
      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`)
      }
      const data = await response.json()

      // Convert date strings to Date objects
      const formattedAppointments = data.map((apt: any) => ({
        ...apt,
        start: new Date(apt.start_time),
        end: new Date(apt.end_time),
        title: `${apt.patient_name} - ${apt.appointment_type}`,
      }))

      setAppointments(formattedAppointments)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      trackError(error as Error, {
        component: "AppointmentCalendar",
        action: "fetchAppointments",
        severity: "high",
        category: "api",
      })
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load appointments. Please refresh the page.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [trackError])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // Handle slot selection
  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      try {
        setSelectedSlot({ start, end })
        setShowCreateDialog(true)
      } catch (error) {
        trackError(error as Error, {
          component: "AppointmentCalendar",
          action: "handleSelectSlot",
          severity: "low",
          category: "ui",
        })
      }
    },
    [trackError],
  )

  // Handle event selection
  const handleSelectEvent = useCallback(
    (event: Appointment) => {
      try {
        setSelectedAppointment(event)
        setShowEditDialog(true)
      } catch (error) {
        trackError(error as Error, {
          component: "AppointmentCalendar",
          action: "handleSelectEvent",
          severity: "low",
          category: "ui",
          metadata: {
            appointmentId: event.id,
          },
        })
      }
    },
    [trackError],
  )

  // Custom event style
  const eventStyleGetter = useCallback((event: Appointment) => {
    let backgroundColor = "#3174ad"

    switch (event.status) {
      case "confirmed":
        backgroundColor = "#10b981"
        break
      case "pending":
        backgroundColor = "#f59e0b"
        break
      case "cancelled":
        backgroundColor = "#ef4444"
        break
      case "completed":
        backgroundColor = "#6b7280"
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    }
  }, [])

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1)
      toolbar.onNavigate("prev")
    }

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1)
      toolbar.onNavigate("next")
    }

    const goToCurrent = () => {
      const now = new Date()
      toolbar.date.setMonth(now.getMonth())
      toolbar.date.setYear(now.getFullYear())
      toolbar.onNavigate("current")
    }

    const label = () => {
      const date = moment(toolbar.date)
      return <span className="text-lg font-semibold">{date.format("MMMM YYYY")}</span>
    }

    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToBack}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrent}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            Next
          </Button>
        </div>
        <div>{label()}</div>
        <div className="flex items-center gap-2">
          <Button
            variant={toolbar.view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => toolbar.onView("month")}
          >
            Month
          </Button>
          <Button
            variant={toolbar.view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => toolbar.onView("week")}
          >
            Week
          </Button>
          <Button
            variant={toolbar.view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => toolbar.onView("day")}
          >
            Day
          </Button>
        </div>
      </div>
    )
  }

  // Handle appointment creation success
  const handleCreateSuccess = () => {
    fetchAppointments()
    setShowCreateDialog(false)
    setSelectedSlot(null)
    toast({
      title: "Success",
      description: "Appointment created successfully.",
    })
  }

  // Handle appointment update success
  const handleUpdateSuccess = () => {
    fetchAppointments()
    setShowEditDialog(false)
    setSelectedAppointment(null)
    toast({
      title: "Success",
      description: "Appointment updated successfully.",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Appointment Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">
                <div className="w-2 h-2 rounded-full bg-white mr-1" />
                Confirmed
              </Badge>
              <Badge variant="default" className="bg-amber-500">
                <div className="w-2 h-2 rounded-full bg-white mr-1" />
                Pending
              </Badge>
              <Badge variant="default" className="bg-red-500">
                <div className="w-2 h-2 rounded-full bg-white mr-1" />
                Cancelled
              </Badge>
              <Badge variant="default" className="bg-gray-500">
                <div className="w-2 h-2 rounded-full bg-white mr-1" />
                Completed
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              view={view}
              onView={(newView) => setView(newView)}
              date={date}
              onNavigate={(newDate) => setDate(newDate)}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Appointment Dialog */}
      <CreateAppointmentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        patients={patients}
        providers={providers}
        defaultStart={selectedSlot?.start}
        defaultEnd={selectedSlot?.end}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Appointment Dialog */}
      {selectedAppointment && (
        <EditAppointmentDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          appointment={selectedAppointment}
          patients={patients}
          providers={providers}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  )
}
