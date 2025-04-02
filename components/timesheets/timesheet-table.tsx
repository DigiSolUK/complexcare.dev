"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { format } from "date-fns"
import type { Timesheet } from "@/types"

interface TimesheetTableProps {
  initialTimesheets?: Timesheet[]
  tenantId?: string
  userOnly?: boolean
}

export function TimesheetTable({ initialTimesheets = [], tenantId, userOnly }: TimesheetTableProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>(initialTimesheets)
  const [loading, setLoading] = useState(!initialTimesheets.length)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialTimesheets.length > 0) {
      return // Skip fetching if we have initial data
    }

    async function fetchTimesheets() {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/timesheets?tenantId=${tenantId || ""}&userOnly=${userOnly ? "true" : "false"}`,
        )

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
  }, [tenantId, userOnly, initialTimesheets.length])

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/timesheets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "approved",
          approved: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve timesheet")
      }

      // Update the local state
      setTimesheets(
        timesheets.map((timesheet) =>
          timesheet.id === id ? { ...timesheet, status: "approved", approved: true } : timesheet,
        ),
      )
    } catch (err) {
      console.error("Error approving timesheet:", err)
      // Show error message to user
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/timesheets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          approved: false,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject timesheet")
      }

      // Update the local state
      setTimesheets(
        timesheets.map((timesheet) =>
          timesheet.id === id ? { ...timesheet, status: "rejected", approved: false } : timesheet,
        ),
      )
    } catch (err) {
      console.error("Error rejecting timesheet:", err)
      // Show error message to user
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timesheet?")) {
      return
    }

    try {
      const response = await fetch(`/api/timesheets/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete timesheet")
      }

      // Remove from local state
      setTimesheets(timesheets.filter((timesheet) => timesheet.id !== id))
    } catch (err) {
      console.error("Error deleting timesheet:", err)
      // Show error message to user
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading timesheets...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  if (timesheets.length === 0) {
    return <div className="text-center py-4">No timesheets found.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Staff Member</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((timesheet) => (
            <TableRow key={timesheet.id}>
              <TableCell>{format(new Date(timesheet.date), "dd MMM yyyy")}</TableCell>
              <TableCell>{timesheet.userName}</TableCell>
              <TableCell>{timesheet.hoursWorked}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>{timesheet.notes}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {!userOnly && timesheet.status === "pending" && (
                    <>
                      <Button variant="outline" size="icon" onClick={() => handleApprove(timesheet.id)} title="Approve">
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleReject(timesheet.id)} title="Reject">
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="icon" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(timesheet.id)} title="Delete">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

