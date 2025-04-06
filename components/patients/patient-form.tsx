"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Patient } from "@/types/patient"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { AvatarUpload } from "@/components/ui/avatar-upload"

const patientFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  nhsNumber: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  emergencyContact: z.string().optional(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
  // GP Connect fields
  gpName: z.string().optional(),
  gpPractice: z.string().optional(),
  gpAddress: z.string().optional(),
  gpPhoneNumber: z.string().optional(),
  gpEmail: z.string().email().optional().or(z.literal("")),
  lastAppointment: z.date().optional(),
  nextAppointment: z.date().optional(),
  nhsConnectStatus: z.enum(["connected", "pending", "disconnected"]).optional(),
  referralStatus: z.string().optional(),
  avatarUrl: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

interface PatientFormProps {
  patient?: Patient
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function PatientForm({ patient, onSubmit, isLoading = false }: PatientFormProps) {
  const [activeTab, setActiveTab] = useState("personal")

  // Convert string arrays to comma-separated strings for form
  const defaultValues: Partial<PatientFormValues> = {
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth) : undefined,
    nhsNumber: patient?.nhsNumber || "",
    address: patient?.address || "",
    phoneNumber: patient?.phoneNumber || "",
    email: patient?.email || "",
    emergencyContact: patient?.emergencyContact || "",
    medicalConditions: patient?.medicalConditions?.join(", ") || "",
    medications: patient?.medications?.join(", ") || "",
    allergies: patient?.allergies?.join(", ") || "",
    notes: patient?.notes || "",
    // GP Connect fields
    gpName: patient?.gpConnect?.gpName || "",
    gpPractice: patient?.gpConnect?.gpPractice || "",
    gpAddress: patient?.gpConnect?.gpAddress || "",
    gpPhoneNumber: patient?.gpConnect?.gpPhoneNumber || "",
    gpEmail: patient?.gpConnect?.gpEmail || "",
    lastAppointment: patient?.gpConnect?.lastAppointment ? new Date(patient.gpConnect.lastAppointment) : undefined,
    nextAppointment: patient?.gpConnect?.nextAppointment ? new Date(patient.gpConnect.nextAppointment) : undefined,
    nhsConnectStatus: patient?.gpConnect?.nhsConnectStatus || undefined,
    referralStatus: patient?.gpConnect?.referralStatus || "",
    avatarUrl: patient?.avatarUrl || "",
  }

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
  })

  function handleSubmit(data: PatientFormValues) {
    // Convert comma-separated strings back to arrays
    const formattedData = {
      ...data,
      medicalConditions: data.medicalConditions ? data.medicalConditions.split(",").map((item) => item.trim()) : [],
      medications: data.medications ? data.medications.split(",").map((item) => item.trim()) : [],
      allergies: data.allergies ? data.allergies.split(",").map((item) => item.trim()) : [],
      // Format GP Connect data
      gpConnect: {
        gpName: data.gpName,
        gpPractice: data.gpPractice,
        gpAddress: data.gpAddress,
        gpPhoneNumber: data.gpPhoneNumber,
        gpEmail: data.gpEmail,
        lastAppointment: data.lastAppointment ? data.lastAppointment.toISOString() : undefined,
        nextAppointment: data.nextAppointment ? data.nextAppointment.toISOString() : undefined,
        nhsConnectStatus: data.nhsConnectStatus,
        referralStatus: data.referralStatus,
      },
      avatarUrl: data.avatarUrl,
    }

    // Remove the individual GP fields from the top level
    delete formattedData.gpName
    delete formattedData.gpPractice
    delete formattedData.gpAddress
    delete formattedData.gpPhoneNumber
    delete formattedData.gpEmail
    delete formattedData.lastAppointment
    delete formattedData.nextAppointment
    delete formattedData.nhsConnectStatus
    delete formattedData.referralStatus

    onSubmit(formattedData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="medical">Medical Information</TabsTrigger>
            <TabsTrigger value="gp">GP Connect</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="flex justify-center mb-6">
              <AvatarUpload
                name={`${form.watch("firstName")} ${form.watch("lastName")}`}
                avatarUrl={form.watch("avatarUrl")}
                onAvatarChange={(url) => form.setValue("avatarUrl", url)}
              />
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <DatePicker date={field.value} setDate={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nhsNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NHS Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 Main St, London" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+44 123 456 7890" {...field} />
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
                          <Input placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe: +44 987 654 3210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Diabetes, Hypertension, Asthma" {...field} />
                      </FormControl>
                      <FormDescription>Separate multiple conditions with commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medications</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Insulin, Lisinopril, Ventolin" {...field} />
                        </FormControl>
                        <FormDescription>Separate multiple medications with commas.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Penicillin, Peanuts, Latex" {...field} />
                        </FormControl>
                        <FormDescription>Separate multiple allergies with commas.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional medical notes..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gp" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gpName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GP Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gpPractice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Highfield Medical Centre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="gpAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 High Street, London" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="gpPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+44 123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gpEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Email</FormLabel>
                        <FormControl>
                          <Input placeholder="info@highfieldmedical.co.uk" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="lastAppointment"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Last Appointment</FormLabel>
                        <DatePicker date={field.value} setDate={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nextAppointment"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Next Appointment</FormLabel>
                        <DatePicker date={field.value} setDate={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="nhsConnectStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NHS Connect Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="connected">Connected</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="disconnected">Disconnected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referralStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Status</FormLabel>
                        <FormControl>
                          <Input placeholder="Awaiting response" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Patient"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

