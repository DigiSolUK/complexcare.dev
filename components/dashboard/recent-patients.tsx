import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO, isToday, isYesterday } from "date-fns"

interface RecentPatientsProps {
  patients: any[] | undefined
  isLoading: boolean
}

export function RecentPatients({ patients, isLoading }: RecentPatientsProps) {
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

  if (!patients || patients.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No recent patients</div>
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
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "stable":
        return "bg-blue-100 text-blue-800"
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
      if (isYesterday(date)) {
        return "Yesterday"
      }
      return format(date, "MMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient.id} className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
            <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium">{patient.name}</p>
              <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>DOB: {formatDate(patient.dateOfBirth)}</span>
              <span>Last seen: {formatDate(patient.lastAppointment)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
