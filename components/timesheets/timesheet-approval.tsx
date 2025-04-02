"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { format } from "date-fns"
import type { Timesheet } from "@/types"

interface TimesheetApprovalProps {
  initialTimesheets?: Timesheet[]
  tenantId?: string
}

export function TimesheetApproval({ initialTimesheets = [], tenantId }: TimesheetApprovalProps) {
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
        const response = await fetch(`/api/timesheets?tenantId=${tenantId || ""}&status=pending`)

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
      setTimesheets(timesheets.filter((timesheet) => timesheet.id !== id))
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
      setTimesheets(timesheets.filter((timesheet) => timesheet.id !== id))
    } catch (err) {
      console.error("Error rejecting timesheet:", err)
      // Show error message to user
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading timesheets for approval...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  if (timesheets.length === 0) {
    return <div className="text-center py-4">No timesheets pending approval.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Staff Member</TableHead>
            <TableHead>Hours</TableHead>
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
              <TableCell>{timesheet.notes}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleApprove(timesheet.id)} title="Approve">
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleReject(timesheet.id)} title="Reject">
                    <X className="h-4 w-4 text-red-500" />
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

