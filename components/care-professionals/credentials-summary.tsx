"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck } from "lucide-react"

interface ExpiringCredential {
  id: string
  name: string
  role: string
  credentialType: string
  expiryDate: string
  daysRemaining: number
}

export function CredentialsSummary() {
  const [credentials, setCredentials] = useState<ExpiringCredential[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExpiringCredentials = async () => {
      try {
        setLoading(true)

        // Demo data
        setCredentials([
          {
            id: "cp-001",
            name: "Sarah Johnson",
            role: "Registered Nurse",
            credentialType: "Nursing Registration",
            expiryDate: "2023-05-15",
            daysRemaining: 15,
          },
          {
            id: "cp-003",
            name: "Emily Brown",
            role: "Occupational Therapist",
            credentialType: "HCPC Registration",
            expiryDate: "2023-05-25",
            daysRemaining: 25,
          },
        ])
      } catch (error) {
        console.error("Error fetching expiring credentials:", error)
        // Fallback demo data
        setCredentials([
          {
            id: "cp-001",
            name: "Sarah Johnson",
            role: "Registered Nurse",
            credentialType: "Nursing Registration",
            expiryDate: "2023-05-15",
            daysRemaining: 15,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchExpiringCredentials()
  }, [])

  const getBadgeVariant = (days: number) => {
    if (days <= 7) return "destructive"
    if (days <= 14) return "warning"
    return "outline"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base font-medium">
          <FileCheck className="h-4 w-4 mr-2" />
          Expiring Credentials
        </CardTitle>
        <CardDescription>Credentials expiring in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : credentials.length > 0 ? (
          <div className="space-y-4">
            {credentials.map((credential) => (
              <div key={`${credential.id}-${credential.credentialType}`} className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{credential.name}</span>
                  <Badge variant={getBadgeVariant(credential.daysRemaining)}>
                    {credential.daysRemaining} days left
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{credential.credentialType}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No expiring credentials</p>
        )}
      </CardContent>
    </Card>
  )
}
