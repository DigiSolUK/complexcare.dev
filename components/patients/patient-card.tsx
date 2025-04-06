"use client"

import type { Patient } from "@/types/patient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface PatientCardProps {
  patient: Patient
  onClick?: () => void
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={patient.avatarUrl} alt={`${patient.firstName} ${patient.lastName}`} />
            <AvatarFallback>{getInitials(`${patient.firstName} ${patient.lastName}`)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs">
              <CalendarIcon className="h-3 w-3" />
              <span>DOB: {formatDate(patient.dateOfBirth)}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {patient.nhsNumber && (
            <div>
              <p className="text-xs text-muted-foreground">NHS Number</p>
              <p>{patient.nhsNumber}</p>
            </div>
          )}
          {patient.medicalConditions && patient.medicalConditions.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Conditions</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.medicalConditions.slice(0, 2).map((condition, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {condition}
                  </Badge>
                ))}
                {patient.medicalConditions.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{patient.medicalConditions.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

