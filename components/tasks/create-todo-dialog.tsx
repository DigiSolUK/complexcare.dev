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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useErrorTracking } from "@/lib/error-tracking"
import { toast } from "@/components/ui/use-toast"

interface CreateTodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  assignableUsers?: Array<{ id: string; name: string }>
  patients?: Array<{ id: string; first_name: string; last_name: string }>
}

export function CreateTodoDialog({
  open,
  onOpenChange,
  onSuccess,
  assignableUsers = [],
  patients = [],
}: CreateTodoDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [assignedTo, setAssignedTo] = useState("")
  const [patientId, setPatientId] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { trackError } = useErrorTracking()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!title.trim()) {
        throw new Error("Task title is required")
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          assigned_to: assignedTo || null,
          patient_id: patientId || null,
          due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
          status: "pending",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create task")
      }

      toast({
        title: "Success",
        description: "Task created successfully.",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setPriority("medium")
      setAssignedTo("")
      setPatientId("")
      setDueDate(undefined)

      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating task:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create task"

      trackError(error as Error, {
        component: "CreateTodoDialog",
        action: "createTask",
        severity: "medium",
        category: "database",
        metadata: {
          title,
          priority,
          hasAssignee: !!assignedTo,
          hasPatient: !!patientId,
          hasDueDate: !!dueDate,
        },
      })

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your to-do list. Fill in the details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {assignableUsers.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {assignableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {patients.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="patientId">Related Patient</Label>
                <Select value={patientId} onValueChange={setPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_patient">No patient</SelectItem>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
