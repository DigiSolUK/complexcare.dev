"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { Patient, CareProfessional } from "@/types"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  patient_id: z.string().min(1, { message: "Patient is required" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().nullable().optional(),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  review_date: z.date().nullable(),
  assigned_to: z.string().nullable().optional(),
  goals: z.string().nullable().optional(),
  interventions: z.string().nullable().optional(),
})

interface CarePlanFormProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void
  defaultValues?: Partial<z.infer<typeof formSchema>>
  isEdit?: boolean
  onCancel?: () => void
}

export function CarePlanForm({ onSubmit, defaultValues, isEdit = false, onCancel }: CarePlanFormProps) {
  const { toast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [loadingCareProfessionals, setLoadingCareProfessionals] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: defaultValues?.patient_id || "",
      title: defaultValues?.title || "",
      description: defaultValues?.description || null,
      status: defaultValues?.status || "draft",
      start_date: defaultValues?.start_date || new Date(),
      end_date: defaultValues?.end_date || null,
      review_date: defaultValues?.review_date || null,
      assigned_to: defaultValues?.assigned_to || null,
      goals: defaultValues?.goals || null,
      interventions: defaultValues?.interventions || null,
    },
  })

  useEffect(() => {
    async function fetchData() {
      // Fetch Patients
      try {
        setLoadingPatients(true)
        const patientsResponse = await fetch("/api/patients")
        if (!patientsResponse.ok) throw new Error("Failed to fetch patients")
        const patientsData: Patient[] = await patientsResponse.json()
        setPatients(patientsData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load patients: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoadingPatients(false)
      }

      // Fetch Care Professionals
      try {
        setLoadingCareProfessionals(true)
        const cpResponse = await fetch("/api/care-professionals")
        if (!cpResponse.ok) throw new Error("Failed to fetch care professionals")
        const cpData: CareProfessional[] = await cpResponse.json()
        setCareProfessionals(cpData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load care professionals: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoadingCareProfessionals(false)
      }
    }
    fetchData()
  }, [toast])

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Convert Date objects to 'YYYY-MM-DD' strings for database
    const formattedData = {
      ...data,
      start_date: format(data.start_date, "yyyy-MM-dd"),
      end_date: data.end_date ? format(data.end_date, "yyyy-MM-dd") : null,
      review_date: data.review_date ? format(data.review_date, "yyyy-MM-dd") : null,
      // Ensure empty strings become null for optional text fields
      description: data.description === "" ? null : data.description,
      goals: data.goals === "" ? null : data.goals,
      interventions: data.interventions === "" ? null : data.interventions,
      assigned_to: data.assigned_to === "" ? null : data.assigned_to,
    }
    if (onSubmit) {
      onSubmit(formattedData)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Selection */}
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={loadingPatients}>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.length === 0 && !loadingPatients ? (
                      <SelectItem value="" disabled>
                        No patients available
                      </SelectItem>
                    ) : (
                      patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} (
                          {patient.medical_record_number || patient.id.substring(0, 8)})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Care Plan Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Care Plan Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Diabetes Management Plan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the care plan objectives and approach..."
                  className="min-h-[100px]"
                  value={field.value || ""} // Ensure controlled component
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status */}
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="start_date"
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

          {/* Review Date */}
          <FormField
            control={form.control}
            name="review_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Next Review Date</FormLabel>
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
        </div>

        {/* End Date */}
        <FormField
          control={form.control}
          name="end_date"
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
                  <Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormDescription>The expected completion date for this care plan.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Assigned To */}
        <FormField
          control={form.control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To (Care Professional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger disabled={loadingCareProfessionals}>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Not Assigned</SelectItem> {/* Option for no assignment */}
                  {careProfessionals.length === 0 && !loadingCareProfessionals ? (
                    <SelectItem value="" disabled>
                      No care professionals available
                    </SelectItem>
                  ) : (
                    careProfessionals.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name} ({staff.role})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Goals */}
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter goals, one per line or separated by commas (e.g., Goal 1, Goal 2)..."
                  className="min-h-[100px]"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                List the specific goals for this care plan. Each goal should be measurable and achievable.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interventions */}
        <FormField
          control={form.control}
          name="interventions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interventions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter interventions, one per line or separated by commas (e.g., Intervention A, Intervention B)..."
                  className="min-h-[100px]"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                List the specific interventions and actions to achieve the care plan goals.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEdit ? "Update" : "Create"} Care Plan</Button>
        </div>
      </form>
    </Form>
  )
}
