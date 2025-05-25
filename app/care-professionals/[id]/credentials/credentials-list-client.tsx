"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Award, ChevronLeft, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CredentialList } from "@/components/credentials/credential-list"
import { CredentialStats } from "@/components/credentials/credential-stats"
import { CredentialExpiryList } from "@/components/credentials/credential-expiry-list"
import type { CareProfessional, ProfessionalCredential } from "@/types"

export default function CredentialsListClient({ careProfessionalId }: { careProfessionalId: string }) {
  const router = useRouter()
  const [careProfessional, setCareProfessional] = useState<CareProfessional | null>(null)
  const [credentials, setCredentials] = useState<ProfessionalCredential[]>([])
  const [filteredCredentials, setFilteredCredentials] = useState<ProfessionalCredential[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch care professional data
  useEffect(() => {
    async function fetchCareProfessional() {
      try {
        const response = await fetch(`/api/care-professionals/${careProfessionalId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch care professional: ${response.status}`)
        }
        const data = await response.json()
        setCareProfessional(data)
      } catch (err) {
        console.error("Error fetching care professional:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch care professional")
        toast({
          title: "Error",
          description: "Failed to fetch care professional details",
          variant: "destructive",
        })
      }
    }

    fetchCareProfessional()
  }, [careProfessionalId])

  // Fetch credentials
  useEffect(() => {
    async function fetchCredentials() {
      try {
        setLoading(true)
        const response = await fetch(`/api/care-professionals/${careProfessionalId}/credentials`)
        if (!response.ok) {
          throw new Error(`Failed to fetch credentials: ${response.status}`)
        }
        const data = await response.json()
        setCredentials(data)
        setFilteredCredentials(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching credentials:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch credentials")
        toast({
          title: "Error",
          description: "Failed to load credentials",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCredentials()
  }, [careProfessionalId])

  // Filter credentials based on search query and active filter
  useEffect(() => {
    let filtered = credentials

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((credential) => credential.verification_status === activeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (credential) =>
          credential.credential_type.toLowerCase().includes(query) ||
          credential.credential_number.toLowerCase().includes(query) ||
          (credential.issuing_authority && credential.issuing_authority.toLowerCase().includes(query)),
      )
    }

    setFilteredCredentials(filtered)
  }, [credentials, searchQuery, activeFilter])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setActiveFilter(value)
  }

  // Calculate credential statistics
  const getCredentialStats = () => {
    const total = credentials.length
    const verified = credentials.filter((c) => c.verification_status === "verified").length
    const pending = credentials.filter((c) => c.verification_status === "pending").length
    const rejected = credentials.filter((c) => c.verification_status === "rejected").length
    const expired = credentials.filter((c) => {
      if (!c.expiry_date) return false
      return new Date(c.expiry_date) < new Date()
    }).length

    return { total, verified, pending, rejected, expired }
  }

  // Get credentials expiring soon (next 90 days)
  const getExpiringCredentials = () => {
    const today = new Date()
    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(today.getDate() + 90)

    return credentials.filter((c) => {
      if (!c.expiry_date) return false
      const expiryDate = new Date(c.expiry_date)
      return expiryDate > today && expiryDate <= ninetyDaysFromNow
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (error && !careProfessional) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/care-professionals")}>Back to Care Professionals</Button>
        </div>
      </div>
    )
  }

  const fullName = careProfessional
    ? `${careProfessional.title ? careProfessional.title + " " : ""}${careProfessional.first_name} ${
        careProfessional.last_name
      }`
    : "Care Professional"

  const stats = getCredentialStats()
  const expiringCredentials = getExpiringCredentials()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.push(`/care-professionals/${careProfessionalId}`)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Credentials for {fullName}</h1>
        </div>
        <Button onClick={() => router.push(`/care-professionals/${careProfessionalId}/credentials/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Credential
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Credential Stats</CardTitle>
              <CardDescription>Overview of credential status</CardDescription>
            </CardHeader>
            <CardContent>
              <CredentialStats stats={stats} />

              {expiringCredentials.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Expiring Soon</h3>
                  <CredentialExpiryList credentials={expiringCredentials} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Professional Credentials</CardTitle>
              <CardDescription>Manage and verify professional qualifications and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search credentials..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={handleFilterChange}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {filteredCredentials.length === 0 ? (
                <div className="text-center py-12">
                  {searchQuery || activeFilter !== "all" ? (
                    <>
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No matching credentials found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filter to find what you're looking for
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setActiveFilter("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    </>
                  ) : (
                    <>
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No credentials found</h3>
                      <p className="text-muted-foreground mb-4">
                        This care professional doesn't have any credentials recorded yet
                      </p>
                      <Button onClick={() => router.push(`/care-professionals/${careProfessionalId}/credentials/new`)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Credential
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <CredentialList
                  credentials={filteredCredentials}
                  onView={(id) => router.push(`/care-professionals/${careProfessionalId}/credentials/${id}`)}
                  onVerify={(id) => router.push(`/care-professionals/${careProfessionalId}/credentials/${id}/verify`)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
