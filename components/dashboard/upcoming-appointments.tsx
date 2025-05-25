"use client"
import { format } from "date-fns"
import { Calendar, Clock, User } from "lucide-react"
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
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
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
        const appointmentDate = new Date(appointment.date)
        const formattedDate = format(appointmentDate, "EEE, MMM d, yyyy")

        return (
          <div key={appointment.id} className="flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-muted">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{appointment.type}</p>
                <AppointmentStatusBadge status={appointment.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{appointment.patientName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
                <Clock className="ml-2 h-3 w-3" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>
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
    default:
      return null
  }
}
