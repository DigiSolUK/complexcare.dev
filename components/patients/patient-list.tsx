"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPatients } from "@/lib/actions/patient-actions"
import { AddPatientDialog } from "./add-patient-dialog"
import { PatientTable } from "./patient-table"
import { Skeleton } from "@/components/ui/skeleton"
import { PatientEmptyState } from "./patient-empty-state"
import { toast } from "@/components/ui/use-toast"

export function PatientList() {
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPatients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await getPatients(100, 0)

      if (result.success && result.data) {
        // Ensure result.data is an array
        const patientsArray = Array.isArray(result.data) ? result.data : []

        // Transform the data to match the expected format
        const formattedPatients = patientsArray.map((patient: any) => ({
          id: patient.id,
          name: `${patient.first_name} ${patient.last_name}`,
          dateOfBirth: patient.date_of_birth,
          gender: patient.gender,
          status: patient.status || "active",
          primaryCondition: patient.primary_condition || "",
          nhsNumber: patient.nhs_number || "",
          contactNumber: patient.contact_number || "",
          email: patient.email || "",
          primaryCareProvider: patient.primary_care_provider || "",
        }))

        setPatients(formattedPatients)
      } else {
        setError(result.error || "Failed to load patients")
        toast({
          title: "Error",
          description: result.error || "Failed to load patients",
          variant: "destructive",
        })
        setPatients([])
      }
    } catch (error: any) {
      console.error("Error loading patients:", error)
      setError(error.message || "An unexpected error occurred")
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
      setPatients([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>View and manage your patients</CardDescription>
        </div>
        <AddPatientDialog onPatientAdded={loadPatients} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Error Loading Patients</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={loadPatients}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Try Again
            </button>
          </div>
        ) : patients.length === 0 ? (
          <PatientEmptyState />
        ) : (
          <PatientTable patients={patients} isLoading={isLoading} />
        )}
      </CardContent>
    </Card>
  )
}
