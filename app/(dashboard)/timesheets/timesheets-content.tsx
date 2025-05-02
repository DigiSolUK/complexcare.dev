"use client"

import { useState, useEffect } from "react"
import { TimesheetTable } from "@/components/timesheets/timesheet-table"
import { CreateTimesheetDialog } from "@/components/timesheets/create-timesheet-dialog"
import { TimesheetCalendar } from "@/components/timesheets/timesheet-calendar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Calendar, List } from "lucide-react"

export function TimesheetsContent() {
  const [timesheets, setTimesheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/timesheets")

        if (!response.ok) {
          throw new Error("Failed to fetch timesheets")
        }

        const data = await response.json()
        setTimesheets(data)
      } catch (error) {
        console.error("Error fetching timesheets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTimesheets()
  }, [])

  const handleCreateTimesheet = async (newTimesheet) => {
    setTimesheets([...timesheets, newTimesheet])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Timesheets</h1>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Timesheet
        </Button>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <TimesheetTable timesheets={timesheets} loading={loading} />
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <TimesheetCalendar timesheets={timesheets} loading={loading} />
        </TabsContent>
      </Tabs>

      <CreateTimesheetDialog open={open} onOpenChange={setOpen} onCreateTimesheet={handleCreateTimesheet} />
    </div>
  )
}

export default TimesheetsContent
