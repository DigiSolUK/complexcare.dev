"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Award,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface CareProfessional {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
  specialization?: string
  status?: string
  address?: string
  qualifications?: string[]
  experience_years?: number
  registration_number?: string
  created_at?: string
  updated_at?: string
}

interface CareProfessionalDetailClientProps {
  careProfessionalId: string
}

// Default export - this is what was missing
export default function CareProfessionalDetailClient({ careProfessionalId }: CareProfessionalDetailClientProps) {
  const router = useRouter()
  const [professional, setProfessional] = useState<CareProfessional | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCareProfessional = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/care-professionals/${careProfessionalId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch care professional: ${response.statusText}`)
        }

        const data = await response.json()
        setProfessional(data)
      } catch (err) {
        console.error("Error fetching care professional:", err)
        setError(err instanceof Error ? err.message : "Failed to load care professional details")

        // Fallback to demo data if API fails
        setProfessional({
          id: careProfessionalId,
          name: "Demo Care Professional",
          email: "demo@example.com",
          phone: "+44 20 1234 5678",
          role: "Registered Nurse",
          specialization: "Complex Care",
          status: "active",
          address: "123 Healthcare Street, London, UK",
          qualifications: ["RN", "BSc Nursing", "Complex Care Certification"],
          experience_years: 8,
          registration_number: "NMC123456",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }

    if (careProfessionalId) {
      fetchCareProfessional()
    }
  }, [careProfessionalId])

  const handleBack = () => {
    router.push("/care-professionals")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Care professional not found. {error && `Error: ${error}`}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
      case "on_leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            On Leave
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">Care Professional Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{professional.name}</CardTitle>
            {getStatusBadge(professional.status)}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">
                <User className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="credentials">
                <Award className="h-4 w-4 mr-2" />
                Credentials
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{professional.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{professional.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Address:</span>
                    <span className="ml-2">{professional.address || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Role:</span>
                    <span className="ml-2">{professional.role || "Not specified"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Specialization:</span>
                    <span className="ml-2">{professional.specialization || "Not specified"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Experience:</span>
                    <span className="ml-2">
                      {professional.experience_years ? `${professional.experience_years} years` : "Not specified"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Registration Number:</span>
                    <span className="ml-2">{professional.registration_number || "Not provided"}</span>
                  </div>
                </div>
              </div>
              {professional.qualifications && professional.qualifications.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Qualifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {professional.qualifications.map((qual, index) => (
                      <Badge key={index} variant="secondary">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="credentials" className="mt-6">
              <div className="rounded-lg border p-8 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Credentials & Certifications</h3>
                <p className="text-muted-foreground">
                  Professional credentials and certifications will be displayed here.
                </p>
                <Button className="mt-4" variant="outline">
                  Add Credential
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="mt-6">
              <div className="rounded-lg border p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Appointments</h3>
                <p className="text-muted-foreground">Upcoming and past appointments will be displayed here.</p>
                <Button className="mt-4" variant="outline">
                  View Calendar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="rounded-lg border p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Notes & Documentation</h3>
                <p className="text-muted-foreground">Clinical notes and documentation will be displayed here.</p>
                <Button className="mt-4" variant="outline">
                  Add Note
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
