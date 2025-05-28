import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO, isToday, isTomorrow } from "date-fns"

interface UpcomingAppointmentsProps {
  appointments: any[] | undefined
  isLoading: boolean
}

export function UpcomingAppointments({ appointments, isLoading }: UpcomingAppointmentsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!appointments || appointments.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No upcoming appointments</div>
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      if (isToday(date)) {
        return "Today"
      }
      if (isTomorrow(date)) {
        return "Tomorrow"
      }
      return format(date, "MMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patientName} />
            <AvatarFallback>{getInitials(appointment.patientName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium">{appointment.patientName}</p>
              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{appointment.type}</span>
              <span>
                {formatDate(appointment.date)} at {appointment.time}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
