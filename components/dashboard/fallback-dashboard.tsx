"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  Activity,
  ClipboardList,
  AlertTriangle,
  Clock,
  UserCheck,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function FallbackDashboard() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">248</p>
                  <span className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    4%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Active: 187</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">8</p>
                  <span className="text-xs text-muted-foreground">today</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>This week: 32</span>
                <span>25%</span>
              </div>
              <Progress value={25} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">11</p>
                  <span className="text-xs text-muted-foreground">due today</span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <ClipboardList className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="text-red-600 font-medium">Overdue: 5</span>
                <span>Completion: 78%</span>
              </div>
              <Progress value={78} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Patients</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">12</p>
                  <span className="text-xs text-red-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Attention needed
                  </span>
                </div>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Of total: 248</span>
                <span>5%</span>
              </div>
              <Progress value={5} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Recently updated patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "pat-1",
                  name: "John Smith",
                  status: "Active",
                  lastSeen: "Today",
                },
                {
                  id: "pat-2",
                  name: "Emily Johnson",
                  status: "Critical",
                  lastSeen: "Yesterday",
                },
                {
                  id: "pat-3",
                  name: "Michael Williams",
                  status: "Stable",
                  lastSeen: "2 days ago",
                },
              ].map((patient) => (
                <div key={patient.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{patient.name}</h4>
                      <Badge
                        className={
                          patient.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : patient.status === "Critical"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Last seen: {patient.lastSeen}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/patients")}>
              <Users className="mr-2 h-4 w-4" />
              View All Patients
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Recent system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New patient registered</p>
                  <p className="text-sm text-muted-foreground">Robert Thompson was added to the system</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-100 text-green-800 rounded-full p-2">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Appointment completed</p>
                  <p className="text-sm text-muted-foreground">
                    Dr. Sarah Johnson completed appointment with Emily Johnson
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 text-yellow-800 rounded-full p-2">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Medication alert</p>
                  <p className="text-sm text-muted-foreground">Potential interaction detected for John Smith</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Clock className="mr-2 h-4 w-4" />
              View Activity Log
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
