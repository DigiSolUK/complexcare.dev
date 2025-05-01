"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
  startDate: z.date(),
  endDate: z.date().optional(),
  reviewDate: z.date(),
  assignedTo: z.string().min(1, { message: "Assigned staff is required" }),
  goals: z.string().min(1, { message: "At least one goal is required" }),
  interventions: z.string().min(1, { message: "At least one intervention is required" }),
})

// Demo data for dropdowns
const demoPatients = [
  { id: "PT78923", name: "Emma Thompson" },
  { id: "PT45678", name: "James Wilson" },
  { id: "PT12345", name: "Olivia Parker" },
  { id: "PT34567", name: "Robert Davis" },
  { id: "PT56789", name: "Sophia Martinez" },
]

const demoStaff = [
  { id: "ST001", name: "Dr. Sarah Johnson" },
  { id: "ST002", name: "Dr. Michael Chen" },
  { id: "ST003", name: "Dr. Emily Rodriguez" },
  { id: "ST004", name: "Dr. James Wilson" },
  { id: "ST005", name: "Dr. Lisa Thompson" },
]

interface CarePlanFormProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void
  defaultValues?: Partial<z.infer<typeof formSchema>>
  isEdit?: boolean
}

export function CarePlanForm({ onSubmit, defaultValues, isEdit = false }: CarePlanFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      patientId: "",
      title: "",
      description: "",
      status: "draft",
      startDate: new Date(),
      goals: "",
      interventions: "",
      assignedTo: "",
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form data:", data)
    if (onSubmit) {
      onSubmit(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Selection */}
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {demoPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.id})
                      </SelectItem>
                    ))}
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
                  {...field}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          {/* Review Date */}
          <FormField
            control={form.control}
            name="reviewDate"
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
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Assigned To */}
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {demoStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))}
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
                  placeholder="Enter goals, one per line or separated by commas..."
                  className="min-h-[100px]"
                  {...field}
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
                  placeholder="Enter interventions, one per line or separated by commas..."
                  className="min-h-[100px]"
                  {...field}
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
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">{isEdit ? "Update" : "Create"} Care Plan</Button>
        </div>
      </form>
    </Form>
  )
}
