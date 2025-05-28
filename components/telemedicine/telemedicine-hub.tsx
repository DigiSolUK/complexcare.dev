"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Plus, User, Video } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VideoConsultation } from "@/components/telemedicine/video-consultation"
import { useToast } from "@/components/ui/use-toast"

export function TelemedicineHub() {
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [pastSessions, setPastSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSession, setActiveSession] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTelemedicineSessions()
  }, [])

  const fetchTelemedicineSessions = async () => {
    try {
      // In a real implementation, this would fetch from the API
      setUpcomingSessions([
        {
          id: "1",
          patientId: "p1",
          patientName: "John Smith",
          careProfessionalId: "cp1",
          careProfessionalName: "Dr. Sarah Johnson",
          scheduledStartTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
          status: "scheduled",
          appointmentType: "Follow-up",
        },
        {
          id: "2",
          patientId: "p2",
          patientName: "Emily Davis",
          careProfessionalId: "cp1",
          careProfessionalName: "Dr. Sarah Johnson",
          scheduledStartTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
          status: "scheduled",
          appointmentType: "Initial Consultation",
        },
      ])

      setPastSessions([
        {
          id: "3",
          patientId: "p3",
          patientName: "Robert Wilson",
          careProfessionalId: "cp1",
          careProfessionalName: "Dr. Sarah Johnson",
          scheduledStartTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          actualStartTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
          durationMinutes: 30,
          status: "completed",
          appointmentType: "Follow-up",
          notes: "Patient reported improvement in symptoms. Medication dosage adjusted.",
        },
        {
          id: "4",
          patientId: "p4",
          patientName: "Jennifer Brown",
          careProfessionalId: "cp1",
          careProfessionalName: "Dr. Sarah Johnson",
          scheduledStartTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          actualStartTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 47 * 60 * 1000),
          durationMinutes: 45,
          status: "completed",
          appointmentType: "Initial Consultation",
          notes: "Comprehensive assessment completed. Care plan established.",
        },
      ])

      setLoading(false)
    } catch (error) {
      console.error("Error fetching telemedicine sessions:", error)
      setLoading(false)
    }
  }

  const startSession = (session: any) => {
    setActiveSession(session)
  }

  const handleEndSession = () => {
    setActiveSession(null)
    toast({
      title: "Session Ended",
      description: "The telemedicine session has been successfully ended.",
    })
  }

  if (activeSession) {
    return (
      <VideoConsultation
        sessionId={activeSession.id}
        patientId={activeSession.patientId}
        careProfessionalId={activeSession.careProfessionalId}
        patientName={activeSession.patientName}
        careProfessionalName={activeSession.careProfessionalName}
        isCareProfessional={true} // In a real app, this would be determined by the user's role
        onEndSession={handleEndSession}
      />
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Telemedicine Hub</h1>
          <p className="text-muted-foreground">Manage and conduct virtual consultations with patients</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Session
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{session.patientName}</CardTitle>
                        <CardDescription>{session.appointmentType}</CardDescription>
                      </div>
                      <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                        {session.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(new Date(session.scheduledStartTime), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(new Date(session.scheduledStartTime), "h:mm a")}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{session.careProfessionalName}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => startSession(session)}
                      disabled={new Date(session.scheduledStartTime).getTime() - Date.now() > 15 * 60 * 1000} // Disable if more than 15 minutes before start
                    >
                      <Video className="h-4 w-4 mr-2" />
                      {new Date(session.scheduledStartTime).getTime() - Date.now() <= 15 * 60 * 1000
                        ? "Join Session"
                        : "Join (Available 15 min before)"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Upcoming Sessions</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any telemedicine sessions scheduled.
                </p>
                <Button>Schedule a Session</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : pastSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{session.patientName}</CardTitle>
                        <CardDescription>{session.appointmentType}</CardDescription>
                      </div>
                      <div className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
                        {session.durationMinutes} min
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(new Date(session.scheduledStartTime), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {format(new Date(session.actualStartTime), "h:mm a")} -{" "}
                          {format(new Date(session.endTime), "h:mm a")}
                        </span>
                      </div>
                      {session.notes && (
                        <div className="mt-2 pt-2 border-t text-sm text-muted-foreground line-clamp-2">
                          {session.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          View Session Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Session Details</DialogTitle>
                          <DialogDescription>
                            {format(new Date(session.scheduledStartTime), "MMMM d, yyyy")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-1">Patient</h4>
                            <p>{session.patientName}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Care Professional</h4>
                            <p>{session.careProfessionalName}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Session Time</h4>
                            <p>
                              {format(new Date(session.actualStartTime), "h:mm a")} -{" "}
                              {format(new Date(session.endTime), "h:mm a")}
                            </p>
                            <p className="text-sm text-muted-foreground">Duration: {session.durationMinutes} minutes</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Session Notes</h4>
                            <p className="text-sm">{session.notes || "No notes recorded"}</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Download Summary</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Video className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Past Sessions</h3>
                <p className="text-muted-foreground text-center">
                  You haven't conducted any telemedicine sessions yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
