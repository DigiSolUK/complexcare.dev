"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Calendar, CheckCircle, ChevronLeft, ExternalLink, Loader2, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { CareProfessional, ProfessionalCredential } from "@/types"

// Form schema
const verificationFormSchema = z.object({
  status: z.enum(["verified", "rejected"], {
    required_error: "Please select a verification status",
  }),
  notes: z.string().optional(),
})

type VerificationFormValues = z.infer<typeof verificationFormSchema>

export default function VerifyCredentialClient({
  careProfessionalId,
  credentialId,
}: {
  careProfessionalId: string
  credentialId: string
}) {
  const router = useRouter()
  const [careProfessional, setCareProfessional] = useState<CareProfessional | null>(null)
  const [credential, setCredential] = useState<ProfessionalCredential | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      status: "verified",
      notes: "",
    },
  })

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch care professional
        const proResponse = await fetch(`/api/care-professionals/${careProfessionalId}`)
        if (!proResponse.ok) {
          throw new Error(`Failed to fetch care professional: ${proResponse.status}`)
        }
        const proData = await proResponse.json()
        setCareProfessional(proData)

        // Fetch credential
        const credResponse = await fetch(`/api/care-professionals/${careProfessionalId}/credentials/${credentialId}`)
        if (!credResponse.ok) {
          throw new Error(`Failed to fetch credential: ${credResponse.status}`)
        }
        const credData = await credResponse.json()
        setCredential(credData)

        // If credential is already verified, pre-fill form
        if (credData.verification_status !== "pending") {
          form.setValue("status", credData.verification_status)
          if (credData.verification_notes) {
            form.setValue("notes", credData.verification_notes)
          }
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        toast({
          title: "Error",
          description: "Failed to load credential details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [careProfessionalId, credentialId, form])

  // Handle form submission
  async function onSubmit(values: VerificationFormValues) {
    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/care-professionals/${careProfessionalId}/credentials/${credentialId}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: values.status,
          notes: values.notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to verify credential: ${response.status}`)
      }

      toast({
        title: "Success",
        description: `Credential ${values.status === "verified" ? "verified" : "rejected"} successfully`,
      })

      router.push(`/care-professionals/${careProfessionalId}/credentials/${credentialId}`)
    } catch (err) {
      console.error("Error verifying credential:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to verify credential",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const getCredentialTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      nmc_pin: "NMC PIN",
      dbs_check: "DBS Check",
      qualification: "Qualification",
      training: "Training Certificate",
      insurance: "Professional Insurance",
      license: "Professional License",
      certification: "Professional Certification",
      other: "Other Credential",
    }
    return typeMap[type] || type
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (error || !credential || !careProfessional) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Credential</h2>
          <p className="text-gray-600 mb-6">{error || "Credential not found"}</p>
          <Button onClick={() => router.push(`/care-professionals/${careProfessionalId}/credentials`)}>
            Back to Credentials
          </Button>
        </div>
      </div>
    )
  }

  const fullName = `${careProfessional.title ? careProfessional.title + " " : ""}${careProfessional.first_name} ${careProfessional.last_name}`
  const isAlreadyVerified = credential.verification_status !== "pending"

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/care-professionals/${careProfessionalId}/credentials/${credentialId}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Credential
        </Button>
        <h1 className="text-2xl font-bold">Verify Credential</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Credential Verification</CardTitle>
              <CardDescription>Verify the authenticity of this professional credential</CardDescription>
            </CardHeader>
            <CardContent>
              {isAlreadyVerified ? (
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      {credential.verification_status === "verified" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <h3 className="text-lg font-medium">
                        This credential has already been {credential.verification_status}
                      </h3>
                    </div>

                    {credential.verification_date && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Verified on {formatDate(credential.verification_date)}
                        {credential.verifier_name && ` by ${credential.verifier_name}`}
                      </p>
                    )}

                    {credential.verification_notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium">Verification Notes:</h4>
                        <p className="mt-1 text-sm whitespace-pre-line">{credential.verification_notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/care-professionals/${careProfessionalId}/credentials/${credentialId}`)
                      }
                    >
                      Return to Credential
                    </Button>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Verification Status</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="verified" />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Verify - Credential is authentic and valid
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="rejected" />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center">
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Reject - Credential is invalid or cannot be verified
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add any notes about the verification process..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include any details about how the credential was verified or why it was rejected
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <CardFooter className="flex justify-between px-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          router.push(`/care-professionals/${careProfessionalId}/credentials/${credentialId}`)
                        }
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Processing..." : "Submit Verification"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Credential Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Professional</h3>
                <p className="font-medium">{fullName}</p>
                <p className="text-sm text-muted-foreground">{careProfessional.role}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Credential Type</h3>
                <p>
                  <Badge variant="outline">{getCredentialTypeLabel(credential.credential_type)}</Badge>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Credential Number</h3>
                <p className="font-medium">{credential.credential_number}</p>
              </div>

              {credential.issue_date && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Issue Date</h3>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {formatDate(credential.issue_date)}
                  </p>
                </div>
              )}

              {credential.expiry_date && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Expiry Date</h3>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {formatDate(credential.expiry_date)}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <p>
                  <Badge
                    variant={
                      credential.verification_status === "verified"
                        ? "success"
                        : credential.verification_status === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {credential.verification_status.charAt(0).toUpperCase() + credential.verification_status.slice(1)}
                  </Badge>
                </p>
              </div>

              {credential.document_url && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Document</h3>
                  <Button variant="outline" size="sm" className="mt-2 gap-2" asChild>
                    <a href={credential.document_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View Document
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6">
              {credential.credential_type === "nmc_pin" && (
                <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                  <a
                    href="https://www.nmc.org.uk/registration/search-the-register/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Verify on NMC Website
                  </a>
                </Button>
              )}

              {credential.credential_type === "dbs_check" && (
                <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                  <a
                    href="https://www.gov.uk/government/organisations/disclosure-and-barring-service"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Verify on DBS Website
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>

          {credential.credential_type === "nmc_pin" && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">NMC PIN Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Important Information</h4>
                      <p className="mt-1 text-sm text-amber-700">
                        Always verify NMC PINs directly on the NMC website. The PIN should match the professional's name
                        and registration status should be active.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Verification Steps:</h4>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Visit the NMC Register Search</li>
                    <li>Enter the PIN number: {credential.credential_number}</li>
                    <li>
                      Verify the name matches: {careProfessional.first_name} {careProfessional.last_name}
                    </li>
                    <li>Check that the registration is active</li>
                    <li>Verify any restrictions or conditions</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          {credential.credential_type === "dbs_check" && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">DBS Check Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Important Information</h4>
                      <p className="mt-1 text-sm text-amber-700">
                        DBS certificates should be verified using the DBS Update Service. Ensure the certificate is
                        original and check for any disclosed information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Verification Steps:</h4>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Check the certificate is original</li>
                    <li>Verify the certificate number: {credential.credential_number}</li>
                    <li>
                      Confirm the name matches: {careProfessional.first_name} {careProfessional.last_name}
                    </li>
                    <li>Check the issue date: {credential.issue_date ? formatDate(credential.issue_date) : "—"}</li>
                    <li>Review any disclosed information</li>
                    <li>Use the DBS Update Service if available</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
