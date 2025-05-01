"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Timesheet } from "@/lib/services/timesheet-service"
import { formatDate } from "@/lib/utils"
import { DEFAULT_TENANT_ID } from "@/lib/tenant"

interface TimesheetTableProps {
  initialTimesheets: Timesheet[]
}

export function TimesheetTable({ initialTimesheets }: TimesheetTableProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>(initialTimesheets)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const approveTimesheet = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/timesheets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "approve",
          approvedBy: "demo-user", // In a real app, this would be the current user's ID
          tenantId: DEFAULT_TENANT_ID, // Always use the default tenant ID
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to approve timesheet")
      }

      // Update the timesheets state
      setTimesheets(timesheets.map((t) => (t.id === id ? result.data : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTimesheet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timesheet?")) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/timesheets/${id}?tenantId=${DEFAULT_TENANT_ID}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to delete timesheet")
      }

      // Remove the deleted timesheet from state
      setTimesheets(timesheets.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Break (min)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No timesheets found
              </TableCell>
            </TableRow>
          ) : (
            timesheets.map((timesheet) => (
              <TableRow key={timesheet.id}>
                <TableCell>{formatDate(timesheet.date)}</TableCell>
                <TableCell>{timesheet.startTime}</TableCell>
                <TableCell>{timesheet.endTime}</TableCell>
                <TableCell>{timesheet.breakDuration}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(timesheet.status)}>{timesheet.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {timesheet.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveTimesheet(timesheet.id!)}
                        disabled={isLoading}
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTimesheet(timesheet.id!)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
