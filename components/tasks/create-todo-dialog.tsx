"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import { createTaskAction } from "@/lib/actions/task-actions"
import { PatientService } from "@/lib/services/patient-service"
import { CareProfessionalService } from "@/lib/services/care-professional-service"
import type { Patient, CareProfessional, TaskStatus } from "@/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export function CreateTodoDialog({
  open,
  onOpenChange,
  onTaskCreated,
  defaultPatientId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: () => void
  defaultPatientId?: string // Optional default patient ID
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [status, setStatus] = useState<TaskStatus>("todo")
  const [assignedToId, setAssignedToId] = useState<string | undefined>(undefined)
  const [patientId, setPatientId] = useState<string | undefined>(defaultPatientId) // State for patientId
  const [isLoading, setIsLoading] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const patientService = await PatientService.create()
        const fetchedPatients = await patientService.getPatients()
        setPatients(fetchedPatients)

        const careProfessionalService = await CareProfessionalService.create()
        const fetchedCareProfessionals = await careProfessionalService.getCareProfessionals()
        setCareProfessionals(fetchedCareProfessionals)
      } catch (error) {
        console.error("Failed to fetch data for task dialog:", error)
        toast({
          title: "Error",
          description: "Failed to load necessary data for task form.",
          variant: "destructive",
        })
      }
    }
    if (open) {
      fetchData()
      // Set default patient if provided
      if (defaultPatientId) {
        setPatientId(defaultPatientId)
      }
    }
  }, [open, defaultPatientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await createTaskAction({
        title,
        description,
        dueDate,
        priority,
        status,
        assignedToId,
        patientId, // Pass patientId
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Task created successfully.",
        })
        onTaskCreated()
        onOpenChange(false)
        // Reset form fields
        setTitle("")
        setDescription("")
        setDueDate(undefined)
        setPriority("medium")
        setStatus("todo")
        setAssignedToId(undefined)
        setPatientId(defaultPatientId) // Reset to default or undefined
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create task.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 min-h-[100px]"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">
                Patient
              </Label>
              <Select
                onValueChange={setPatientId}
                value={patientId}
                disabled={isLoading || !!defaultPatientId} // Disable if defaultPatientId is provided
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a patient (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Patient</SelectItem>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Assigned To
              </Label>
              <Select onValueChange={setAssignedToId} value={assignedToId} disabled={isLoading}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Assign to (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {careProfessionals.map((cp) => (
                    <SelectItem key={cp.id} value={cp.id}>
                      {cp.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select onValueChange={setPriority} value={priority} disabled={isLoading}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={setStatus} value={status} disabled={isLoading}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground",
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
