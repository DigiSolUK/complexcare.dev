"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { DataFetchErrorBoundary } from "@/components/error-boundaries"

// Form schema with validation
const careProfessionalFormSchema = z.object({
  title: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  postcode: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  specialization: z.string().optional(),
  qualifications: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  avatar_url: z.string().optional(),
})

type CareProfessionalFormValues = z.infer<typeof careProfessionalFormSchema>

interface CareProfessionalEditClientProps {
  id: string
}

export default function CareProfessionalEditClient({ id }: CareProfessionalEditClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [careProfessional, setCareProfessional] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize form
  const form = useForm<CareProfessionalFormValues>({
    resolver: zodResolver(careProfessionalFormSchema),
    defaultValues: {
      title: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      postcode: "",
      emergency_contact_name: "",
      emergency_contact_relationship: "",
      emergency_contact_phone: "",
      role: "",
      specialization: "",
      qualifications: "",
      notes: "",
      is_active: true,
      avatar_url: "",
    },
  })

  // Fetch care professional data
  useEffect(() => {
    const fetchCareProfessional = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/care-professionals/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch care professional data")
        }

        const data = await response.json()
        setCareProfessional(data)

        // Set form values
        form.reset({
          title: data.title || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          postcode: data.postcode || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_relationship: data.emergency_contact_relationship || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
          role: data.role || "",
          specialization: data.specialization || "",
          qualifications: data.qualifications || "",
          notes: data.notes || "",
          is_active: data.is_active !== undefined ? data.is_active : true,
          avatar_url: data.avatar_url || "",
        })
      } catch (err: any) {
        console.error("Error fetching care professional:", err)
        setError(err.message || "Failed to load care professional data")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load care professional data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareProfessional()
  }, [id, form])

  // Handle form submission
  const onSubmit = async (values: CareProfessionalFormValues) => {
    try {
      setIsSaving(true)

      const response = await fetch(`/api/care-professionals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update care professional")
      }

      toast({
        title: "Success",
        description: "Care professional updated successfully",
      })

      // Navigate back to the care professional details page
      router.push(`/care-professionals/${id}`)
      router.refresh()
    } catch (err: any) {
      console.error("Error updating care professional:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update care professional",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = (url: string) => {
    form.setValue("avatar_url", url)
  }

  // Handle cancel button
  const handleCancel = () => {
    router.back()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <DataFetchErrorBoundary error={error} resetAction={() => router.refresh()} backAction={() => router.back()} />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Care Professional</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Edit the personal details of the care professional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Avatar upload */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <FileUpload
                            onUploadComplete={handleAvatarUpload}
                            defaultValue={field.value}
                            folder="care-professionals"
                            label="Profile Picture"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Miss">Miss</SelectItem>
                          <SelectItem value="Ms">Ms</SelectItem>
                          <SelectItem value="Dr">Dr</SelectItem>
                          <SelectItem value="Prof">Prof</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* First Name */}
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Postcode */}
                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Emergency Contact Name */}
                <FormField
                  control={form.control}
                  name="emergency_contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Emergency Contact Relationship */}
                <FormField
                  control={form.control}
                  name="emergency_contact_relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter relationship" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Emergency Contact Phone */}
                <FormField
                  control={form.control}
                  name="emergency_contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Edit the professional details and qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Role */}
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
                          <SelectItem value="Nurse">Nurse</SelectItem>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                          <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                          <SelectItem value="Occupational Therapist">Occupational Therapist</SelectItem>
                          <SelectItem value="Care Assistant">Care Assistant</SelectItem>
                          <SelectItem value="Social Worker">Social Worker</SelectItem>
                          <SelectItem value="Dietitian">Dietitian</SelectItem>
                          <SelectItem value="Speech Therapist">Speech Therapist</SelectItem>
                          <SelectItem value="Psychologist">Psychologist</SelectItem>
                          <SelectItem value="Administrator">Administrator</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Specialization */}
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter specialization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Qualifications */}
                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Qualifications</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter qualifications" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter additional notes" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Active Status */}
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>Mark this care professional as active or inactive</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
