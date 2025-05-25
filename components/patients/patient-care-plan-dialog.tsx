"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, FileText, PlusCircle } from "lucide-react"

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

interface PatientCarePlanDialogProps {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientCarePlanDialog({ patient, open, onOpenChange }: PatientCarePlanDialogProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  // Sample care plan data
  const carePlanData = {
    goals: [
      { id: 1, title: "Reduce blood pressure", status: "in-progress", target: "Below 140/90", dueDate: "2023-08-15" },
      { id: 2, title: "Improve mobility", status: "completed", target: "Walk 30 minutes daily", dueDate: "2023-06-01" },
      { id: 3, title: "Weight management", status: "not-started", target: "Lose 5kg", dueDate: "2023-09-30" },
    ],
    medications: [
      { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", startDate: "2023-01-15" },
      { id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily", startDate: "2022-11-10" },
      { id: 3, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", startDate: "2023-03-22" },
    ],
    appointments: [
      {
        id: 1,
        type: "GP Checkup",
        date: "2023-06-15",
        time: "10:00 AM",
        provider: "Dr. Sarah Johnson",
        location: "Main Clinic",
      },
      {
        id: 2,
        type: "Blood Test",
        date: "2023-06-22",
        time: "9:30 AM",
        provider: "Lab Services",
        location: "Pathology Department",
      },
      {
        id: 3,
        type: "Specialist Consultation",
        date: "2023-07-05",
        time: "2:15 PM",
        provider: "Dr. Michael Chen",
        location: "Cardiology Unit",
      },
    ],
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "not-started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Care Plan for {patient.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="goals">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          <TabsContent value="goals" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Treatment Goals</h3>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </div>
            {carePlanData.goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <Badge className={getGoalStatusColor(goal.status)}>
                      {goal.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {goal.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <CardDescription>Target: {goal.target}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Due by {formatDate(goal.dueDate)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="medications" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Current Medications</h3>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Medication
              </Button>
            </div>
            {carePlanData.medications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{medication.name}</CardTitle>
                  <CardDescription>
                    {medication.dosage} - {medication.frequency}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Started on {formatDate(medication.startDate)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="appointments" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Upcoming Appointments</h3>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </div>
            {carePlanData.appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{appointment.type}</CardTitle>
                  <CardDescription>
                    {appointment.provider} - {appointment.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(appointment.date)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {appointment.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Full Care Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
