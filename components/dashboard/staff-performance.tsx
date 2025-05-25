"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface StaffMember {
  id: string
  name: string
  role: string
  avatar?: string
  metrics: {
    patientsServed: number
    appointmentsCompleted: number
    tasksCompleted: number
    documentationRate: number
    overallScore: number
  }
}

interface StaffPerformanceProps {
  data?: StaffMember[]
  isLoading?: boolean
}

export function StaffPerformance({ data, isLoading = false }: StaffPerformanceProps) {
  // Default data for when real data isn't available
  const defaultData: StaffMember[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Registered Nurse",
      metrics: {
        patientsServed: 28,
        appointmentsCompleted: 42,
        tasksCompleted: 37,
        documentationRate: 96,
        overallScore: 94,
      },
    },
    {
      id: "2",
      name: "David Chen",
      role: "Care Coordinator",
      metrics: {
        patientsServed: 35,
        appointmentsCompleted: 31,
        tasksCompleted: 45,
        documentationRate: 88,
        overallScore: 89,
      },
    },
    {
      id: "3",
      name: "Emma Wilson",
      role: "Physiotherapist",
      metrics: {
        patientsServed: 22,
        appointmentsCompleted: 26,
        tasksCompleted: 19,
        documentationRate: 92,
        overallScore: 87,
      },
    },
    {
      id: "4",
      name: "Michael Brown",
      role: "Support Worker",
      metrics: {
        patientsServed: 18,
        appointmentsCompleted: 24,
        tasksCompleted: 32,
        documentationRate: 79,
        overallScore: 82,
      },
    },
  ]

  const staffMembers = data || defaultData

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[180px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Performance</CardTitle>
        <CardDescription>Top performing care professionals this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {staffMembers.map((staff) => (
            <div key={staff.id} className="flex items-center gap-4">
              <Avatar>
                {staff.avatar ? <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} /> : null}
                <AvatarFallback>
                  {staff.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{staff.name}</p>
                  <PerformanceBadge score={staff.metrics.overallScore} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {staff.role} • {staff.metrics.patientsServed} patients • {staff.metrics.appointmentsCompleted}{" "}
                  appointments
                </p>
              </div>
            </div>
          ))}
        </div>

        {!data && (
          <Alert variant="outline" className="mt-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>Showing demo data. Connect to staff API for real metrics.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function PerformanceBadge({ score }: { score: number }) {
  if (score >= 90) {
    return <Badge className="bg-green-500">Excellent</Badge>
  } else if (score >= 80) {
    return <Badge className="bg-blue-500">Good</Badge>
  } else if (score >= 70) {
    return <Badge className="bg-amber-500">Average</Badge>
  } else {
    return <Badge className="bg-red-500">Needs Improvement</Badge>
  }
}
