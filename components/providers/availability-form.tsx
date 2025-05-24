"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { createAvailabilityAction, updateAvailabilityAction } from "@/lib/actions/availability-actions"
import { toast } from "@/components/ui/use-toast"
import type { ProviderAvailability } from "@/types/availability"

const formSchema = z.object({
  provider_id: z.string().min(1, "Provider is required"),
  availability_type: z.enum(["working_hours", "break", "time_off", "special_hours"]),
  is_available: z.boolean().default(true),
  recurrence_type: z.enum(["weekly", "biweekly", "monthly", "once", "custom"]),
  day_of_week: z.number().min(0).max(6).nullable().optional(),
  specific_date: z.date().nullable().optional(),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Provider {
  id: string
  first_name: string
  last_name: string
}

interface AvailabilityFormProps {
  providers: Provider[]
  providerId?: string
  availability?: ProviderAvailability
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function AvailabilityForm({ providers, providerId, availability, onSuccess, trigger }: AvailabilityFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isEditing = !!availability

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider_id: providerId || "",
      availability_type: availability?.availability_type || "working_hours",
      is_available: availability?.is_available ?? true,
      recurrence_type: availability?.recurrence_type || "weekly",
      day_of_week: availability?.day_of_week ?? null,
      specific_date: availability?.specific_date ? new Date(availability.specific_date) : null,
      start_time: availability?.start_time || "09:00",
      end_time: availability?.end_time || "17:00",
      notes: availability?.notes || "",
    },
  })

  const recurrenceType = form.watch("recurrence_type")
  const availabilityType = form.watch("availability_type")

  async function onSubmit(values: FormValues) {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("provider_id", values.provider_id)
      formData.append("availability_type", values.availability_type)
      formData.append("is_available", values.is_available.toString())
      formData.append("recurrence_type", values.recurrence_type)

      if (values.recurrence_type !== "once") {
        if (values.day_of_week !== null && values.day_of_week !== undefined) {
          formData.append("day_of_week", values.day_of_week.toString())
        }
      } else {
        if (values.specific_date) {
          formData.append("specific_date", format(values.specific_date, "yyyy-MM-dd"))
        }
      }

      formData.append("start_time", values.start_time)
      formData.append("end_time", values.end_time)

      if (values.notes) {
        formData.append("notes", values.notes)
      }

      let result

      if (isEditing && availability) {
        result = await updateAvailabilityAction(availability.id, formData)
      } else {
        result = await createAvailabilityAction(formData)
      }

      if (result.success) {
        toast({
          title: isEditing ? "Availability updated" : "Availability created",
          description: isEditing
            ? "The availability has been updated successfully."
            : "The availability has been created successfully.",
        })
        setOpen(false)
        if (onSuccess) onSuccess()
      } else {
        toast({
          title: "Error",
          description: result.error || (isEditing ? "Failed to update availability" : "Failed to create availability"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(isEditing ? "Error updating availability:" : "Error creating availability:", error)
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
      <DialogTrigger asChild>{trigger || <Button>Add Availability</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Availability" : "Add Availability"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the availability settings for this provider."
              : "Set when a provider is available for appointments."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!providerId && (
              <FormField
                control={form.control}
                name="provider_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            )}

            <FormField
              control={form.control}
              name="availability_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="working_hours">Working Hours</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                      <SelectItem value="time_off">Time Off</SelectItem>
                      <SelectItem value="special_hours">Special Hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {availabilityType === "working_hours" && "Regular working hours when the provider is available"}
                    {availabilityType === "break" && "Regular breaks during working hours"}
                    {availabilityType === "time_off" && "Time off for vacation, sick leave, etc."}
                    {availabilityType === "special_hours" && "Special or irregular working hours"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Available</FormLabel>
                    <FormDescription>
                      {field.value
                        ? "Provider is available during this time"
                        : "Provider is NOT available during this time"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recurrence_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurrence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="once">One-time</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {recurrenceType === "weekly" && "Repeats every week on the same day"}
                    {recurrenceType === "biweekly" && "Repeats every two weeks on the same day"}
                    {recurrenceType === "monthly" && "Repeats every month on the same day"}
                    {recurrenceType === "once" && "Occurs only once on a specific date"}
                    {recurrenceType === "custom" && "Custom recurrence pattern"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {recurrenceType !== "once" ? (
              <FormField
                control={form.control}
                name="day_of_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Monday</SelectItem>
                        <SelectItem value="1">Tuesday</SelectItem>
                        <SelectItem value="2">Wednesday</SelectItem>
                        <SelectItem value="3">Thursday</SelectItem>
                        <SelectItem value="4">Friday</SelectItem>
                        <SelectItem value="5">Saturday</SelectItem>
                        <SelectItem value="6">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="specific_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Specific Date</FormLabel>
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional notes (optional)" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
