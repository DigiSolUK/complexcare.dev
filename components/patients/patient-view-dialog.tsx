"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, FileText, Mail, MapPin, Phone, User } from "lucide-react"

interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  status: string
  primaryCondition: string
  avatar?: string
  nhsNumber?: string
  riskLevel?: string
  lastAppointment?: string
  nextAppointment?: string
}

interface PatientViewDialogProps {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientViewDialog({ patient, open, onOpenChange }: PatientViewDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")

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
      return format(new Date(dateString), "PPP")
    } catch (e) {
      return dateString
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 py-4">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
              <AvatarFallback className="text-2xl">{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <p className="text-muted-foreground">
                {patient.nhsNumber ? `NHS: ${patient.nhsNumber}` : "No NHS number"}
              </p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                {patient.riskLevel && <Badge variant="outline">{patient.riskLevel} Risk</Badge>}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">DOB: {formatDate(patient.dateOfBirth)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Gender: {patient.gender}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Phone: {patient.phone || "Not provided"}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Email: {patient.email || "Not provided"}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <span className="text-sm">Address: {patient.address || "Not provided"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Medical Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <h4 className="text-sm font-medium">Primary Condition</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {patient.primaryCondition || "No condition recorded"}
                        </p>
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <h4 className="text-sm font-medium">Primary Care Provider</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {patient.primaryCareProvider || "Not assigned"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Care Summary</CardTitle>
                    <CardDescription>Recent care activities and upcoming appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patient.lastAppointment && (
                        <div className="flex items-start">
                          <div className="mr-4 mt-0.5">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Last Appointment</h4>
                            <p className="text-sm text-muted-foreground">{patient.lastAppointment}</p>
                          </div>
                        </div>
                      )}

                      {patient.nextAppointment && (
                        <div className="flex items-start">
                          <div className="mr-4 mt-0.5">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Next Appointment</h4>
                            <p className="text-sm text-muted-foreground">{patient.nextAppointment}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start">
                        <div className="mr-4 mt-0.5">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Recent Notes</h4>
                          <p className="text-sm text-muted-foreground">No recent notes available</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>View and manage patient appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium">No appointments found</h3>
                      <p className="text-muted-foreground mt-1">This patient has no scheduled appointments.</p>
                      <Button className="mt-4">Schedule Appointment</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Notes</CardTitle>
                    <CardDescription>View and manage patient notes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium">No notes found</h3>
                      <p className="text-muted-foreground mt-1">This patient has no clinical notes.</p>
                      <Button className="mt-4">Add Note</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
