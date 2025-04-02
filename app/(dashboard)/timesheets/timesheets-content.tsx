"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimesheetTable } from "@/components/timesheets/timesheet-table"
import { TimesheetCalendar } from "@/components/timesheets/timesheet-calendar"
import { CreateTimesheetDialog } from "@/components/timesheets/create-timesheet-dialog"
import { useTenant } from "@/components/providers/tenant-provider"
import { getTimesheets } from "@/lib/services/timesheet-service"

export default async function TimesheetsContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [tenantId, setTenantId] = useState("demo-tenant")

  useEffect(() => {
    let id = "demo-tenant"
    try {
      const { tenant } = useTenant()
      if (tenant?.id) {
        id = tenant.id
      }
    } catch (error) {
      console.error("TenantProvider not available, using default tenant ID:", error)
    }
    setTenantId(id)
  }, [])

  // Fetch timesheets with the tenant ID (or fallback)
  const timesheets = await getTimesheets(tenantId)

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
          <TimesheetTable timesheets={timesheets} />
        </TabsContent>
        <TabsContent value="calendar">
          <TimesheetCalendar timesheets={timesheets} />
        </TabsContent>
      </Tabs>

      <CreateTimesheetDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} tenantId={tenantId} />
    </div>
  )
}

