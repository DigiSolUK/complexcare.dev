"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle2, Clock, FileText, Plus, User } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState("current")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Mock data for care plans
  const carePlans = [
    {
      id: "cp-001",
      title: "Diabetes Management Plan",
      status: "active",
      startDate: "2023-01-15",
      endDate: "2023-07-15",
      progress: 65,
      assignedTo: "Dr. Elizabeth Johnson",
      goals: [
        { id: "g-001", title: "Maintain blood glucose levels", status: "in-progress" },
        { id: "g-002", title: "Weekly exercise routine", status: "completed" },
        { id: "g-003", title: "Dietary adjustments", status: "in-progress" },
      ],
    },
  ]

  const completedCarePlans = [
    {
      id: "cp-002",
      title: "Post-Surgery Recovery Plan",
      status: "completed",
      startDate: "2022-08-10",
      endDate: "2022-12-10",
      progress: 100,
      assignedTo: "Dr. Robert Williams",
      goals: [
        { id: "g-004", title: "Physical therapy sessions", status: "completed" },
        { id: "g-005", title: "Pain management", status: "completed" },
        { id: "g-006", title: "Gradual return to activities", status: "completed" },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getGoalStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Care Plans</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
            <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-sm text-muted-foreground">
              {patient.nhsNumber ? `NHS: ${patient.nhsNumber}` : "No NHS number"}
            </p>
          </div>
        </div>

        <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="current">Current Plans</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Care Plan
            </Button>
          </div>

          <TabsContent value="current" className="space-y-4">
            {carePlans.length > 0 ? (
              carePlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.title}</CardTitle>
                        <CardDescription>
                          {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(plan.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>

                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Assigned to: {plan.assignedTo}</span>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-2">Goals</h4>
                        <ul className="space-y-2">
                          {plan.goals.map((goal) => (
                            <li key={goal.id} className="flex items-center gap-2">
                              {getGoalStatusIcon(goal.status)}
                              <span className="text-sm">{goal.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Review
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium">No active care plans</h3>
                  <p className="text-muted-foreground mt-1">This patient has no active care plans.</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Care Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedCarePlans.length > 0 ? (
              completedCarePlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.title}</CardTitle>
                        <CardDescription>
                          {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(plan.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>

                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Assigned to: {plan.assignedTo}</span>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-2">Goals</h4>
                        <ul className="space-y-2">
                          {plan.goals.map((goal) => (
                            <li key={goal.id} className="flex items-center gap-2">
                              {getGoalStatusIcon(goal.status)}
                              <span className="text-sm">{goal.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium">No completed care plans</h3>
                  <p className="text-muted-foreground mt-1">This patient has no completed care plans.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
