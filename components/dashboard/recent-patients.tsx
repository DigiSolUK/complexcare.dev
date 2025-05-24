"use client"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { RecentPatient } from "@/lib/actions/dashboard-actions"

interface RecentPatientsProps {
  patients?: RecentPatient[]
  isLoading?: boolean
}

export function RecentPatients({ patients, isLoading = false }: RecentPatientsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
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

  if (!patients || patients.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div>
          <p className="text-sm text-muted-foreground">No recent patients found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => {
        // Get initials from patient name
        const initials = patient.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)

        // Format date
        const lastUpdated = new Date(patient.lastUpdated)
        const timeAgo = getTimeAgo(lastUpdated)

        return (
          <Link
            key={patient.id}
            href={`/patients/${patient.id}`}
            className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{patient.name}</p>
                <PatientStatusBadge status={patient.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                Updated {timeAgo} • DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function PatientStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return <Badge variant="default">Active</Badge>
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>
    case "pending":
      return <Badge variant="outline">Pending</Badge>
    case "discharged":
      return <Badge variant="destructive">Discharged</Badge>
    default:
      return null
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
}
