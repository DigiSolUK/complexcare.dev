"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { Timesheet } from "@/types"

interface TimesheetCalendarProps {
  initialTimesheets?: Timesheet[]
  tenantId?: string
}

export function TimesheetCalendar({ initialTimesheets = [], tenantId }: TimesheetCalendarProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>(initialTimesheets)
  const [loading, setLoading] = useState(!initialTimesheets.length)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDayTimesheets, setSelectedDayTimesheets] = useState<Timesheet[]>([])

  useEffect(() => {
    if (initialTimesheets.length > 0) {
      return // Skip fetching if we have initial data
    }

    async function fetchTimesheets() {
      try {
        setLoading(true)
        const response = await fetch(`/api/timesheets?tenantId=${tenantId || ""}`)

        if (!response.ok) {
          throw new Error("Failed to fetch timesheets")
        }

        const data = await response.json()
        setTimesheets(data)
      } catch (err) {
        console.error("Error fetching timesheets:", err)
        setError("Failed to load timesheets. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTimesheets()
  }, [tenantId, initialTimesheets.length])

  // Update selected day timesheets when date changes
  useEffect(() => {
    if (!date) return

    const formattedDate = format(date, "yyyy-MM-dd")
    const filtered = timesheets.filter((timesheet) => {
      const timesheetDate = format(new Date(timesheet.date), "yyyy-MM-dd")
      return timesheetDate === formattedDate
    })

    setSelectedDayTimesheets(filtered)
  }, [date, timesheets])

  // Function to highlight dates with timesheets
  const getDayClassNames = (day: Date) => {
    const formattedDay = format(day, "yyyy-MM-dd")

    const hasTimesheet = timesheets.some((timesheet) => {
      const timesheetDate = format(new Date(timesheet.date), "yyyy-MM-dd")
      return timesheetDate === formattedDay
    })

    return hasTimesheet ? "bg-blue-100 dark:bg-blue-900" : ""
  }

  if (loading) {
    return <div className="text-center py-4">Loading calendar...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiersClassNames={{
            selected: "bg-primary text-primary-foreground",
          }}
          modifiers={{
            customModifier: (date) => getDayClassNames(date) !== "",
          }}
          modifiersStyles={{
            customModifier: { backgroundColor: "rgba(59, 130, 246, 0.1)" },
          }}
        />
      </div>
      <div>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">{date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}</h3>

            {selectedDayTimesheets.length === 0 ? (
              <p className="text-muted-foreground">No timesheets for this date.</p>
            ) : (
              <div className="space-y-4">
                {selectedDayTimesheets.map((timesheet) => (
                  <div key={timesheet.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{timesheet.userName}</p>
                        <p className="text-sm text-muted-foreground">{timesheet.hoursWorked} hours</p>
                      </div>
                      <Badge
                        variant={
                          timesheet.status === "approved"
                            ? "success"
                            : timesheet.status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                      </Badge>
                    </div>
                    {timesheet.notes && <p className="mt-2 text-sm">{timesheet.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

