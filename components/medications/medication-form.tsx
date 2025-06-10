"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { FormFieldComponent } from "@/components/forms/form-field"
import { useToast } from "@/components/ui/use-toast"

// Schema for medication form
const medicationSchema = z.object({
  patient_id: z.string().uuid("Invalid patient ID"),
  name: z.string().min(2, "Medication name must be at least 2 characters"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  end_date: z
    .string()
    .refine((val) => val === "" || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),
  instructions: z.string().optional(),
  prescribed_by: z.string().optional(),
  status: z.enum(["active", "discontinued", "completed"]),
  notes: z.string().optional(),
})

interface MedicationFormProps {
  patientId: string
  initialData?: z.infer<typeof medicationSchema>
  onSubmit: (data: z.infer<typeof medicationSchema>) => Promise<void>
  isSubmitting?: boolean
  careProfessionals?: { id: string; name: string }[]
}

export function MedicationForm({
  patientId,
  initialData,
  onSubmit,
  isSubmitting = false,
  careProfessionals = [],
}: MedicationFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof medicationSchema>>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialData || {
      patient_id: patientId,
      name: "",
      dosage: "",
      frequency: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      instructions: "",
      prescribed_by: "",
      status: "active",
      notes: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof medicationSchema>) => {
    try {
      await onSubmit(values)
      toast({
        title: "Success",
        description: initialData ? "Medication updated successfully" : "Medication created successfully",
      })
    } catch (error) {
      console.error("Error submitting medication form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save medication data. Please try again.",
      })
    }
  }

  // Form fields
  const formFields = [
    {
      name: "name",
      label: "Medication Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "dosage",
      label: "Dosage",
      type: "text" as const,
      placeholder: "e.g., 500mg",
      required: true,
    },
    {
      name: "frequency",
      label: "Frequency",
      type: "text" as const,
      placeholder: "e.g., Twice daily",
      required: true,
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date" as const,
      description: "Leave blank if ongoing",
    },
    {
      name: "instructions",
      label: "Instructions",
      type: "textarea" as const,
      placeholder: "e.g., Take with food",
    },
    {
      name: "prescribed_by",
      label: "Prescribed By",
      type: "select" as const,
      options: [
        { value: "", label: "Select a care professional" },
        ...careProfessionals.map((cp) => ({ value: cp.id, label: cp.name })),
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "active", label: "Active" },
        { value: "discontinued", label: "Discontinued" },
        { value: "completed", label: "Completed" },
      ],
      required: true,
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea" as const,
    },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => (
            <FormFieldComponent
              key={field.name}
              control={form.control}
              name={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              description={field.description}
              options={field.options}
              required={field.required}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Medication" : "Add Medication"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
