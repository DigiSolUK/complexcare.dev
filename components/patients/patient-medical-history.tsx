"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Plus, FileText, Activity, Stethoscope, Pill, Syringe, AlertTriangle } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface MedicalHistoryItem {
  id: string
  patient_id: string
  record_type: string
  record_date: string
  description: string
  provider: string
  is_active: boolean
  is_resolved: boolean
  resolution_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface PatientMedicalHistoryProps {
  patientId: string
}

const medicalHistoryFormSchema = z.object({
  record_type: z.string({
    required_error: "Please select a record type",
  }),
  record_date: z.date({
    required_error: "Please select a date",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  provider: z.string().optional(),
  is_active: z.boolean().default(true),
  is_resolved: z.boolean().default(false),
  resolution_date: z.date().optional(),
  notes: z.string().optional(),
})

export function PatientMedicalHistory({ patientId }: PatientMedicalHistoryProps) {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof medicalHistoryFormSchema>>({
    resolver: zodResolver(medicalHistoryFormSchema),
    defaultValues: {
      record_type: "condition",
      is_active: true,
      is_resolved: false,
    },
  })

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/patients/${patientId}/medical-history`)

        if (response.ok) {
          const data = await response.json()
          setMedicalHistory(data)
        } else {
          console.error("Failed to fetch medical history")
          // For demo purposes, set some sample data
          setMedicalHistory([
            {
              id: "1",
              patient_id: patientId,
              record_type: "condition",
              record_date: "2020-05-15",
              description: "Type 2 Diabetes",
              provider: "Dr. Elizabeth Johnson",
              is_active: true,
              is_resolved: false,
              notes: "Diagnosed following routine blood work. Started on metformin.",
              created_at: "2020-05-15T10:30:00Z",
              updated_at: "2020-05-15T10:30:00Z",
            },
            {
              id: "2",
              patient_id: patientId,
              record_type: "procedure",
              record_date: "2019-11-20",
              description: "Appendectomy",
              provider: "Dr. Robert Williams",
              is_active: false,
              is_resolved: true,
              resolution_date: "2019-12-05",
              notes: "Laparoscopic procedure. Recovery without complications.",
              created_at: "2019-11-20T14:15:00Z",
              updated_at: "2019-12-05T09:00:00Z",
            },
            {
              id: "3",
              patient_id: patientId,
              record_type: "immunization",
              record_date: "2022-09-10",
              description: "Influenza Vaccine",
              provider: "London Health Centre",
              is_active: false,
              is_resolved: true,
              resolution_date: "2022-09-10",
              created_at: "2022-09-10T11:45:00Z",
              updated_at: "2022-09-10T11:45:00Z",
            },
            {
              id: "4",
              patient_id: patientId,
              record_type: "allergy",
              record_date: "2018-03-22",
              description: "Penicillin",
              provider: "Dr. Sarah Thompson",
              is_active: true,
              is_resolved: false,
              notes: "Severe rash and difficulty breathing. Avoid all penicillin-based antibiotics.",
              created_at: "2018-03-22T16:20:00Z",
              updated_at: "2018-03-22T16:20:00Z",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching medical history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalHistory()
  }, [patientId])

  const onSubmit = async (values: z.infer<typeof medicalHistoryFormSchema>) => {
    try {
      // In a real implementation, you would send this to your API
      console.log("Submitting medical history:", values)

      // Mock implementation for demo
      const newItem: MedicalHistoryItem = {
        id: `temp-${Date.now()}`,
        patient_id: patientId,
        record_type: values.record_type,
        record_date: values.record_date.toISOString().split("T")[0],
        description: values.description,
        provider: values.provider || "",
        is_active: values.is_active,
        is_resolved: values.is_resolved,
        resolution_date: values.resolution_date ? values.resolution_date.toISOString().split("T")[0] : undefined,
        notes: values.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setMedicalHistory([newItem, ...medicalHistory])
      setIsAddDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error adding medical history:", error)
    }
  }

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "condition":
        return <Stethoscope className="h-4 w-4" />
      case "procedure":
        return <Activity className="h-4 w-4" />
      case "medication":
        return <Pill className="h-4 w-4" />
      case "immunization":
        return <Syringe className="h-4 w-4" />
      case "allergy":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "condition":
        return "bg-blue-100 text-blue-800"
      case "procedure":
        return "bg-purple-100 text-purple-800"
      case "medication":
        return "bg-green-100 text-green-800"
      case "immunization":
        return "bg-teal-100 text-teal-800"
      case "allergy":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredHistory = medicalHistory.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return item.is_active
    if (activeTab === "resolved") return item.is_resolved
    return item.record_type === activeTab
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Patient's medical conditions, procedures, and other health records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
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
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Patient's medical conditions, procedures, and other health records</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Medical History Record</DialogTitle>
              <DialogDescription>
                Add a new medical condition, procedure, or other health record for this patient.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="record_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Record Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a record type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="condition">Medical Condition</SelectItem>
                          <SelectItem value="procedure">Procedure</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="immunization">Immunization</SelectItem>
                          <SelectItem value="allergy">Allergy</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="record_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Type 2 Diabetes, Appendectomy, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., Dr. Smith, London Hospital, etc."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>This condition is currently active</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_resolved"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              // If resolved is checked and there's no resolution date, set it to today
                              if (checked && !form.getValues("resolution_date")) {
                                form.setValue("resolution_date", new Date())
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Resolved</FormLabel>
                          <FormDescription>This condition has been resolved</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("is_resolved") && (
                  <FormField
                    control={form.control}
                    name="resolution_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Resolution Date</FormLabel>
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
                )}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes about this record"
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
                  <Button type="submit">Add Record</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="condition">Conditions</TabsTrigger>
            <TabsTrigger value="procedure">Procedures</TabsTrigger>
            <TabsTrigger value="medication">Medications</TabsTrigger>
            <TabsTrigger value="allergy">Allergies</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Records Found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all"
                    ? "No medical history records have been added for this patient yet."
                    : `No ${activeTab} records found for this patient.`}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex border-b">
                      <div
                        className={`px-4 py-2 flex items-center justify-center ${getRecordTypeColor(item.record_type)}`}
                      >
                        {getRecordTypeIcon(item.record_type)}
                      </div>
                      <CardHeader className="py-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{item.description}</CardTitle>
                            <Badge variant="outline" className={getRecordTypeColor(item.record_type)}>
                              {item.record_type.charAt(0).toUpperCase() + item.record_type.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.is_active && <Badge variant="default">Active</Badge>}
                            {item.is_resolved && (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Resolved
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription>
                          Recorded on {format(parseISO(item.record_date), "PPP")}
                          {item.provider && ` by ${item.provider}`}
                          {item.is_resolved &&
                            item.resolution_date &&
                            ` • Resolved on ${format(parseISO(item.resolution_date), "PPP")}`}
                        </CardDescription>
                      </CardHeader>
                    </div>
                    {item.notes && (
                      <CardContent className="pt-4">
                        <p className="text-sm">{item.notes}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
