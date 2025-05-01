"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Timesheet } from "@/lib/services/timesheet-service"

interface TimesheetCalendarProps {
  tenantId: string
}

export function TimesheetCalendar({ tenantId }: TimesheetCalendarProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  const fetchTimesheets = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/timesheets?tenantId=${encodeURIComponent(tenantId)}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch timesheets: ${response.status}`)
      }

      const data = await response.json()
      setTimesheets(data)
    } catch (err: any) {
      console.error("Error fetching timesheets:", err)
      setError(err.message || "Failed to load timesheets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimesheets()
  }, [tenantId])

  // Group timesheets by date
  const timesheetsByDate = timesheets.reduce(
    (acc, timesheet) => {
      const date = timesheet.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(timesheet)
      return acc
    },
    {} as Record<string, Timesheet[]>,
  )

  // Function to render timesheet entries for the selected date
  const renderTimesheetsForDate = () => {
    if (!date) return null

    const dateString = date.toISOString().split("T")[0]
    const entries = timesheetsByDate[dateString] || []

    if (entries.length === 0) {
      return <p className="text-center text-muted-foreground">No timesheets for this date</p>
    }

    return (
      <div className="space-y-2">
        {entries.map((timesheet) => (
          <Card key={timesheet.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{timesheet.staffName}</p>
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
              {timesheet.notes && <p className="text-sm mt-2 text-muted-foreground">{timesheet.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading calendar...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  // Function to determine which dates have timesheets
  const getDayClassNames = (day: Date) => {
    const dateString = day.toISOString().split("T")[0]
    return timesheetsByDate[dateString] ? "bg-primary/10 font-bold" : undefined
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          dayClassName={getDayClassNames}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {date
            ? date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Select a date"}
        </h3>
        {renderTimesheetsForDate()}
      </div>
    </div>
  )
}
