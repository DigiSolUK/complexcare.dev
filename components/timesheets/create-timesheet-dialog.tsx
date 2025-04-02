"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateTimesheetDialogProps {
  tenantId?: string
}

export function CreateTimesheetDialog({ tenantId }: CreateTimesheetDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [hours, setHours] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      setError("Please select a date")
      return
    }

    if (!hours || isNaN(Number.parseFloat(hours))) {
      setError("Please enter valid hours")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/timesheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          hoursWorked: Number.parseFloat(hours),
          notes,
          tenantId: tenantId || "default",
          status: "pending",
          approved: false,
          userOnly: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create timesheet")
      }

      // Reset form and close dialog
      setDate(undefined)
      setHours("")
      setNotes("")
      setOpen(false)
    } catch (err) {
      console.error("Error creating timesheet:", err)
      setError("Failed to create timesheet. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Timesheet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Timesheet</DialogTitle>
            <DialogDescription>Record your working hours for a specific date.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hours">Hours Worked</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Enter hours worked"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this timesheet"
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Timesheet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

