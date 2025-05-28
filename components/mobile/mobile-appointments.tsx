"use client"

import { useState } from "react"
import { Clock, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MobileAppointments() {
  const [activeTab, setActiveTab] = useState("today")

  // Sample appointment data
  const appointments = {
    today: [
      { time: "09:00", patient: "John Smith", type: "Check-up", duration: "30 min" },
      { time: "10:30", patient: "Sarah Johnson", type: "Follow-up", duration: "45 min" },
      { time: "13:15", patient: "Michael Brown", type: "Assessment", duration: "60 min" },
    ],
    upcoming: [
      { date: "Tomorrow", time: "11:00", patient: "Emma Wilson", type: "Initial Assessment", duration: "60 min" },
      { date: "Tomorrow", time: "14:30", patient: "David Lee", type: "Follow-up", duration: "30 min" },
      { date: "15 Jun", time: "09:45", patient: "Lisa Taylor", type: "Check-up", duration: "45 min" },
      { date: "16 Jun", time: "13:00", patient: "Robert Miller", type: "Medication Review", duration: "30 min" },
    ],
    past: [
      { date: "Yesterday", time: "10:00", patient: "Jennifer Davis", type: "Follow-up", duration: "30 min" },
      { date: "Yesterday", time: "15:30", patient: "William Johnson", type: "Check-up", duration: "45 min" },
      { date: "12 May", time: "11:15", patient: "Elizabeth Brown", type: "Assessment", duration: "60 min" },
    ],
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today" onClick={() => setActiveTab("today")}>
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" onClick={() => setActiveTab("upcoming")}>
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" onClick={() => setActiveTab("past")}>
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {appointments.today.map((appointment, index) => (
            <AppointmentCard key={index} appointment={appointment} showDate={false} />
          ))}

          {appointments.today.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No appointments scheduled for today</div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {appointments.upcoming.map((appointment, index) => (
            <AppointmentCard key={index} appointment={appointment} showDate={true} />
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {appointments.past.map((appointment, index) => (
            <AppointmentCard key={index} appointment={appointment} showDate={true} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AppointmentCardProps {
  appointment: {
    date?: string
    time: string
    patient: string
    type: string
    duration: string
  }
  showDate: boolean
}

function AppointmentCard({ appointment, showDate }: AppointmentCardProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{appointment.patient}</div>
            <div className="text-sm text-muted-foreground">{appointment.type}</div>

            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{appointment.time}</span>
              <span className="mx-1">•</span>
              <span>{appointment.duration}</span>
            </div>
          </div>

          {showDate && <div className="bg-muted px-2 py-1 rounded text-xs font-medium">{appointment.date}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
