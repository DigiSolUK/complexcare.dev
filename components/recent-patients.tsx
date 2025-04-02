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

  useEffect(() => {
    async function loadPatients() {
      if (tenantId) {
        try {
          const data = await getPatients(tenantId, 5)
          setPatients(data)
        } catch (error) {
          console.error("Error loading patients:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Fallback to static data
        setPatients([
          {
            id: "1",
            tenant_id: "",
            first_name: "Emma",
            last_name: "Thompson",
            email: "emma.t@example.com",
            status: "active",
            date_of_birth: "1985-05-15",
            gender: "female",
            contact_number: "07700 900123",
            address: "123 Main St, London",
            medical_record_number: "MRN12345",
            primary_care_provider: "Dr. Smith",
            created_at: "2023-01-15T10:30:00Z",
            updated_at: "2023-05-20T14:45:00Z",
            deleted_at: null,
          },
          {
            id: "2",
            tenant_id: "",
            first_name: "James",
            last_name: "Wilson",
            email: "james.w@example.com",
            status: "active",
            date_of_birth: "1978-08-22",
            gender: "male",
            contact_number: "07700 900456",
            address: "456 High St, Manchester",
            medical_record_number: "MRN67890",
            primary_care_provider: "Dr. Johnson",
            created_at: "2023-02-10T09:15:00Z",
            updated_at: "2023-05-18T11:30:00Z",
            deleted_at: null,
          },
          {
            id: "3",
            tenant_id: "",
            first_name: "Olivia",
            last_name: "Parker",
            email: "olivia.p@example.com",
            status: "inactive",
            date_of_birth: "1992-03-10",
            gender: "female",
            contact_number: "07700 900789",
            address: "789 Park Lane, Birmingham",
            medical_record_number: "MRN24680",
            primary_care_provider: "Dr. Williams",
            created_at: "2023-03-05T14:20:00Z",
            updated_at: "2023-05-15T16:45:00Z",
            deleted_at: null,
          },
          {
            id: "4",
            tenant_id: "",
            first_name: "William",
            last_name: "Davis",
            email: "william.d@example.com",
            status: "pending",
            date_of_birth: "1965-11-28",
            gender: "male",
            contact_number: "07700 900012",
            address: "12 Queen St, Edinburgh",
            medical_record_number: "MRN13579",
            primary_care_provider: "Dr. Brown",
            created_at: "2023-04-12T08:45:00Z",
            updated_at: "2023-05-10T10:15:00Z",
            deleted_at: null,
          },
          {
            id: "5",
            tenant_id: "",
            first_name: "Sophia",
            last_name: "Martinez",
            email: "sophia.m@example.com",
            status: "active",
            date_of_birth: "1988-07-17",
            gender: "female",
            contact_number: "07700 900345",
            address: "34 River Road, Glasgow",
            medical_record_number: "MRN97531",
            primary_care_provider: "Dr. Taylor",
            created_at: "2023-01-20T11:30:00Z",
            updated_at: "2023-05-05T09:30:00Z",
            deleted_at: null,
          },
        ])
        setLoading(false)
      }
    }

    loadPatients()
  }, [tenantId])

  if (loading) {
    return <div className="flex justify-center p-4">Loading patients...</div>
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

