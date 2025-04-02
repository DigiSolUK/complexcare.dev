"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NMCPinCheck } from "@/components/care-professionals/nmc-pin-check"
import { DBSCheck } from "@/components/care-professionals/dbs-check"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CareProfessional {
  id: string
  name: string
  role: string
  email: string
  phone: string
  nmcPin?: string
  nmcPinStatus?: "verified" | "unverified" | "expired" | "pending"
  dbsCertificateNumber?: string
  dbsType?: "basic" | "standard" | "enhanced"
  dbsIssueDate?: string
  dbsStatus?: "verified" | "unverified" | "expired" | "pending"
}

export default function CredentialVerificationPage() {
  const params = useParams()
  const id = params.id as string
  const [careProfessional, setCareProfessional] = useState<CareProfessional | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    fetchCareProfessional()
  }, [id])

  const fetchCareProfessional = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockCareProfessional: CareProfessional = {
        id,
        name: "Jane Smith",
        role: "Registered Nurse",
        email: "jane.smith@example.com",
        phone: "07700 900123",
        nmcPin: "AB123456",
        nmcPinStatus: "verified",
        dbsCertificateNumber: "123456789012",
        dbsType: "enhanced",
        dbsIssueDate: "2022-03-20",
        dbsStatus: "verified",
      }

      setCareProfessional(mockCareProfessional)
    } catch (error) {
      console.error("Error fetching care professional:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNMCVerify = (status: "verified" | "unverified" | "expired" | "pending") => {
    if (careProfessional) {
      setCareProfessional({
        ...careProfessional,
        nmcPinStatus: status,
      })
    }
  }

  const handleDBSVerify = (status: "verified" | "unverified" | "expired" | "pending") => {
    if (careProfessional) {
      setCareProfessional({
        ...careProfessional,
        dbsStatus: status,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <p>Loading care professional details...</p>
      </div>
    )
  }

  if (!careProfessional) {
    return (
      <div className="flex justify-center p-8">
        <p>Care professional not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/care-professionals/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Credential Verification</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{careProfessional.name}</CardTitle>
          <CardDescription>{careProfessional.role}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{careProfessional.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{careProfessional.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="nmc">
        <TabsList>
          <TabsTrigger value="nmc">NMC PIN</TabsTrigger>
          <TabsTrigger value="dbs">DBS Certificate</TabsTrigger>
        </TabsList>
        <TabsContent value="nmc">
          <NMCPinCheck
            careProfessionalId={careProfessional.id}
            initialPin={careProfessional.nmcPin || ""}
            initialStatus={careProfessional.nmcPinStatus || "unverified"}
            onVerify={handleNMCVerify}
          />
        </TabsContent>
        <TabsContent value="dbs">
          <DBSCheck
            careProfessionalId={careProfessional.id}
            initialCertificateNumber={careProfessional.dbsCertificateNumber || ""}
            initialType={careProfessional.dbsType || "enhanced"}
            initialIssueDate={careProfessional.dbsIssueDate ? new Date(careProfessional.dbsIssueDate) : undefined}
            initialStatus={careProfessional.dbsStatus || "unverified"}
            onVerify={handleDBSVerify}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

