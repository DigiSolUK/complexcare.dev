"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAssignmentTypes } from "@/lib/services/patient-assignment-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { PatientAssignment } from "@/lib/services/patient-assignment-service"

interface EditPatientAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: PatientAssignment
  careProfessionalId: string
  tenantId?: string
  onAssignmentUpdated: (assignment: PatientAssignment) => void
}

const formSchema = z.object({
  assignmentType: z.string({ required_error: "Please select an assignment type" }),
  startDate: z.date({ required_error: "Please select a start date" }),
  endDate: z.date().optional().nullable(),
  notes: z.string().optional(),
})

export function EditPatientAssignmentDialog({
  open,
  onOpenChange,
  assignment,
  careProfessionalId,
  tenantId,
  onAssignmentUpdated,
}: EditPatientAssignmentDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignmentType: assignment.assignment_type,
      startDate: assignment.start_date ? parseISO(assignment.start_date) : new Date(),
      endDate: assignment.end_date ? parseISO(assignment.end_date) : null,
      notes: assignment.notes || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setSubmitting(true)

    try {
      const response = await fetch(
        `/api/care-professionals/${careProfessionalId}/patient-assignments/${assignment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignmentType: values.assignmentType,
            startDate: format(values.startDate, "yyyy-MM-dd"),
            endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
            notes: values.notes,
            tenantId,
          }),
        },
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Error: ${response.status}`)
      }

      const { data } = await response.json()
      onAssignmentUpdated(data)
    } catch (err: any) {
      setError(err.message || "Failed to update patient assignment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Get assignment types
  const assignmentTypes = getAssignmentTypes()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Patient Assignment</DialogTitle>
          <DialogDescription>Update the details of this patient assignment.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Patient</h3>
              <p className="text-sm text-muted-foreground">
                {assignment.patient_first_name} {assignment.patient_last_name}
              </p>
            </div>

            <FormField
              control={form.control}
              name="assignmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assignmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < form.getValues("startDate")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any relevant notes about this assignment"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
