"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPatient, updatePatient } from "@/lib/actions/patient-actions"
import { useErrorTracking } from "@/lib/error-tracking"

// Define the schema for patient form validation
const patientFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  date_of_birth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.string({
    required_error: "Gender is required",
  }),
  nhs_number: z.string().optional(),
  contact_number: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional(),
  primary_condition: z.string().optional(),
  primary_care_provider: z.string().optional(),
  status: z.string().default("active"),
  notes: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

interface PatientFormProps {
  initialData?: Partial<PatientFormValues>
  onSuccess?: (data: any) => void
  isEdit?: boolean
  patientId?: string
}

export function PatientForm({ initialData, onSuccess, isEdit = false, patientId }: PatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { trackError } = useErrorTracking()

  // Set default values for the form
  const defaultValues: Partial<PatientFormValues> = {
    first_name: "",
    last_name: "",
    gender: "not_specified",
    status: "active",
    ...initialData,
  }

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
  })

  async function onSubmit(data: PatientFormValues) {
    setIsSubmitting(true)
    try {
      let result

      if (isEdit && patientId) {
        result = await updatePatient(patientId, data)
      } else {
        result = await createPatient(data)
      }

      if (result.success) {
        toast({
          title: isEdit ? "Patient updated" : "Patient created",
          description: isEdit
            ? "Patient record has been updated successfully."
            : "New patient has been added successfully.",
        })

        if (onSuccess) {
          onSuccess(result.data)
        }
      } else {
        throw new Error(result.error || "An error occurred")
      }
    } catch (error: any) {
      // Track the error with detailed context
      trackError(error, {
        component: "PatientForm",
        action: isEdit ? "updatePatient" : "createPatient",
        patientId: patientId,
        formData: {
          firstName: data.first_name,
          lastName: data.last_name,
          hasEmail: !!data.email,
          hasNhsNumber: !!data.nhs_number,
        },
        severity: "high",
        category: "database",
      })

      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="not_specified">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nhs_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NHS Number</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>10-digit NHS number if available</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="+44 7700 900123" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.smith@example.com" {...field} value={field.value || ""} />
                </FormControl>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primary_care_provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Care Provider</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Jane Smith" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="123 Main Street, London, UK"
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
          name="primary_condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Condition</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type 2 diabetes diagnosed in 2010, Hypertension since 2015"
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about the patient"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Patient" : "Create Patient"}
        </Button>
      </form>
    </Form>
  )
}
