"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import { type Appointment, getUpcomingAppointments } from "@/lib/services/appointment-service"

interface UpcomingAppointmentsProps {
  tenantId?: string
}

export function UpcomingAppointments({ tenantId }: UpcomingAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAppointments() {
      if (tenantId) {
        try {
          const data = await getUpcomingAppointments(tenantId, 4)
          setAppointments(data)
        } catch (error) {
          console.error("Error loading appointments:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Fallback to static data
        setAppointments([
          {
            id: "1",
            tenant_id: "",
            patient_id: "P001",
            provider_id: "U001",
            patient_name: "Emma Thompson",
            provider_name: "Dr. Sarah Johnson",
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 3600000).toISOString(),
            status: "confirmed",
            type: "check-up",
            notes: "Regular check-up",
            location: "Room 101",
            created_at: "",
            updated_at: "",
            deleted_at: null,
          },
          {
            id: "2",
            tenant_id: "",
            patient_id: "P002",
            provider_id: "U001",
            patient_name: "James Wilson",
            provider_name: "Dr. Sarah Johnson",
            start_time: new Date(Date.now() + 18000000).toISOString(), // 5 hours later
            end_time: new Date(Date.now() + 21600000).toISOString(),
            status: "confirmed",
            type: "follow-up",
            notes: "Follow-up appointment",
            location: "Room 203",
            created_at: "",
            updated_at: "",
            deleted_at: null,
          },
          {
            id: "3",
            tenant_id: "",
            patient_id: "P003",
            provider_id: "U001",
            patient_name: "Olivia Parker",
            provider_name: "Dr. Sarah Johnson",
            start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            end_time: new Date(Date.now() + 90000000).toISOString(),
            status: "confirmed",
            type: "consultation",
            notes: "Initial consultation",
            location: "Room 105",
            created_at: "",
            updated_at: "",
            deleted_at: null,
          },
          {
            id: "4",
            tenant_id: "",
            patient_id: "P004",
            provider_id: "U001",
            patient_name: "William Davis",
            provider_name: "Dr. Sarah Johnson",
            start_time: new Date(Date.now() + 90000000).toISOString(), // Tomorrow
            end_time: new Date(Date.now() + 93600000).toISOString(),
            status: "confirmed",
            type: "emergency",
            notes: "Emergency appointment",
            location: "Room 302",
            created_at: "",
            updated_at: "",
            deleted_at: null,
          },
        ])
        setLoading(false)
      }
    }

    loadAppointments()
  }, [tenantId])

  if (loading) {
    return <div className="flex justify-center p-4">Loading appointments...</div>
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center gap-4 rounded-lg border p-3 transition-all hover:bg-accent"
        >
          <Avatar>
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {appointment.patient_name
                ? appointment.patient_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "PT"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="font-medium leading-none">{appointment.patient_name}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(appointment.start_time).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(appointment.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {appointment.location}
              </div>
            </div>
          </div>
          <Badge
            className={`
              ${appointment.type === "check-up" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
              ${appointment.type === "consultation" ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
              ${appointment.type === "follow-up" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
              ${appointment.type === "emergency" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""}
            `}
          >
            {appointment.type}
          </Badge>
        </div>
      ))}
    </div>
  )
}

