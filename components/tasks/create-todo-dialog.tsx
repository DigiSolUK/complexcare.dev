"use client"

import { useState, useTransition, useEffect } from "react"
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
import { CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { Task, Patient, CareProfessional } from "@/types"
import { createTask } from "@/lib/actions/task-actions" // Assuming this action exists or will be created
import { useToast } from "@/components/ui/use-toast"
import { PatientService } from "@/lib/services/patient-service" // Import PatientService
import { CareProfessionalService } from "@/lib/services/care-professional-service" // Import CareProfessionalService

interface CreateTodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: () => void
}

export function CreateTodoDialog({ open, onOpenChange, onTaskCreated }: CreateTodoDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState<Task["priority"]>("medium")
  const [assignedToId, setAssignedToId] = useState<string | undefined>(undefined)
  const [patientId, setPatientId] = useState<string | undefined>(undefined) // New state for patient
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [patients, setPatients] = useState<Patient[]>([])
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)
  const [isLoadingCareProfessionals, setIsLoadingCareProfessionals] = useState(true)

  useEffect(() => {
    const fetchPatientsAndCareProfessionals = async () => {
      try {
        const patientService = await PatientService.create()
        const fetchedPatients = await patientService.getPatients()
        setPatients(fetchedPatients)
      } catch (error) {
        console.error("Failed to fetch patients:", error)
        toast({
          title: "Error",
          description: "Failed to load patients.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingPatients(false)
      }

      try {
        const careProfessionalService = await CareProfessionalService.create()
        const fetchedCareProfessionals = await careProfessionalService.getCareProfessionals()
        setCareProfessionals(fetchedCareProfessionals)
      } catch (error) {
        console.error("Failed to fetch care professionals:", error)
        toast({
          title: "Error",
          description: "Failed to load care professionals.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCareProfessionals(false)
      }
    }

    if (open) {
      fetchPatientsAndCareProfessionals()
    }
  }, [open, toast])

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        const newTaskData: Omit<
          Task,
          "id" | "createdAt" | "updatedAt" | "tenantId" | "assignedToName" | "patientName"
        > = {
          title,
          description: description || null,
          dueDate: dueDate || null,
          priority,
          status: "pending", // Default status for new tasks
          assignedToId: assignedToId || null,
          patientId: patientId || null, // Include patientId
        }
        await createTask(newTaskData)
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
        setAssignedToId(undefined)
        setPatientId(undefined)
      } catch (error: any) {
        console.error("Failed to create task:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to create task.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Fill in the details for the new task. Click save when you're done.</DialogDescription>
        </DialogHeader>
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
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("col-span-3 justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value: Task["priority"]) => setPriority(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">
              Assigned To
            </Label>
            <Select value={assignedToId} onValueChange={setAssignedToId} disabled={isLoadingCareProfessionals}>
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={
                    isLoadingCareProfessionals ? "Loading care professionals..." : "Select care professional"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {careProfessionals.map((cp) => (
                  <SelectItem key={cp.id} value={cp.id}>
                    {cp.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient" className="text-right">
              Patient
            </Label>
            <Select value={patientId} onValueChange={setPatientId} disabled={isLoadingPatients}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={isLoadingPatients ? "Loading patients..." : "Select patient"} />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !title}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
