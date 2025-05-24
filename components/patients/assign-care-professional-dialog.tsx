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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import type { CareProfessional } from "@/types"

interface AssignCareProfessionalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  patientName: string
  onAssignmentCreated: () => void
}

export function AssignCareProfessionalDialog({
  open,
  onOpenChange,
  patientId,
  patientName,
  onAssignmentCreated,
}: AssignCareProfessionalDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const [selectedProfessionalId, setSelectedProfessionalId] = useState("")
  const [assignmentType, setAssignmentType] = useState("primary")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>()
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchCareProfessionals()
    }
  }, [open])

  const fetchCareProfessionals = async () => {
    try {
      const response = await fetch("/api/care-professionals?active=true")
      if (!response.ok) throw new Error("Failed to fetch care professionals")
      const data = await response.json()
      setCareProfessionals(data.data || [])
    } catch (error) {
      console.error("Error fetching care professionals:", error)
      toast({
        title: "Error",
        description: "Failed to load care professionals",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProfessionalId) {
      toast({
        title: "Error",
        description: "Please select a care professional",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/care-professionals/${selectedProfessionalId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          assignment_type: assignmentType,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
          notes: notes || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create assignment")
      }

      toast({
        title: "Success",
        description: "Care professional assigned successfully",
      })

      onAssignmentCreated()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error creating assignment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign care professional",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedProfessionalId("")
    setAssignmentType("primary")
    setStartDate(new Date())
    setEndDate(undefined)
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Care Professional</DialogTitle>
            <DialogDescription>Assign a care professional to {patientName}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="professional">Care Professional</Label>
              <Select value={selectedProfessionalId} onValueChange={setSelectedProfessionalId} disabled={isLoading}>
                <SelectTrigger id="professional">
                  <SelectValue placeholder="Select a care professional" />
                </SelectTrigger>
                <SelectContent>
                  {careProfessionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.first_name} {professional.last_name} - {professional.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignment-type">Assignment Type</Label>
              <Select value={assignmentType} onValueChange={setAssignmentType} disabled={isLoading}>
                <SelectTrigger id="assignment-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Care</SelectItem>
                  <SelectItem value="secondary">Secondary Care</SelectItem>
                  <SelectItem value="specialist">Specialist</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "No end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => date < startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this assignment..."
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Professional
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
