"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import { PatientService } from "@/lib/services/patient-service"
import { CareProfessionalService } from "@/lib/services/care-professional-service"
import {
  getClinicalNoteCategories,
  getClinicalNoteTemplates,
  createClinicalNote,
} from "@/lib/actions/clinical-notes-actions"
import type { Patient, CareProfessional, ClinicalNoteCategory, ClinicalNoteTemplate } from "@/types"
import { getCurrentUser } from "@/lib/auth-utils" // To get current user's ID for careProfessionalId

const formSchema = z.object({
  patientId: z.string().uuid("Please select a patient."),
  careProfessionalId: z.string().uuid("Please select a care professional."),
  categoryId: z.string().uuid("Please select a category."),
  templateId: z.string().uuid("Invalid template ID").optional().nullable(),
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  noteDate: z.date({ required_error: "Note date is required." }),
})

interface CreateClinicalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteCreated: () => void
  defaultPatientId?: string
  defaultPatientName?: string
}

export function CreateClinicalNoteDialog({
  open,
  onOpenChange,
  onNoteCreated,
  defaultPatientId,
  defaultPatientName,
}: CreateClinicalNoteDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([])
  const [templates, setTemplates] = useState<ClinicalNoteTemplate[]>([])
  const [currentUserCareProfessionalId, setCurrentUserCareProfessionalId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: defaultPatientId || "",
      careProfessionalId: "", // Will be set by useEffect
      categoryId: "",
      templateId: null,
      title: "",
      content: "",
      noteDate: new Date(),
    },
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const patientService = await PatientService.create()
        const fetchedPatients = await patientService.getPatients()
        setPatients(fetchedPatients)

        const careProfessionalService = await CareProfessionalService.create()
        const fetchedCareProfessionals = await careProfessionalService.getCareProfessionals()
        setCareProfessionals(fetchedCareProfessionals)

        const categoriesResult = await getClinicalNoteCategories()
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data)
        }

        // Attempt to set current user as default care professional
        const currentUser = await getCurrentUser()
        if (currentUser?.id) {
          const matchingCp = fetchedCareProfessionals.find((cp) => cp.email === currentUser.email)
          if (matchingCp) {
            setCurrentUserCareProfessionalId(matchingCp.id)
            form.setValue("careProfessionalId", matchingCp.id)
          }
        }
      } catch (error) {
        console.error("Failed to fetch data for clinical note dialog:", error)
        toast({
          title: "Error",
          description: "Failed to load necessary data for clinical note form.",
          variant: "destructive",
        })
      }
    }
    if (open) {
      fetchData()
    }
  }, [open, toast, form])

  // Effect to load templates when category changes
  useEffect(() => {
    const selectedCategoryId = form.watch("categoryId")
    if (selectedCategoryId) {
      getClinicalNoteTemplates(selectedCategoryId).then((result) => {
        if (result.success && result.data) {
          setTemplates(result.data)
          form.setValue("templateId", null) // Reset template when category changes
        } else {
          setTemplates([])
        }
      })
    } else {
      setTemplates([])
    }
  }, [form.watch("categoryId")])

  // Update form default patient if defaultPatientId changes
  useEffect(() => {
    if (defaultPatientId) {
      form.setValue("patientId", defaultPatientId)
    }
  }, [defaultPatientId, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await createClinicalNote({
        patientId: values.patientId,
        careProfessionalId: values.careProfessionalId,
        categoryId: values.categoryId,
        templateId: values.templateId,
        title: values.title,
        content: values.content,
        noteDate: values.noteDate,
      })

      if (result.success) {
        toast({
          title: "Clinical Note Created",
          description: "The clinical note has been added successfully.",
        })
        form.reset({
          patientId: defaultPatientId || "", // Reset to default patient if provided
          careProfessionalId: currentUserCareProfessionalId || "",
          categoryId: "",
          templateId: null,
          title: "",
          content: "",
          noteDate: new Date(),
        })
        onNoteCreated()
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create clinical note.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating clinical note:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the clinical note.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = templates.find((t) => t.id === templateId)
    if (selectedTemplate) {
      form.setValue("content", selectedTemplate.content)
      form.setValue("templateId", templateId)
    } else {
      form.setValue("content", "")
      form.setValue("templateId", null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Clinical Note</DialogTitle>
          <DialogDescription>Fill in the details for the new clinical note.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!defaultPatientId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={defaultPatientName || "Select a patient"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.fullName}
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
              name="careProfessionalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Care Professional</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select care professional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {careProfessionals.map((cp) => (
                        <SelectItem key={cp.id} value={cp.id}>
                          {cp.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template (Optional)</FormLabel>
                    <Select onValueChange={handleTemplateChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger disabled={templates.length === 0}>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no_template">No Template</SelectItem>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daily Progress Note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your clinical note here..." rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="noteDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Note Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
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
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Note
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
