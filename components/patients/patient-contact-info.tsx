"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, User, Edit2 } from "lucide-react"
import type { Patient } from "@/types/patient"

interface PatientContactInfoProps {
  patient: Patient
  onUpdate?: () => void
}

export function PatientContactInfo({ patient, onUpdate }: PatientContactInfoProps) {
  const [isEditing, setIsEditing] = useState(false)

  const emergencyContactInfo = patient.emergency_contact ? JSON.parse(patient.emergency_contact) : null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Primary and emergency contact details</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{patient.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{patient.email || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{patient.address || "Not provided"}</p>
            </div>
          </div>
        </div>

        {emergencyContactInfo && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Emergency Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{emergencyContactInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{emergencyContactInfo.relationship}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{emergencyContactInfo.phone}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
