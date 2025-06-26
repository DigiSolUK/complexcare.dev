"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPatients } from "@/lib/services/patient-service"
import { useTenant } from "@/lib/tenant-context"
import type { Patient } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentPatients() {
  const { currentTenant, isLoading: isTenantLoading, error: tenantError } = useTenant()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      if (isTenantLoading) {
        // Still waiting for tenant info
        return
      }

      if (tenantError) {
        setError(tenantError)
        setLoading(false)
        return
      }

      if (!currentTenant?.id) {
        setError("Tenant ID is not available.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Fetching all patients for the tenant, then slicing to 5 for "recent" display
        const fetchedPatients = await getPatients(currentTenant.id)
        setPatients(fetchedPatients.slice(0, 5))
      } catch (err) {
        console.error("Failed to fetch recent patients:", err)
        setError("Failed to load recent patients.")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [currentTenant, isTenantLoading, tenantError])

  if (loading || isTenantLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="grid gap-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (patients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No recent patients found for this tenant.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {patients.map((patient) => (
          <div key={patient.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={`/placeholder.svg?text=${patient.first_name[0]}${patient.last_name[0]}`} alt="Avatar" />
              <AvatarFallback>
                {patient.first_name[0]}
                {patient.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {patient.first_name} {patient.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
            <div className="ml-auto font-medium">{patient.medical_record_number || patient.contact_number}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
