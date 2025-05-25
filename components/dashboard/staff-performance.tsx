"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface StaffPerformanceProps {
  isLoading?: boolean
}

export function StaffPerformance({ isLoading = false }: StaffPerformanceProps) {
  // In a real implementation, this data would come from an API
  const staffData = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      role: "Lead Physician",
      performance: 98,
      patientsServed: 42,
      appointmentsCompleted: 156,
      badge: "Excellence",
      avatar: "/images/avatars/doctor-2.png",
    },
    {
      id: "2",
      name: "Nurse Michael Chen",
      role: "Senior Nurse",
      performance: 95,
      patientsServed: 38,
      appointmentsCompleted: 142,
      badge: "Top Performer",
      avatar: "/images/avatars/nurse-1.png",
    },
    {
      id: "3",
      name: "Emma Wilson",
      role: "Care Coordinator",
      performance: 92,
      patientsServed: 35,
      appointmentsCompleted: 128,
      badge: "Outstanding",
      avatar: "/placeholder.svg?height=40&width=40&query=avatar",
    },
  ]

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
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Performance</CardTitle>
        <CardDescription>Top performing care professionals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {staffData.map((staff) => (
          <div key={staff.id} className="flex items-center space-x-4 rounded-md border p-4">
            <Avatar>
              <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
              <AvatarFallback>
                {staff.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">{staff.name}</p>
              <p className="text-sm text-muted-foreground">{staff.role}</p>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span className="mr-2">{staff.patientsServed} patients</span>
                <span>•</span>
                <span className="ml-2">{staff.appointmentsCompleted} appointments</span>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
              {staff.badge}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
