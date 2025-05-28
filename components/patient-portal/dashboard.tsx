"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Pill, Activity, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export function PatientPortalDashboard() {
  // Mock data - in production, this would come from API
  const upcomingAppointments = [
    {
      id: "1",
      date: new Date(Date.now() + 86400000 * 3),
      time: "10:00 AM",
      doctor: "Dr. Sarah Johnson",
      type: "Follow-up",
      location: "Main Clinic",
    },
    {
      id: "2",
      date: new Date(Date.now() + 86400000 * 10),
      time: "2:30 PM",
      doctor: "Dr. Michael Chen",
      type: "Annual Physical",
      location: "Health Center",
    },
  ]

  const medications = [
    { id: "1", name: "Metformin", dosage: "500mg", frequency: "Twice daily", refills: 2 },
    { id: "2", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", refills: 1 },
  ]

  const recentMessages = [
    {
      id: "1",
      from: "Dr. Sarah Johnson",
      subject: "Lab Results Available",
      date: new Date(Date.now() - 86400000),
      unread: true,
    },
    {
      id: "2",
      from: "Nurse Practitioner",
      subject: "Appointment Reminder",
      date: new Date(Date.now() - 86400000 * 2),
      unread: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-muted-foreground">Here's an overview of your health information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 days</div>
            <p className="text-xs text-muted-foreground">
              {format(upcomingAppointments[0].date, "MMM d")} at {upcomingAppointments[0].time}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <p className="text-xs text-muted-foreground">
              {medications.filter((m) => m.refills > 0).length} need refills soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentMessages.filter((m) => m.unread).length}</div>
            <p className="text-xs text-muted-foreground">From your care team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Based on recent vitals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled visits</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/portal/appointments">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor} • {appointment.location}
                      </p>
                      <p className="text-sm">
                        {format(appointment.date, "EEEE, MMMM d")} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Manage</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>From your care team</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/portal/messages">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{message.from}</p>
                    {message.unread && <Badge className="h-2 w-2 p-0 rounded-full" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{message.subject}</p>
                  <p className="text-xs text-muted-foreground">{format(message.date, "MMM d, h:mm a")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Current Medications</CardTitle>
                <CardDescription>Your active prescriptions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/portal/medications">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {medication.dosage} - {medication.frequency}
                    </p>
                  </div>
                  <Badge variant={medication.refills > 0 ? "default" : "destructive"}>
                    {medication.refills} refills
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Request Refills
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and requests</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/portal/appointments/schedule">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/portal/records/request">
                <FileText className="mr-2 h-4 w-4" />
                Request Medical Records
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/portal/messages/new">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Care Team
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/portal/health/log">
                <Activity className="mr-2 h-4 w-4" />
                Log Health Data
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
