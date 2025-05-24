"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Clock, Pencil } from "lucide-react"

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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { updateAppointmentAction, getAppointmentByIdAction } from "@/lib/actions/appointment-actions"
import { toast } from "@/components/ui/use-toast"
import type { Appointment } from "@/types/appointment"

const formSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  provider_id: z.string().min(1, "Provider is required"),
  title: z.string().min(1, "Title is required"),
  appointment_date: z.date({
    required_error: "Appointment date is required",
  }),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  status: z.string().min(1, "Status is required"),
  type: z.string().min(1, "Type is required"),
  notes: z.string().optional(),
  location: z.string().optional(),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z.string().optional(),
  recurrence_end_date: z.date().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Patient {
  id: string
  first_name: string
  last_name: string
}

interface Provider {
  id: string
  first_name: string
  last_name: string
}

interface EditAppointmentDialogProps {
  appointmentId: string
  patients: Patient[]
  providers: Provider[]
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function EditAppointmentDialog({
  appointmentId,
  patients,
  providers,
  onSuccess,
  trigger,
}: EditAppointmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "scheduled",
      is_recurring: false,
    },
  })

  const isRecurring = form.watch("is_recurring")

  useEffect(() => {
    if (open && appointmentId) {
      const fetchAppointment = async () => {
        setIsLoading(true)
        try {
          const result = await getAppointmentByIdAction(appointmentId)
          if (result.success && result.data) {
            setAppointment(result.data)

            const startDate = parseISO(result.data.start_time)
            const endDate = parseISO(result.data.end_time)

            form.reset({
              patient_id: result.data.patient_id,
              provider_id: result.data.provider_id,
              title: result.data.title,
              appointment_date: startDate,
              start_time: format(startDate, "HH:mm"),
              end_time: format(endDate, "HH:mm"),
              status: result.data.status,
              type: result.data.type,
              notes: result.data.notes || "",
              location: result.data.location || "",
              is_recurring: result.data.is_recurring || false,
              recurrence_pattern: result.data.recurrence_pattern,
              recurrence_end_date: result.data.recurrence_end_date
                ? parseISO(result.data.recurrence_end_date)
                : undefined,
            })
          } else {
            toast({
              title: "Error",
              description: "Failed to load appointment details",
              variant: "destructive",
            })
            setOpen(false)
          }
        } catch (error) {
          console.error("Error fetching appointment:", error)
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
          setOpen(false)
        } finally {
          setIsLoading(false)
        }
      }

      fetchAppointment()
    }
  }, [open, appointmentId, form])

  async function onSubmit(values: FormValues) {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("patient_id", values.patient_id)
      formData.append("provider_id", values.provider_id)
      formData.append("title", values.title)

      // Combine date and time for start and end
      const startDateTime = new Date(values.appointment_date)
      const [startHours, startMinutes] = values.start_time.split(":").map(Number)
      startDateTime.setHours(startHours, startMinutes)

      const endDateTime = new Date(values.appointment_date)
      const [endHours, endMinutes] = values.end_time.split(":").map(Number)
      endDateTime.setHours(endHours, endMinutes)

      formData.append("start_time", startDateTime.toISOString())
      formData.append("end_time", endDateTime.toISOString())

      formData.append("status", values.status)
      formData.append("type", values.type)

      if (values.notes) formData.append("notes", values.notes)
      if (values.location) formData.append("location", values.location)

      formData.append("is_recurring", values.is_recurring.toString())

      if (values.is_recurring) {
        if (values.recurrence_pattern) {
          formData.append("recurrence_pattern", values.recurrence_pattern)
        }

        if (values.recurrence_end_date) {
          formData.append("recurrence_end_date", values.recurrence_end_date.toISOString())
        }
      }

      const result = await updateAppointmentAction(appointmentId, formData)

      if (result.success) {
        toast({
          title: "Appointment updated",
          description: "The appointment has been updated successfully.",
        })
        setOpen(false)
        if (onSuccess) onSuccess()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update appointment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>Update the appointment details.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patient_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.first_name} {patient.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provider_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Care Professional</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.first_name} {provider.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter appointment title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="appointment_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
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

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="initial_assessment">Initial Assessment</SelectItem>
                          <SelectItem value="follow_up">Follow-up</SelectItem>
                          <SelectItem value="therapy">Therapy Session</SelectItem>
                          <SelectItem value="medication_review">Medication Review</SelectItem>
                          <SelectItem value="care_plan_review">Care Plan Review</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no-show">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location (optional)" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes (optional)"
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Recurring Appointment</FormLabel>
                      <FormDescription>Set this appointment to repeat on a schedule</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {isRecurring && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recurrence_pattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurrence Pattern</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recurrence_end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick an end date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                form.getValues("appointment_date") && date < form.getValues("appointment_date")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Appointment"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
