"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimesheetTable } from "@/components/timesheets/timesheet-table"
import { TimesheetCalendar } from "@/components/timesheets/timesheet-calendar"
import { CreateTimesheetDialog } from "@/components/timesheets/create-timesheet-dialog"

export default function TimesheetsContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  // Use a simple string instead of trying to access the tenant context
  const tenantId = "demo-tenant"

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Timesheets</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Add Timesheet</Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TimesheetTable initialTimesheets={[]} tenantId={tenantId} />
        </TabsContent>
        <TabsContent value="calendar">
          <TimesheetCalendar timesheets={[]} />
        </TabsContent>
      </Tabs>

      <CreateTimesheetDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} tenantId={tenantId} />
    </div>
  )
}

