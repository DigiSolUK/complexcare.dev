"use client"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { UpcomingAppointment } from "@/lib/actions/dashboard-actions"

interface UpcomingAppointmentsProps {
  appointments?: UpcomingAppointment[]
  isLoading?: boolean
}

export function UpcomingAppointments({ appointments, isLoading = false }: UpcomingAppointmentsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        ))}
      </div>
    )
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div>
          <p className="text-sm text-muted-foreground">No upcoming appointments</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const appointmentDate = new Date(appointment.dateTime)
        const formattedTime = appointmentDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        const formattedDate = appointmentDate.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })

        return (
          <Link
            key={appointment.id}
            href={`/appointments/${appointment.id}`}
            className="block rounded-lg p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{appointment.patientName}</h4>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
            <div className="mt-1 flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              <span>{formattedDate}</span>
              <Clock className="ml-3 mr-1 h-3.5 w-3.5" />
              <span>{formattedTime}</span>
              <span className="ml-3">({appointment.duration} min)</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{appointment.type}</p>
          </Link>
        )
      })}
    </div>
  )
}

function AppointmentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return <Badge variant="default">Confirmed</Badge>
    case "pending":
      return <Badge variant="outline">Pending</Badge>
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    default:
      return null
  }
}
