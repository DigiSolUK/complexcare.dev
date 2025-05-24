"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Credential {
  id: string
  care_professional_id: string
  care_professional_name: string
  credential_type: string
  expiry_date: string
  status: string
}

export function CredentialsSummary() {
  const [expiringCredentials, setExpiringCredentials] = useState<Credential[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpiringCredentials = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // In a real app, this would be an API call
        // const response = await fetch("/api/credentials/expiring")
        // const data = await response.json()

        // For demo purposes, we'll use mock data
        const mockData = [
          {
            id: "cred-1",
            care_professional_id: "cp-001",
            care_professional_name: "Sarah Johnson",
            credential_type: "Nursing Registration",
            expiry_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: "expiring-soon",
          },
          {
            id: "cred-2",
            care_professional_id: "cp-002",
            care_professional_name: "James Williams",
            credential_type: "DBS Check",
            expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: "expiring-soon",
          },
          {
            id: "cred-3",
            care_professional_id: "cp-003",
            care_professional_name: "Emily Brown",
            credential_type: "Professional Indemnity Insurance",
            expiry_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "expired",
          },
        ]

        setExpiringCredentials(mockData)
      } catch (err) {
        console.error("Error fetching expiring credentials:", err)
        setError("Failed to load credential information")
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpiringCredentials()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credential Alerts</CardTitle>
        <CardDescription>Expiring and expired credentials</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : expiringCredentials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">No credential alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expiringCredentials.map((credential) => {
              const expiryDate = new Date(credential.expiry_date)
              const isExpired = expiryDate < new Date()

              return (
                <div key={credential.id} className="flex flex-col space-y-2 rounded-md border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{credential.care_professional_name}</h4>
                      <p className="text-sm text-muted-foreground">{credential.credential_type}</p>
                    </div>
                    <Badge variant={isExpired ? "destructive" : "warning"}>
                      {isExpired ? "Expired" : "Expiring Soon"}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {isExpired
                      ? `Expired ${formatDistanceToNow(expiryDate, { addSuffix: true })}`
                      : `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`}
                  </div>
                </div>
              )
            })}

            <Button variant="outline" className="w-full" size="sm">
              View All Credentials
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
