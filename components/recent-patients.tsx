"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { type Patient, getPatients } from "@/lib/services/patient-service"

interface RecentPatientsProps {
  tenantId?: string
}

export function RecentPatients({ tenantId }: RecentPatientsProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPatients() {
      if (!tenantId) {
        setLoading(false)
        setError("Tenant ID is missing. Cannot load patients.")
        setPatients([]) // Clear any previous data
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getPatients(tenantId)
        setPatients(data)
      } catch (err) {
        console.error("Error loading patients:", err)
        setError("Failed to load patients. Please try again.")
        setPatients([]) // Clear data on error
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [tenantId])

  if (loading) {
    return <div className="flex justify-center p-4 text-muted-foreground">Loading patients...</div>
  }

  if (error) {
    return <div className="flex justify-center p-4 text-destructive">{error}</div>
  }

  if (patients.length === 0) {
    return (
      <div className="flex justify-center p-4 text-muted-foreground">No recent patients found for this tenant.</div>
    )
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient.id} className="flex items-center gap-4 rounded-lg border p-3 transition-all hover:bg-accent">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {`${patient.first_name.charAt(0)}${patient.last_name.charAt(0)}`}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="font-medium leading-none">{`${patient.first_name} ${patient.last_name}`}</p>
            <p className="text-sm text-muted-foreground">{patient.email}</p>
          </div>
          <Badge
            variant="outline"
            className={`
              ${patient.status === "active" ? "border-green-500 bg-green-50 text-green-700" : ""}
              ${patient.status === "inactive" ? "border-gray-500 bg-gray-50 text-gray-700" : ""}
              ${patient.status === "pending" ? "border-yellow-500 bg-yellow-50 text-yellow-700" : ""}
            `}
          >
            {patient.status}
          </Badge>
          <div className="text-xs text-muted-foreground">{new Date(patient.updated_at).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  )
}
