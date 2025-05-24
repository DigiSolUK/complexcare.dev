"use client"

import { useState, useEffect } from "react"
import { Calendar, dateFnsLocalizer, type SlotInfo } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, addDays, addMonths, startOfMonth, endOfMonth } from "date-fns"
import enGB from "date-fns/locale/en-GB"
import "react-big-calendar/lib/css/react-big-calendar.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AvailabilityForm } from "./availability-form"
import { getProviderAvailabilityAction, deleteAvailabilityAction } from "@/lib/actions/availability-actions"
import { toast } from "@/components/ui/use-toast"
import type { ProviderAvailability } from "@/types/availability"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
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

interface Provider {
  id: string
  first_name: string
  last_name: string
}

interface AvailabilityCalendarProps {
  providers: Provider[]
  providerId?: string
  initialView?: string
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  isAvailable: boolean
  availabilityType: string
  recurrenceType: string
  notes?: string
  allDay?: boolean
}

export function AvailabilityCalendar({ providers, providerId, initialView = "week" }: AvailabilityCalendarProps) {
  const [view, setView] = useState(initialView)
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState<string>(providerId || "")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [availabilityData, setAvailabilityData] = useState<ProviderAvailability[]>([])

  const fetchAvailability = async () => {
    if (!selectedProvider) return

    setLoading(true)
    try {
      const result = await getProviderAvailabilityAction(selectedProvider)

      if (result.success && result.data) {
        setAvailabilityData(result.data)
        generateCalendarEvents(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load provider availability",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching availability:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading availability",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedProvider) {
      fetchAvailability()
    }
  }, [selectedProvider])

  const generateCalendarEvents = (availabilityItems: ProviderAvailability[]) => {
    // Generate events for the current month and the next month
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(addMonths(date, 1))

    const calendarEvents: CalendarEvent[] = []

    availabilityItems.forEach((item) => {
      if (item.specific_date) {
        // One-time availability
        const specificDate = new Date(item.specific_date)
        const [hours, minutes] = item.start_time.split(":").map(Number)
        const [endHours, endMinutes] = item.end_time.split(":").map(Number)

        const start = new Date(specificDate)
        start.setHours(hours, minutes, 0)

        const end = new Date(specificDate)
        end.setHours(endHours, endMinutes, 0)

        calendarEvents.push({
          id: item.id,
          title: getEventTitle(item),
          start,
          end,
          isAvailable: item.is_available,
          availabilityType: item.availability_type,
          recurrenceType: item.recurrence_type,
          notes: item.notes || undefined,
        })
      } else if (item.day_of_week !== null && item.day_of_week !== undefined) {
        // Recurring availability
        // Generate events for each occurrence in the date range
        let currentDate = new Date(startDate)

        while (currentDate <= endDate) {
          // Check if this day matches the day of week (0 = Monday, 6 = Sunday)
          const dayOfWeek = currentDate.getDay()
          const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1

          if (adjustedDayOfWeek === item.day_of_week) {
            const [hours, minutes] = item.start_time.split(":").map(Number)
            const [endHours, endMinutes] = item.end_time.split(":").map(Number)

            const start = new Date(currentDate)
            start.setHours(hours, minutes, 0)

            const end = new Date(currentDate)
            end.setHours(endHours, endMinutes, 0)

            // For recurring events, we'll create a unique ID by combining the original ID with the date
            const uniqueId = `${item.id}-${format(currentDate, "yyyy-MM-dd")}`

            calendarEvents.push({
              id: uniqueId,
              title: getEventTitle(item),
              start,
              end,
              isAvailable: item.is_available,
              availabilityType: item.availability_type,
              recurrenceType: item.recurrence_type,
              notes: item.notes || undefined,
            })
          }

          // Move to the next day
          currentDate = addDays(currentDate, 1)
        }
      }
    })

    setEvents(calendarEvents)
  }

  const getEventTitle = (item: ProviderAvailability): string => {
    const availabilityStatus = item.is_available ? "Available" : "Unavailable"
    const type = item.availability_type.replace(/_/g, " ")
    return `${availabilityStatus}: ${type}`
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Pre-fill the create availability form with the selected slot info
    console.log("Selected slot:", slotInfo)
    // You could open the create availability form here with pre-filled data
  }

  const handleDeleteAvailability = async () => {
    if (!selectedEvent) return

    setIsDeleting(true)
    try {
      // For recurring events, we need to extract the original ID
      const originalId = selectedEvent.id.includes("-") ? selectedEvent.id.split("-")[0] : selectedEvent.id

      const result = await deleteAvailabilityAction(originalId, selectedProvider)

      if (result.success) {
        toast({
          title: "Availability deleted",
          description: "The availability has been deleted successfully",
        })
        setShowDeleteDialog(false)
        setSelectedEvent(null)
        fetchAvailability()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete availability",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting availability:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Custom event component for the calendar
  const EventComponent = ({ event }: any) => {
    const getEventColor = (event: CalendarEvent) => {
      if (!event.isAvailable) {
        return "bg-red-100 border-red-300 text-red-800"
      }

      switch (event.availabilityType) {
        case "working_hours":
          return "bg-green-100 border-green-300 text-green-800"
        case "break":
          return "bg-orange-100 border-orange-300 text-orange-800"
        case "time_off":
          return "bg-red-100 border-red-300 text-red-800"
        case "special_hours":
          return "bg-blue-100 border-blue-300 text-blue-800"
        default:
          return "bg-gray-100 border-gray-300 text-gray-800"
      }
    }

    return (
      <div className={`rounded px-2 py-1 text-xs border ${getEventColor(event)}`}>
        <div className="font-medium">{event.title}</div>
        {event.notes && <div className="truncate">{event.notes}</div>}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Availability Calendar</CardTitle>
            <CardDescription>Manage provider availability for appointments</CardDescription>
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

            {!providerId && (
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.first_name} {provider.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedProvider && (
              <AvailabilityForm providers={providers} providerId={selectedProvider} onSuccess={fetchAvailability} />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !selectedProvider ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Please select a provider to view availability</p>
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
                event: EventComponent,
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
                  <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-red-600">
                    Delete Availability
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-sm">{selectedEvent.isAvailable ? "Available" : "Unavailable"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="text-sm capitalize">{selectedEvent.availabilityType.replace(/_/g, " ")}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Recurrence</p>
                <p className="text-sm capitalize">{selectedEvent.recurrenceType}</p>
              </div>

              {selectedEvent.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-sm">{selectedEvent.notes}</p>
                </div>
              )}
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
              This will permanently delete this availability setting. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAvailability}
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
