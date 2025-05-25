"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Clock,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Shield,
  Trash2,
  User,
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { CareProfessional, ProfessionalCredential } from "@/types"

export default function CredentialDetailClient({
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
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch care professional data
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
  }, [careProfessionalId, credentialId])

  // Handle credential deletion
  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/care-professionals/${careProfessionalId}/credentials/${credentialId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete credential: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Credential deleted successfully",
      })

      router.push(`/care-professionals/${careProfessionalId}/credentials`)
    } catch (err) {
      console.error("Error deleting credential:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete credential",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Verification Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const isExpired = credential.expiry_date && new Date(credential.expiry_date) < new Date()
  const isExpiringSoon =
    credential.expiry_date &&
    !isExpired &&
    new Date(credential.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/care-professionals/${careProfessionalId}/credentials`)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Credentials
          </Button>
          <h1 className="text-2xl font-bold">Credential Details</h1>
        </div>
        <div className="flex space-x-2">
          {credential.verification_status === "pending" && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/care-professionals/${careProfessionalId}/credentials/${credentialId}/verify`)
              }
            >
              <Shield className="h-4 w-4 mr-2" />
              Verify
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(`/care-professionals/${careProfessionalId}/credentials/${credentialId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this credential. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{getCredentialTypeLabel(credential.credential_type)}</CardTitle>
              <CardDescription>Credential for {fullName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Credential Number</h3>
                  <p className="text-lg font-medium">{credential.credential_number}</p>
                </div>

                {credential.issuing_authority && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Issuing Authority</h3>
                    <p className="text-lg">{credential.issuing_authority}</p>
                  </div>
                )}

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
                      {isExpired && (
                        <Badge variant="destructive" className="ml-2">
                          Expired
                        </Badge>
                      )}
                      {isExpiringSoon && (
                        <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800">
                          Expiring Soon
                        </Badge>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Verification Status</h3>
                <div className="flex items-center">
                  {getStatusBadge(credential.verification_status)}

                  {credential.verification_date && (
                    <span className="text-sm text-muted-foreground ml-3">
                      {formatDate(credential.verification_date)}
                    </span>
                  )}
                </div>

                {credential.verification_status === "verified" && credential.verified_by && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Verified by {credential.verifier_name || credential.verified_by}
                  </p>
                )}

                {credential.verification_status === "pending" && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Awaiting verification
                  </p>
                )}
              </div>

              {credential.verification_notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Verification Notes</h3>
                  <p className="text-sm whitespace-pre-line">{credential.verification_notes}</p>
                </div>
              )}

              {credential.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <p className="text-sm whitespace-pre-line">{credential.notes}</p>
                </div>
              )}

              {credential.document_url && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Document</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={credential.document_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Document
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={credential.document_url} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{fullName}</p>
                  <p className="text-sm text-muted-foreground">{careProfessional.role}</p>
                </div>
              </div>

              {careProfessional.specialization && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Specialization</h3>
                  <p>{careProfessional.specialization}</p>
                </div>
              )}

              {careProfessional.qualifications && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Qualifications</h3>
                  <p className="text-sm">{careProfessional.qualifications}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/care-professionals/${careProfessionalId}`)}
              >
                View Professional Profile
              </Button>
            </CardFooter>
          </Card>

          {credential.credential_type === "nmc_pin" && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Verification Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium text-blue-800">NMC Register</h4>
                        <p className="mt-1 text-sm text-blue-700">
                          Verify this NMC PIN on the official Nursing and Midwifery Council register.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <a
                            href="https://www.nmc.org.uk/registration/search-the-register/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit NMC Register
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {credential.credential_type === "dbs_check" && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Verification Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium text-blue-800">DBS Update Service</h4>
                        <p className="mt-1 text-sm text-blue-700">
                          Verify this DBS check using the DBS Update Service if the professional has subscribed.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <a href="https://www.gov.uk/dbs-update-service" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit DBS Update Service
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
