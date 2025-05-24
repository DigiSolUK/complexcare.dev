"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, CalendarIcon, Plus, AlertCircle, Stethoscope, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAssignmentTypes } from "@/lib/services/patient-assignment-service"
import { formatDate } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"

interface PatientCareProvidersProps {
  patientId: string
  tenantId?: string
  className?: string
}

export function PatientCareProviders({ patientId, tenantId, className = "" }: PatientCareProvidersProps) {
  const [careProviders, setCareProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Fetch care providers
  const fetchCareProviders = async () => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      if (tenantId) queryParams.append("tenantId", tenantId)

      const response = await fetch(`/api/patients/${patientId}/care-providers?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const { data } = await response.json()
      setCareProviders(data || [])
    } catch (err) {
      console.error("Error fetching patient care providers:", err)
      setError("Failed to load care providers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (patientId) {
      fetchCareProviders()
    }
  }, [patientId, tenantId])

  const handleRemoveCareProvider = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to end this care provider assignment?")) {
      return
    }

    try {
      // Get the care professional ID from the assignment
      const assignment = careProviders.find((cp) => cp.id === assignmentId)
      if (!assignment) return

      const careProfessionalId = assignment.care_professional_id

      const response = await fetch(
        `/api/care-professionals/${careProfessionalId}/patient-assignments/${assignmentId}?endImmediately=true`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Remove the provider from the list
      setCareProviders((prev) => prev.filter((cp) => cp.id !== assignmentId))
    } catch (err) {
      console.error("Error removing care provider:", err)
      alert("Failed to remove care provider. Please try again.")
    }
  }

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Care Providers</CardTitle>
          <CardDescription>Manage care providers for this patient</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchCareProviders}>
              Retry
            </Button>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (careProviders.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Care Providers</CardTitle>
          <CardDescription>Manage care providers for this patient</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No care providers assigned</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              This patient doesn't have any care providers assigned yet.
            </p>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Care Provider
            </Button>
          </div>
        </CardContent>

        <AddCareProviderDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          patientId={patientId}
          tenantId={tenantId}
          onProviderAdded={(newProvider) => {
            setCareProviders((prev) => [newProvider, ...prev])
          }}
        />
      </Card>
    )
  }

  // Display care providers
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Care Providers</CardTitle>
          <CardDescription>
            {careProviders.length} care provider{careProviders.length !== 1 ? "s" : ""} assigned to this patient
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Provider
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {careProviders.map((provider) => {
            const isActive = !provider.end_date || new Date(provider.end_date) >= new Date()
            const assignmentTypes = getAssignmentTypes()
            const assignmentTypeLabel =
              assignmentTypes.find((t) => t.value === provider.assignment_type)?.label || provider.assignment_type

            return (
              <div
                key={provider.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => (window.location.href = `/care-professionals/${provider.care_professional_id}`)}
              >
                <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={provider.avatar_url || "/placeholder.svg?height=40&width=40&query=doctor"}
                      alt={`${provider.first_name} ${provider.last_name}`}
                    />
                    <AvatarFallback>
                      {provider.first_name?.[0]}
                      {provider.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">
                      {provider.title && `${provider.title} `}
                      {provider.first_name} {provider.last_name}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline">{provider.role}</Badge>
                      <Badge variant={isActive ? "default" : "outline"}>{assignmentTypeLabel}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(provider.start_date)}
                    {provider.end_date && ` - ${formatDate(provider.end_date)}`}
                  </span>
                  {isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveCareProvider(provider.id)
                      }}
                    >
                      End
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <AddCareProviderDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        patientId={patientId}
        tenantId={tenantId}
        onProviderAdded={(newProvider) => {
          setCareProviders((prev) => [newProvider, ...prev])
        }}
      />
    </Card>
  )
}

// Form schema for adding care provider
const formSchema = z.object({
  careProfessionalId: z.string({ required_error: "Please select a care provider" }),
  assignmentType: z.string({ required_error: "Please select an assignment type" }),
  startDate: z.date({ required_error: "Please select a start date" }),
  endDate: z.date().optional().nullable(),
  notes: z.string().optional(),
})

interface AddCareProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  tenantId?: string
  onProviderAdded: (provider: any) => void
}

function AddCareProviderDialog({
  open,
  onOpenChange,
  patientId,
  tenantId,
  onProviderAdded,
}: AddCareProviderDialogProps) {
  const [careProviders, setCareProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careProfessionalId: "",
      assignmentType: "",
      startDate: new Date(),
      endDate: null,
      notes: "",
    },
  })

  // Fetch available care professionals
  useEffect(() => {
    const fetchCareProviders = async () => {
      if (!open) return

      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (tenantId) queryParams.append("tenantId", tenantId)

        const response = await fetch(`/api/care-professionals?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const { data } = await response.json()
        setCareProviders(data || [])
      } catch (err) {
        console.error("Error fetching care professionals:", err)
        setError("Failed to load care professionals")
      } finally {
        setLoading(false)
      }
    }

    fetchCareProviders()
  }, [open, tenantId])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setSubmitting(true)

    try {
      const response = await fetch(`/api/care-professionals/${values.careProfessionalId}/patient-assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId,
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

      // Find care professional details
      const careProfessional = careProviders.find((cp) => cp.id === values.careProfessionalId)

      // Add the new provider to the list
      const newProvider = {
        ...data,
        first_name: careProfessional?.first_name,
        last_name: careProfessional?.last_name,
        title: careProfessional?.title,
        role: careProfessional?.role,
        avatar_url: careProfessional?.avatar_url,
      }

      onProviderAdded(newProvider)
      onOpenChange(false)
      form.reset()
    } catch (err: any) {
      setError(err.message || "Failed to assign care provider. Please try again.")
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
          <DialogTitle>Assign Care Provider</DialogTitle>
          <DialogDescription>
            Assign a care professional to this patient. You can specify the type of care and assignment details.
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
              name="careProfessionalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Care Professional</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select care professional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      ) : careProviders.length > 0 ? (
                        careProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.title && `${provider.title} `}
                            {provider.first_name} {provider.last_name} - {provider.role}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">No care professionals found</div>
                      )}
                    </SelectContent>
                  </Select>
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
                  "Assign Provider"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
