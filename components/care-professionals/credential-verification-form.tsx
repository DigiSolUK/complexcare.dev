"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2, CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react"
import type { CareProfessional, ProfessionalCredential } from "@/types"

const formSchema = z.object({
  status: z.enum(["verified", "rejected"]),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CredentialVerificationFormProps {
  professional: CareProfessional
  credential: ProfessionalCredential
}

export function CredentialVerificationForm({ professional, credential }: CredentialVerificationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "verified",
      notes: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/credentials/${credential.id}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to verify credential")

      router.push(`/care-professionals/${professional.id}/credentials`)
      router.refresh()
    } catch (error) {
      console.error("Error verifying credential:", error)
      alert("Failed to verify credential. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCredentialTypeLabel = (type: string) => {
    switch (type) {
      case "nmc_pin":
        return "NMC PIN"
      case "dbs_check":
        return "DBS Check"
      case "qualification":
        return "Qualification"
      case "training":
        return "Training"
      default:
        return "Other"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "verified":
        return "success"
      case "pending":
        return "warning"
      case "expired":
        return "destructive"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const isAlreadyVerified = credential.verification_status !== "pending"

  return (
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
                      Verified on {format(new Date(credential.verification_date), "dd MMMM yyyy")}
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
                    onClick={() => router.push(`/care-professionals/${professional.id}/credentials`)}
                  >
                    Return to Credentials
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Verification Status</h3>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={form.watch("status") === "verified" ? "default" : "outline"}
                          className="flex-1 gap-2"
                          onClick={() => form.setValue("status", "verified")}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Verify
                        </Button>
                        <Button
                          type="button"
                          variant={form.watch("status") === "rejected" ? "destructive" : "outline"}
                          className="flex-1 gap-2"
                          onClick={() => form.setValue("status", "rejected")}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>

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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/care-professionals/${professional.id}/credentials`)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Processing..." : "Submit Verification"}
                    </Button>
                  </div>
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
              <h3 className="text-sm font-medium text-muted-foreground">Professional</h3>
              <p className="mt-1">
                {professional.title ? `${professional.title} ` : ""}
                {professional.first_name} {professional.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{professional.role}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Credential Type</h3>
              <p className="mt-1">
                <Badge variant="outline">{getCredentialTypeLabel(credential.credential_type)}</Badge>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Credential Number</h3>
              <p className="mt-1 font-medium">{credential.credential_number}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Issue Date</h3>
              <p className="mt-1">
                {credential.issue_date ? format(new Date(credential.issue_date), "dd MMMM yyyy") : "—"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
              <p className="mt-1">
                {credential.expiry_date ? format(new Date(credential.expiry_date), "dd MMMM yyyy") : "—"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={getStatusBadgeVariant(credential.verification_status)}>
                  {credential.verification_status.charAt(0).toUpperCase() + credential.verification_status.slice(1)}
                </Badge>
              </p>
            </div>

            {credential.document_url && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Document</h3>
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
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
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
                    Verify the name matches: {professional.first_name} {professional.last_name}
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
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
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
                    Confirm the name matches: {professional.first_name} {professional.last_name}
                  </li>
                  <li>
                    Check the issue date:{" "}
                    {credential.issue_date ? format(new Date(credential.issue_date), "dd MMM yyyy") : "—"}
                  </li>
                  <li>Review any disclosed information</li>
                  <li>Use the DBS Update Service if available</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

