"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, FileText, Plus, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface CareProfessionalCredentialsProps {
  professionalId: string
}

export function CareProfessionalCredentials({ professionalId }: CareProfessionalCredentialsProps) {
  const [credentials, setCredentials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCredentials()
  }, [professionalId])

  const fetchCredentials = async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real app, fetch from API
      // const response = await fetch(`/api/care-professionals/${professionalId}/credentials`)
      // if (!response.ok) throw new Error("Failed to fetch credentials")
      // const data = await response.json()

      // For demo purposes, use mock data
      const demoCredentials = getDemoCredentials(professionalId)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCredentials(demoCredentials)
    } catch (error) {
      console.error("Error fetching credentials:", error)
      setError("Failed to load credentials")
      setCredentials(getDemoCredentials(professionalId)) // Fallback to demo data
    } finally {
      setLoading(false)
    }
  }

  const getDemoCredentials = (id: string) => {
    // Demo credentials based on professional ID
    const baseCredentials = [
      {
        id: `cred-${id}-1`,
        type: "Professional Registration",
        number: "REG12345",
        issuer: "Nursing and Midwifery Council",
        issue_date: "2021-01-15",
        expiry_date: "2024-01-15",
        status: "verified",
        verification_date: "2021-01-20",
        verified_by: "Admin User",
        notes: "Annual renewal required",
      },
      {
        id: `cred-${id}-2`,
        type: "DBS Check",
        number: "DBS789012",
        issuer: "Disclosure and Barring Service",
        issue_date: "2022-03-10",
        expiry_date: "2025-03-10",
        status: "verified",
        verification_date: "2022-03-15",
        verified_by: "Admin User",
        notes: "Enhanced check completed",
      },
      {
        id: `cred-${id}-3`,
        type: "Mandatory Training",
        number: "MT456789",
        issuer: "Healthcare Training Ltd",
        issue_date: "2023-02-05",
        expiry_date: "2024-02-05",
        status: "pending",
        verification_date: null,
        verified_by: null,
        notes: "Awaiting certificate verification",
      },
    ]

    // Customize based on professional ID to make it look more realistic
    if (id === "cp-001") {
      baseCredentials[0].type = "Nursing Registration"
      baseCredentials[0].number = "RN123456"
    } else if (id === "cp-002") {
      baseCredentials[0].type = "HCPC Registration"
      baseCredentials[0].number = "PH789012"
      baseCredentials[0].issuer = "Health and Care Professions Council"
    } else if (id === "cp-003") {
      baseCredentials[0].type = "HCPC Registration"
      baseCredentials[0].number = "OT345678"
      baseCredentials[0].issuer = "Health and Care Professions Council"
    }

    return baseCredentials
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Professional Credentials</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchCredentials}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Credential
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {credentials.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Credentials Found</h3>
              <p className="text-muted-foreground mb-4">This professional has no credentials recorded in the system.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Credential
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Credential Records</CardTitle>
            <CardDescription>Manage and verify professional credentials and certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell className="font-medium">{credential.type}</TableCell>
                    <TableCell>{credential.number}</TableCell>
                    <TableCell>{credential.issuer}</TableCell>
                    <TableCell>{credential.expiry_date}</TableCell>
                    <TableCell>{getStatusBadge(credential.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

