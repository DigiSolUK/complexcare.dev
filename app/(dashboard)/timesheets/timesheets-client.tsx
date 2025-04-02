"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimesheetTable } from "@/components/timesheets/timesheet-table"
import { TimesheetCalendar } from "@/components/timesheets/timesheet-calendar"
import { TimesheetApproval } from "@/components/timesheets/timesheet-approval"
import { CreateTimesheetDialog } from "@/components/timesheets/create-timesheet-dialog"
import { PlusCircle } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"
import type { Timesheet } from "@/types"

interface TimesheetsClientProps {
  initialTimesheets?: Timesheet[]
}

export function TimesheetsClient({ initialTimesheets = [] }: TimesheetsClientProps) {
  const { tenant } = useTenant()
  const [timesheets, setTimesheets] = useState<Timesheet[]>(initialTimesheets)
  const [isLoading, setIsLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const refreshTimesheets = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/timesheets?tenantId=${tenant?.id || "demo-tenant"}`)
      if (response.ok) {
        const data = await response.json()
        setTimesheets(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error refreshing timesheets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTimesheet = async (newTimesheet: Timesheet) => {
    setTimesheets([newTimesheet, ...timesheets])
    setCreateDialogOpen(false)
  }

  const handleViewTimesheet = (id: string) => {
    // Implement view functionality
    console.log("View timesheet:", id)
  }

  const handleEditTimesheet = (id: string) => {
    // Implement edit functionality
    console.log("Edit timesheet:", id)
  }

  const handleApproveTimesheet = (id: string) => {
    // Implement approve functionality
    console.log("Approve timesheet:", id)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Timesheets</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Timesheet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timesheet Management</CardTitle>
          <CardDescription>View, create, and manage staff timesheets and working hours.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="approval">Approval</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <TimesheetTable
                timesheets={timesheets}
                isLoading={isLoading}
                onView={handleViewTimesheet}
                onEdit={handleEditTimesheet}
                onApprove={handleApproveTimesheet}
                onRefresh={refreshTimesheets}
              />
            </TabsContent>
            <TabsContent value="calendar">
              <TimesheetCalendar timesheets={timesheets} />
            </TabsContent>
            <TabsContent value="approval">
              <TimesheetApproval
                timesheets={timesheets.filter((t) => t.status === "pending")}
                onApprove={handleApproveTimesheet}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateTimesheetDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTimesheet}
      />
    </div>
  )
}

