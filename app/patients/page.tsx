"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Filter, PlusCircle, Search } from "lucide-react"
import { DataErrorBoundary } from "@/components/data-error-boundary"

interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  nhs_number: string
  gender: string
  status: string
  primary_condition: string
  primary_care_provider: string
  avatar_url: string
}

function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/patients")

        if (!response.ok) {
          throw new Error(`Failed to fetch patients: ${response.status}`)
        }

        const data = await response.json()

        // Ensure we have an array of patients
        if (Array.isArray(data)) {
          setPatients(data)
        } else {
          console.error("Unexpected data format:", data)
          throw new Error("Received invalid data format from server")
        }
      } catch (err: any) {
        console.error("Error fetching patients:", err)
        setError(err.message || "Failed to load patients. Please try again later.")
        throw err // This will be caught by the DataErrorBoundary
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [retryCount])

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    return (
      fullName.includes(searchLower) ||
      patient.nhs_number?.includes(searchLower) ||
      patient.primary_condition?.toLowerCase().includes(searchLower) ||
      patient.primary_care_provider?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return <PatientsPageSkeleton />
  }

  return (
    <div className="mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>View and manage all your patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Primary Condition</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={patient.avatar_url || "/placeholder.svg"}
                              alt={`${patient.first_name} ${patient.last_name}`}
                            />
                            <AvatarFallback>{`${patient.first_name.charAt(0)}${patient.last_name.charAt(0)}`}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {patient.first_name} {patient.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">NHS: {patient.nhs_number}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.date_of_birth ? format(new Date(patient.date_of_birth), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                          {patient.status || "active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {patient.primary_condition || "No condition recorded"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/patients/${patient.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            Care Plan
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No patients found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PatientsPageSkeleton() {
  return (
    <div className="mb-6">
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <Skeleton className="h-10 w-full md:w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-48 hidden md:block" />
                <Skeleton className="h-6 w-24" />
              </div>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-t">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-5 w-48 hidden md:block" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PatientsPage() {
  const [retryKey, setRetryKey] = useState(0)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">Manage your patients and their care plans</p>
      </div>

      <DataErrorBoundary key={retryKey} onRetry={() => setRetryKey((prev) => prev + 1)}>
        <PatientsList />
      </DataErrorBoundary>
    </div>
  )
}
