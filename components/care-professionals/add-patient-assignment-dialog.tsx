"use client"

import { useState, useEffect } from "react"
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
import { format } from "date-fns"
import { CalendarIcon, Search, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAssignmentTypes } from "@/lib/services/patient-assignment-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface AddPatientAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  careProfessionalId: string
  tenantId?: string
  onAssignmentCreated: (assignment: any) => void
}

const formSchema = z.object({
  patientId: z.string({ required_error: "Please select a patient" }),
  assignmentType: z.string({ required_error: "Please select an assignment type" }),
  startDate: z.date({ required_error: "Please select a start date" }),
  endDate: z.date().optional().nullable(),
  notes: z.string().optional(),
})

export function AddPatientAssignmentDialog({
  open,
  onOpenChange,
  careProfessionalId,
  tenantId,
  onAssignmentCreated,
}: AddPatientAssignmentDialogProps) {
  const [patients, setPatients] = useState<any[]>([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [patientSearchQuery, setPatientSearchQuery] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      assignmentType: "",
      startDate: new Date(),
      endDate: null,
      notes: "",
    },
  })

  // Fetch patients whenever the dialog is opened or search query changes
  useEffect(() => {
    if (open) {
      fetchPatients(patientSearchQuery)
    }
  }, [open, patientSearchQuery])

  async function fetchPatients(searchQuery = "") {
    setLoadingPatients(true)
    try {
      const queryParams = new URLSearchParams()
      if (tenantId) queryParams.append("tenantId", tenantId)
      if (searchQuery) queryParams.append("search", searchQuery)

      const response = await fetch(`/api/patients?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const { data } = await response.json()
      setPatients(data || [])
    } catch (err) {
      console.error("Error fetching patients:", err)
    } finally {
      setLoadingPatients(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setSubmitting(true)

    try {
      const response = await fetch(`/api/care-professionals/${careProfessionalId}/patient-assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: values.patientId,
          assignmentType: values.assignmentType,
          startDate: format(values.startDate, "yyyy-MM-dd"),
          endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
          notes: values.notes,
          tenantId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Error: ${response.status}`)
      }

      const { data } = await response.json()
      onAssignmentCreated(data)
      onOpenChange(false)
      form.reset()
    } catch (err: any) {
      setError(err.message || "Failed to create patient assignment. Please try again.")
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
          <DialogTitle>Assign a Patient</DialogTitle>
          <DialogDescription>
            Assign a patient to this care professional. You can specify the type of care and assignment details.
          </DialogDescription>
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
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Patient</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? patients.find((patient) => patient.id === field.value)
                              ? `${patients.find((patient) => patient.id === field.value)?.first_name} ${
                                  patients.find((patient) => patient.id === field.value)?.last_name
                                }`
                              : "Select patient"
                            : "Select patient"}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search patients..."
                          value={patientSearchQuery}
                          onValueChange={setPatientSearchQuery}
                        />
                        {loadingPatients && (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
                          </div>
                        )}
                        {!loadingPatients && (
                          <CommandList>
                            {patients.length === 0 && <CommandEmpty>No patients found</CommandEmpty>}
                            <CommandGroup>
                              {patients.map((patient) => (
                                <CommandItem
                                  key={patient.id}
                                  value={`${patient.first_name} ${patient.last_name}`}
                                  onSelect={() => {
                                    form.setValue("patientId", patient.id)
                                  }}
                                >
                                  {patient.first_name} {patient.last_name}
                                  {patient.date_of_birth && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      (DOB: {new Date(patient.date_of_birth).toLocaleDateString()})
                                    </span>
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    Assigning...
                  </>
                ) : (
                  "Assign Patient"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
