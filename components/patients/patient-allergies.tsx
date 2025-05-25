"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Plus, AlertTriangle, Shield, Edit, Trash2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface Allergy {
  id: string
  patient_id: string
  allergen: string
  allergen_type: string
  reaction: string
  severity: string
  onset_date: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

interface PatientAllergiesProps {
  patientId: string
}

const allergyFormSchema = z.object({
  allergen: z.string().min(2, {
    message: "Allergen must be at least 2 characters.",
  }),
  allergen_type: z.string({
    required_error: "Please select an allergen type",
  }),
  reaction: z.string().min(2, {
    message: "Reaction must be at least 2 characters.",
  }),
  severity: z.string({
    required_error: "Please select a severity level",
  }),
  onset_date: z.date().optional(),
  status: z.string({
    required_error: "Please select a status",
  }),
  notes: z.string().optional(),
})

export function PatientAllergies({ patientId }: PatientAllergiesProps) {
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null)

  const form = useForm<z.infer<typeof allergyFormSchema>>({
    resolver: zodResolver(allergyFormSchema),
    defaultValues: {
      allergen_type: "medication",
      severity: "moderate",
      status: "active",
    },
  })

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/patients/${patientId}/allergies`)

        if (response.ok) {
          const data = await response.json()
          setAllergies(data)
        } else {
          console.error("Failed to fetch allergies")
          // For demo purposes, set some sample data
          setAllergies([
            {
              id: "1",
              patient_id: patientId,
              allergen: "Penicillin",
              allergen_type: "medication",
              reaction: "Rash, difficulty breathing",
              severity: "severe",
              onset_date: "2018-03-22",
              status: "active",
              notes: "Avoid all penicillin-based antibiotics.",
              created_at: "2018-03-22T16:20:00Z",
              updated_at: "2018-03-22T16:20:00Z",
            },
            {
              id: "2",
              patient_id: patientId,
              allergen: "Peanuts",
              allergen_type: "food",
              reaction: "Hives, swelling",
              severity: "moderate",
              onset_date: "2015-07-10",
              status: "active",
              notes: "Carries EpiPen.",
              created_at: "2015-07-10T09:15:00Z",
              updated_at: "2015-07-10T09:15:00Z",
            },
            {
              id: "3",
              patient_id: patientId,
              allergen: "Latex",
              allergen_type: "environmental",
              reaction: "Contact dermatitis",
              severity: "mild",
              onset_date: "2019-11-05",
              status: "active",
              created_at: "2019-11-05T14:30:00Z",
              updated_at: "2019-11-05T14:30:00Z",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching allergies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllergies()
  }, [patientId])

  useEffect(() => {
    if (editingAllergy) {
      form.reset({
        allergen: editingAllergy.allergen,
        allergen_type: editingAllergy.allergen_type,
        reaction: editingAllergy.reaction,
        severity: editingAllergy.severity,
        onset_date: editingAllergy.onset_date ? new Date(editingAllergy.onset_date) : undefined,
        status: editingAllergy.status,
        notes: editingAllergy.notes,
      })
      setIsAddDialogOpen(true)
    } else {
      form.reset({
        allergen_type: "medication",
        severity: "moderate",
        status: "active",
      })
    }
  }, [editingAllergy, form])

  const onSubmit = async (values: z.infer<typeof allergyFormSchema>) => {
    try {
      // In a real implementation, you would send this to your API
      console.log("Submitting allergy:", values)

      if (editingAllergy) {
        // Update existing allergy
        const updatedAllergy: Allergy = {
          ...editingAllergy,
          allergen: values.allergen,
          allergen_type: values.allergen_type,
          reaction: values.reaction,
          severity: values.severity,
          onset_date: values.onset_date ? values.onset_date.toISOString().split("T")[0] : editingAllergy.onset_date,
          status: values.status,
          notes: values.notes,
          updated_at: new Date().toISOString(),
        }

        setAllergies(allergies.map((a) => (a.id === editingAllergy.id ? updatedAllergy : a)))
      } else {
        // Add new allergy
        const newAllergy: Allergy = {
          id: `temp-${Date.now()}`,
          patient_id: patientId,
          allergen: values.allergen,
          allergen_type: values.allergen_type,
          reaction: values.reaction,
          severity: values.severity,
          onset_date: values.onset_date
            ? values.onset_date.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          status: values.status,
          notes: values.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setAllergies([newAllergy, ...allergies])
      }

      setIsAddDialogOpen(false)
      setEditingAllergy(null)
      form.reset()
    } catch (error) {
      console.error("Error saving allergy:", error)
    }
  }

  const handleEdit = (allergy: Allergy) => {
    setEditingAllergy(allergy)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this allergy?")) {
      setAllergies(allergies.filter((a) => a.id !== id))
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "mild":
        return "bg-yellow-100 text-yellow-800"
      case "moderate":
        return "bg-orange-100 text-orange-800"
      case "severe":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAllergenTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "medication":
        return "bg-blue-100 text-blue-800"
      case "food":
        return "bg-green-100 text-green-800"
      case "environmental":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
          <CardDescription>Patient's allergies and adverse reactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Allergies</CardTitle>
          <CardDescription>Patient's allergies and adverse reactions</CardDescription>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) setEditingAllergy(null)
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Allergy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingAllergy ? "Edit Allergy" : "Add Allergy"}</DialogTitle>
              <DialogDescription>
                {editingAllergy
                  ? "Update the allergy information for this patient."
                  : "Add a new allergy or adverse reaction for this patient."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="allergen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergen</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Penicillin, Peanuts, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allergen_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergen Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an allergen type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reaction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reaction</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Rash, Hives, Anaphylaxis, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="onset_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Onset Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date (optional)</span>}
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
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
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
                          placeholder="Additional notes about this allergy"
                          className="resize-none"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">{editingAllergy ? "Update" : "Add"} Allergy</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {allergies.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Allergies Recorded</h3>
            <p className="text-muted-foreground mb-4">
              No allergies or adverse reactions have been recorded for this patient.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Allergy
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {allergies.map((allergy) => (
              <Card key={allergy.id} className="overflow-hidden">
                <div className="flex border-b">
                  <div className={`px-4 py-2 flex items-center justify-center ${getSeverityColor(allergy.severity)}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <CardHeader className="py-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{allergy.allergen}</CardTitle>
                        <Badge variant="outline" className={getAllergenTypeColor(allergy.allergen_type)}>
                          {allergy.allergen_type.charAt(0).toUpperCase() + allergy.allergen_type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getSeverityColor(allergy.severity)}>
                          {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                        </Badge>
                        {allergy.status === "active" && <Badge variant="default">Active</Badge>}
                        {allergy.status === "inactive" && <Badge variant="outline">Inactive</Badge>}
                        {allergy.status === "resolved" && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      Reaction: {allergy.reaction}
                      {allergy.onset_date && ` • Onset: ${format(parseISO(allergy.onset_date), "PPP")}`}
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="pt-4 pb-2">
                  {allergy.notes && <p className="text-sm mb-4">{allergy.notes}</p>}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(allergy)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(allergy.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
