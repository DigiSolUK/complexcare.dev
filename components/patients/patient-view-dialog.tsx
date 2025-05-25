"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Mail, User } from "lucide-react"

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

  const getRiskColor = (risk: string | undefined) => {
    if (!risk) return "bg-gray-100 text-gray-800"

    switch (risk.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Patient Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{patient.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                {patient.riskLevel && (
                  <Badge className={getRiskColor(patient.riskLevel)}>{patient.riskLevel} risk</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">NHS Number:</span>
              <span className="text-sm font-medium">{patient.nhsNumber || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Date of Birth:</span>
              <span className="text-sm font-medium">{formatDate(patient.dateOfBirth)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Gender:</span>
              <span className="text-sm font-medium">{patient.gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Primary Condition:</span>
              <span className="text-sm font-medium">{patient.primaryCondition || "Not specified"}</span>
            </div>
            {patient.lastAppointment && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last Appointment:</span>
                <span className="text-sm font-medium">{formatDate(patient.lastAppointment)}</span>
              </div>
            )}
            {patient.nextAppointment && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Next Appointment:</span>
                <span className="text-sm font-medium">{formatDate(patient.nextAppointment)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>View Full Profile</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
