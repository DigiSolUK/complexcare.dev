"use client"

import { useState, useEffect } from "react"
import { TimesheetTable } from "@/components/timesheets/timesheet-table"
import { TimesheetCalendar } from "@/components/timesheets/timesheet-calendar"
import { CreateTimesheetDialog } from "@/components/timesheets/create-timesheet-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, List } from "lucide-react"

export function TimesheetsContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [timesheets, setTimesheets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState("list")

  useEffect(() => {
    fetchTimesheets()
  }, [])

  const fetchTimesheets = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/timesheets")
      if (!response.ok) throw new Error("Failed to fetch timesheets")
      const data = await response.json()
      setTimesheets(data)
    } catch (error) {
      console.error("Error fetching timesheets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTimesheet = async (newTimesheet) => {
    try {
      const response = await fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTimesheet),
      })

      if (!response.ok) throw new Error("Failed to create timesheet")

      // Refresh the list
      fetchTimesheets()
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating timesheet:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Timesheets</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Timesheet
        </Button>
      </div>

      <Tabs defaultValue="list" value={view} onValueChange={setView}>
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
          <TimesheetTable timesheets={timesheets} isLoading={isLoading} onRefresh={fetchTimesheets} />
        </TabsContent>

        <TabsContent value="calendar">
          <TimesheetCalendar timesheets={timesheets} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <CreateTimesheetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTimesheet}
      />
    </div>
  )
}

export default TimesheetsContent
