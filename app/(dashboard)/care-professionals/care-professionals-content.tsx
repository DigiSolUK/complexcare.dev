"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CareProfessionalsTable } from "@/components/care-professionals/care-professionals-table"
import { CreateCareProfessionalDialog } from "@/components/care-professionals/create-care-professional-dialog"
import { CareProfessionalStats } from "@/components/care-professionals/care-professional-stats"
import { CredentialsSummary } from "@/components/care-professionals/credentials-summary"
import { PageHeader } from "@/components/page-header"
import { Plus, Search, Filter, Download, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { CareProfessional } from "@/types"

export default function CareProfessionalsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [professionals, setProfessionals] = useState<CareProfessional[]>([]) // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchCareProfessionals()
  }, [searchQuery, activeTab])

  const fetchCareProfessionals = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch care professionals from API
      const response = await fetch(`/api/care-professionals?search=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch care professionals: ${response.status}`)
      }

      const data = await response.json()

      // Ensure data is an array
      const professionalsList = Array.isArray(data) ? data : []

      // Filter based on active tab
      let filteredData = professionalsList
      if (activeTab === "active") {
        filteredData = professionalsList.filter((prof: CareProfessional) => prof.is_active)
      } else if (activeTab === "inactive") {
        filteredData = professionalsList.filter((prof: CareProfessional) => !prof.is_active)
      }

      setProfessionals(filteredData)
    } catch (err) {
      console.error("Error fetching care professionals:", err)
      setError("Failed to load care professionals. Please try again.")
      setProfessionals([]) // Reset to empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    const params = new URLSearchParams(searchParams?.toString())
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    router.push(`/care-professionals?${params.toString()}`)
  }

  const handleCreateSuccess = (newProfessional: CareProfessional) => {
    setProfessionals((prev) => [newProfessional, ...prev])
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Care Professionals"
        description="Manage care professionals in your organization"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Professional
          </Button>
        }
      />

      <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <CardTitle>Care Professionals</CardTitle>
                  <CardDescription>
                    {isLoading ? "Loading care professionals..." : `${professionals.length} care professionals found`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <Input
                      placeholder="Search professionals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[150px] sm:w-[250px]"
                    />
                    <Button type="submit" variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                  <Button variant="outline" size="icon" onClick={fetchCareProfessionals}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="m-0">
                  {error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : professionals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">No care professionals found</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                        Add your first care professional
                      </Button>
                    </div>
                  ) : (
                    <CareProfessionalsTable professionals={professionals} />
                  )}
                </TabsContent>
                <TabsContent value="active" className="m-0">
                  {error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : professionals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">No active care professionals found</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                        Add an active care professional
                      </Button>
                    </div>
                  ) : (
                    <CareProfessionalsTable professionals={professionals} />
                  )}
                </TabsContent>
                <TabsContent value="inactive" className="m-0">
                  {error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : professionals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">No inactive care professionals found</p>
                    </div>
                  ) : (
                    <CareProfessionalsTable professionals={professionals} />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-1/3 space-y-6">
          <CareProfessionalStats />
          <CredentialsSummary />
        </div>
      </div>

      <CreateCareProfessionalDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
