"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Patient } from "@/types"
import { getPatients } from "@/lib/services/patient-service"
import { useTenant } from "@/lib/tenant-context"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentPatients() {
  const { tenantId } = useTenant()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      if (!tenantId) {
        setError("No tenant ID available. Cannot fetch patients.")
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const fetchedPatients = await getPatients(tenantId)
        setPatients(fetchedPatients.slice(0, 5)) // Display up to 5 recent patients
      } catch (err) {
        console.error("Failed to fetch recent patients:", err)
        setError("Failed to load recent patients. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [tenantId])

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
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
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {patients.length === 0 ? (
          <p className="text-muted-foreground">No recent patients found.</p>
        ) : (
          patients.map((patient) => (
            <div key={patient.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage
                  src={`/placeholder.svg?text=${patient.first_name[0]}${patient.last_name[0]}`}
                  alt={`${patient.first_name} ${patient.last_name}`}
                />
                <AvatarFallback>
                  {patient.first_name[0]}
                  {patient.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {patient.first_name} {patient.last_name}
                </p>
                <p className="text-sm text-muted-foreground">NHS: {patient.nhs_number || "N/A"}</p>
              </div>
              <div className="ml-auto font-medium text-sm text-muted-foreground">
                {patient.last_activity_at ? new Date(patient.last_activity_at).toLocaleDateString() : "N/A"}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
