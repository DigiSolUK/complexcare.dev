"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ChevronLeft, Loader2 } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { FileUpload } from "@/components/ui/file-upload"
import { toast } from "@/components/ui/use-toast"
import type { CareProfessional } from "@/types"

// Form schema
const credentialFormSchema = z.object({
  credential_type: z.string({ required_error: "Please select a credential type" }),
  credential_number: z.string().min(1, "Credential number is required"),
  issuing_authority: z.string().optional(),
  issue_date: z.date().optional(),
  expiry_date: z.date().optional(),
  notes: z.string().optional(),
  document_url: z.string().optional(),
})

type CredentialFormValues = z.infer<typeof credentialFormSchema>

const credentialTypes = [
  { value: "nmc_pin", label: "NMC PIN" },
  { value: "dbs_check", label: "DBS Check" },
  { value: "qualification", label: "Qualification" },
  { value: "training", label: "Training Certificate" },
  { value: "insurance", label: "Professional Insurance" },
  { value: "license", label: "Professional License" },
  { value: "certification", label: "Professional Certification" },
  { value: "other", label: "Other" },
]

export default function AddCredentialClient({ careProfessionalId }: { careProfessionalId: string }) {
  const router = useRouter()
  const [careProfessional, setCareProfessional] = useState<CareProfessional | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize form
  const form = useForm<CredentialFormValues>({
    resolver: zodResolver(credentialFormSchema),
    defaultValues: {
      credential_type: "",
      credential_number: "",
      issuing_authority: "",
      notes: "",
      document_url: "",
    },
  })

  // Fetch care professional data
  useEffect(() => {
    async function fetchCareProfessional() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/care-professionals/${careProfessionalId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch care professional: ${response.status}`)
        }
        const data = await response.json()
        setCareProfessional(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching care professional:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch care professional")
        toast({
          title: "Error",
          description: "Failed to fetch care professional details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareProfessional()
  }, [careProfessionalId])

  // Handle form submission
  async function onSubmit(values: CredentialFormValues) {
    try {
      setIsSubmitting(true)

      // Format dates for API
      const formattedValues = {
        ...values,
        issue_date: values.issue_date ? values.issue_date.toISOString().split("T")[0] : undefined,
        expiry_date: values.expiry_date ? values.expiry_date.toISOString().split("T")[0] : undefined,
      }

      const response = await fetch(`/api/care-professionals/${careProfessionalId}/credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to create credential: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Credential added successfully",
      })

      // Redirect to credentials list
      router.push(`/care-professionals/${careProfessionalId}/credentials`)
    } catch (err) {
      console.error("Error creating credential:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create credential",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle file upload
  const handleFileUpload = (url: string) => {
    form.setValue("document_url", url)
  }

  const fullName = careProfessional
    ? `${careProfessional.title ? careProfessional.title + " " : ""}${careProfessional.first_name} ${
        careProfessional.last_name
      }`
    : "Care Professional"

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/care-professionals/${careProfessionalId}/credentials`)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Credentials
        </Button>
        <h1 className="text-2xl font-bold">Add New Credential</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Professional Credential</CardTitle>
          <CardDescription>Add a new credential for {isLoading ? "..." : fullName}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="credential_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select credential type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {credentialTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the type of credential you are adding</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credential_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter credential number" {...field} />
                      </FormControl>
                      <FormDescription>The unique identifier for this credential</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuing_authority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuing Authority</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter issuing authority" {...field} />
                      </FormControl>
                      <FormDescription>The organization that issued this credential</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issue_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Issue Date</FormLabel>
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
                              {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>When this credential was issued</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date</FormLabel>
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
                              {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>When this credential expires (if applicable)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="document_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Upload</FormLabel>
                        <FormControl>
                          <FileUpload
                            endpoint="credentials"
                            value={field.value}
                            onChange={handleFileUpload}
                            accept={{
                              "application/pdf": [".pdf"],
                              "image/jpeg": [".jpg", ".jpeg"],
                              "image/png": [".png"],
                            }}
                            maxSize={5}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload a scan or photo of the credential document (PDF, JPG, PNG, max 5MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes about this credential"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Any additional information about this credential</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <CardFooter className="flex justify-between px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/care-professionals/${careProfessionalId}/credentials`)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Saving..." : "Save Credential"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
