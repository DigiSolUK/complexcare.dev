"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, MessageSquare, Pill, Video, Activity } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface DashboardData {
  upcomingAppointments: any[]
  recentNotes: any[]
  medications: any[]
  unreadMessages: number
}

export function PatientPortalDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    upcomingAppointments: [],
    recentNotes: [],
    medications: [],
    unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // In a real implementation, these would be API calls
      setDashboardData({
        upcomingAppointments: [
          {
            id: "1",
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            time: "10:00 AM",
            provider: "Dr. Sarah Johnson",
            type: "Follow-up",
          },
          {
            id: "2",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            time: "2:30 PM",
            provider: "Dr. Michael Chen",
            type: "Consultation",
          },
        ],
        recentNotes: [
          {
            id: "1",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            type: "Progress Note",
            provider: "Dr. Sarah Johnson",
          },
          {
            id: "2",
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            type: "Lab Results",
            provider: "Lab Department",
          },
        ],
        medications: [
          {
            id: "1",
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            refillsRemaining: 2,
          },
          {
            id: "2",
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            refillsRemaining: 1,
          },
        ],
        unreadMessages: 3,
      })
      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Your Health Portal</h1>
        <p className="text-muted-foreground">Manage your health information and stay connected with your care team</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Link href="/portal/appointments">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Calendar className="h-6 w-6" />
            <span className="text-xs">Book Appointment</span>
          </Button>
        </Link>
        <Link href="/portal/records">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xs">Medical Records</span>
          </Button>
        </Link>
        <Link href="/portal/messages">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 relative">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs">Messages</span>
            {dashboardData.unreadMessages > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {dashboardData.unreadMessages}
              </span>
            )}
          </Button>
        </Link>
        <Link href="/portal/medications">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Pill className="h-6 w-6" />
            <span className="text-xs">Medications</span>
          </Button>
        </Link>
        <Link href="/portal/telemedicine">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Video className="h-6 w-6" />
            <span className="text-xs">Video Visit</span>
          </Button>
        </Link>
        <Link href="/portal/vitals">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Activity className="h-6 w-6" />
            <span className="text-xs">Track Vitals</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Your scheduled visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border-l-4 border-primary pl-4">
                  <p className="font-medium">{appointment.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(appointment.date, "MMM d, yyyy")} at {appointment.time}
                  </p>
                  <p className="text-sm text-muted-foreground">with {appointment.provider}</p>
                </div>
              ))}
              <Link href="/portal/appointments">
                <Button variant="link" className="p-0">
                  View all appointments →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Medical Records
            </CardTitle>
            <CardDescription>Latest updates to your records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentNotes.map((note) => (
                <div key={note.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">{note.type}</p>
                  <p className="text-sm text-muted-foreground">{format(note.date, "MMM d, yyyy")}</p>
                  <p className="text-sm text-muted-foreground">by {note.provider}</p>
                </div>
              ))}
              <Link href="/portal/records">
                <Button variant="link" className="p-0">
                  View all records →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Active Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Active Medications
            </CardTitle>
            <CardDescription>Your current prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.medications.map((medication) => (
                <div key={medication.id} className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">{medication.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {medication.dosage} - {medication.frequency}
                  </p>
                  <p className="text-sm text-muted-foreground">{medication.refillsRemaining} refills remaining</p>
                </div>
              ))}
              <Link href="/portal/medications">
                <Button variant="link" className="p-0">
                  Manage medications →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
