"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { CareProfessional } from "@/types"
import { useErrorTracking } from "@/lib/error-tracking"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  license_number: z.string().optional(),
  employment_status: z.string().optional(),
  is_active: z.boolean().default(true),
  address: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateCareProfessionalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (professional: CareProfessional) => void
}

export function CreateCareProfessionalDialog({ open, onOpenChange, onSuccess }: CreateCareProfessionalDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { trackError } = useErrorTracking()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "",
      specialization: "",
      qualification: "",
      license_number: "",
      employment_status: "Full-time",
      is_active: true,
      address: "",
      notes: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/care-professionals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create care professional")
      }

      const newProfessional = await response.json()

      toast({
        title: "Success",
        description: "Care professional created successfully.",
      })

      if (onSuccess) {
        onSuccess(newProfessional)
      }

      form.reset()
      onOpenChange(false)
    } catch (err) {
      console.error("Error creating care professional:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)

      trackError(err as Error, {
        component: "CreateCareProfessionalDialog",
        action: "createCareProfessional",
        severity: "high",
        category: "database",
        metadata: {
          email: values.email,
          role: values.role,
          hasLicenseNumber: !!values.license_number,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Care Professional</DialogTitle>
          <DialogDescription>
            Create a new care professional record. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
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
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="07700 900123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Registered Nurse">Registered Nurse</SelectItem>
                        <SelectItem value="Healthcare Assistant">Healthcare Assistant</SelectItem>
                        <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                        <SelectItem value="Occupational Therapist">Occupational Therapist</SelectItem>
                        <SelectItem value="Speech Therapist">Speech Therapist</SelectItem>
                        <SelectItem value="Social Worker">Social Worker</SelectItem>
                        <SelectItem value="Care Coordinator">Care Coordinator</SelectItem>
                        <SelectItem value="Mental Health Nurse">Mental Health Nurse</SelectItem>
                        <SelectItem value="Dietitian">Dietitian</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Palliative Care" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. RN, BSc Nursing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. RN123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="employment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                        <SelectItem value="Agency">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>Is this care professional currently active?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
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
                    <Textarea placeholder="Enter address" {...field} />
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
                    <Textarea placeholder="Additional information" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Professional"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
