"use client"

import { useState, useEffect } from "react"
import type { Timesheet } from "@/types/timesheet"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, RefreshCw } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function TimesheetTable() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchTimesheets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/timesheets")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setTimesheets(data)
    } catch (err) {
      console.error("Error fetching timesheets:", err)
      setError("Failed to load timesheets. Please try again later.")
      // Still set empty array to avoid undefined errors
      setTimesheets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimesheets()
  }, [])

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/timesheets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
          approvedBy: "Current User", // In a real app, get this from auth context
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Update the local state
      setTimesheets((prevTimesheets) =>
        prevTimesheets.map((timesheet) =>
          timesheet.id === id
            ? {
                ...timesheet,
                status,
                approvedBy: status === "approved" || status === "rejected" ? "Current User" : null,
                approvedDate:
                  status === "approved" || status === "rejected" ? new Date().toISOString().split("T")[0] : null,
              }
            : timesheet,
        ),
      )

      toast({
        title: "Status Updated",
        description: `Timesheet status has been updated to ${status}.`,
      })
    } catch (err) {
      console.error("Error updating timesheet status:", err)
      toast({
        title: "Update Failed",
        description: "Failed to update timesheet status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Timesheets</h2>
        <Button variant="outline" size="sm" onClick={fetchTimesheets} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && !error ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : timesheets.length === 0 && !error ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No timesheets found.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Care Professional</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Approved Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell className="font-medium">{timesheet.careProfessionalName}</TableCell>
                  <TableCell>{formatDate(timesheet.date)}</TableCell>
                  <TableCell>{timesheet.hoursWorked}</TableCell>
                  <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                  <TableCell>{timesheet.approvedBy || "-"}</TableCell>
                  <TableCell>{timesheet.approvedDate ? formatDate(timesheet.approvedDate) : "-"}</TableCell>
                  <TableCell className="max-w-xs truncate" title={timesheet.notes || ""}>
                    {timesheet.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {timesheet.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(timesheet.id, "approved")}>
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(timesheet.id, "rejected")}>
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {timesheet.status !== "pending" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(timesheet.id, "pending")}>
                            Reset to Pending
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

