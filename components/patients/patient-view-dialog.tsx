"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PatientViewDialogProps {
  patient: any
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
              <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{patient.name}</DialogTitle>
              <DialogDescription>
                NHS Number: {patient.nhsNumber} | DOB: {patient.dateOfBirth}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="font-medium">Address</div>
                <div className="text-sm text-muted-foreground">{patient.address}</div>
              </div>
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-sm text-muted-foreground">{patient.phone}</div>
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{patient.email}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="font-medium">Primary Care Provider</div>
                <div className="text-sm text-muted-foreground">{patient.primaryCareProvider}</div>
              </div>
              <div>
                <div className="font-medium">Primary Condition</div>
                <div className="text-sm text-muted-foreground">{patient.primaryCondition}</div>
              </div>
              <div>
                <div className="font-medium">Status</div>
                <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogFooter>
    </Dialog>
  )
}
