"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Pill, Heart, User, Activity, Filter } from "lucide-react"
import { format } from "date-fns"

interface TimelineEvent {
  id: string
  type: "appointment" | "medication" | "note" | "vital" | "lab" | "procedure" | "admission"
  title: string
  description: string
  timestamp: string
  performed_by?: string
  details?: any
  severity?: "routine" | "important" | "critical"
}

interface PatientTimelineProps {
  patientId: string
}

export function PatientTimeline({ patientId }: PatientTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([])
  const [timeRange, setTimeRange] = useState("week")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTimelineEvents()
  }, [patientId, timeRange])

  useEffect(() => {
    filterEvents()
  }, [events, eventTypeFilter])

  const fetchTimelineEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/patients/${patientId}/timeline?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching timeline events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterEvents = () => {
    if (eventTypeFilter === "all") {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(events.filter((event) => event.type === eventTypeFilter))
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4" />
      case "medication":
        return <Pill className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      case "vital":
        return <Heart className="h-4 w-4" />
      case "lab":
        return <Activity className="h-4 w-4" />
      case "procedure":
        return <User className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "medication":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "note":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "vital":
        return "bg-red-100 text-red-800 border-red-200"
      case "lab":
        return "bg-green-100 text-green-800 border-green-200"
      case "procedure":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIndicator = (severity?: string) => {
    switch (severity) {
      case "critical":
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      case "important":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      default:
        return null
    }
  }

  // Group events by date
  const groupedEvents = filteredEvents.reduce(
    (acc, event) => {
      const date = format(new Date(event.timestamp), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(event)
      return acc
    },
    {} as Record<string, TimelineEvent[]>,
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Patient Timeline</CardTitle>
            <CardDescription>Comprehensive history of patient events</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="3months">Past 3 Months</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="medication">Medications</SelectItem>
                <SelectItem value="note">Clinical Notes</SelectItem>
                <SelectItem value="vital">Vitals</SelectItem>
                <SelectItem value="lab">Lab Results</SelectItem>
                <SelectItem value="procedure">Procedures</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No events found for the selected period</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <div key={date} className="mb-8">
                <div className="sticky top-0 bg-white z-10 pb-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {format(new Date(date), "EEEE, MMMM d, yyyy")}
                  </h3>
                </div>

                <div className="space-y-4">
                  {dateEvents.map((event) => (
                    <div key={event.id} className="flex gap-4 relative">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-full border-2 ${getEventColor(event.type)} flex items-center justify-center bg-white z-10`}
                      >
                        {getEventIcon(event.type)}
                      </div>

                      <div className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{event.title}</h4>
                            {getSeverityIndicator(event.severity)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.timestamp), "h:mm a")}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>

                        {event.performed_by && (
                          <p className="text-xs text-muted-foreground">By: {event.performed_by}</p>
                        )}

                        {event.details && (
                          <div className="mt-2 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="text-xs">
                              View Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
