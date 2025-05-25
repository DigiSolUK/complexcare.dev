"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarDays, Edit, MoreHorizontal, Printer, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditPatientDialog } from "./edit-patient-dialog"

interface PatientHeaderProps {
  patient: any
  onPatientUpdated?: (updatedPatient: any) => void
}

export function PatientHeader({ patient, onPatientUpdated }: PatientHeaderProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Get patient initials for avatar fallback
  const getInitials = () => {
    if (!patient) return "P"
    return `${patient.first_name?.[0] || ""}${patient.last_name?.[0] || ""}`.toUpperCase() || "P"
  }

  // Get status badge variant based on patient status
  const getStatusVariant = () => {
    switch (patient.status?.toUpperCase()) {
      case "ACTIVE":
        return "success"
      case "INACTIVE":
        return "secondary"
      case "DISCHARGED":
        return "warning"
      case "DECEASED":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Format date of birth
  const formatDOB = () => {
    if (!patient.date_of_birth) return "Unknown"
    try {
      return format(new Date(patient.date_of_birth), "dd MMM yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Calculate age from date of birth
  const calculateAge = () => {
    if (!patient.date_of_birth) return ""
    try {
      const dob = new Date(patient.date_of_birth)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }
      return ` (${age} years)`
    } catch (error) {
      return ""
    }
  }

  const handlePatientUpdated = (updatedPatient: any) => {
    if (onPatientUpdated) {
      onPatientUpdated(updatedPatient)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={patient.avatar_url || "/placeholder.svg"}
                alt={`${patient.first_name} ${patient.last_name}`}
              />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-2xl font-bold">
                  {patient.first_name} {patient.last_name}
                </h2>
                <Badge variant={getStatusVariant() as any} className="w-fit">
                  {patient.status || "Unknown"}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  <span>
                    {formatDOB()}
                    {calculateAge()}
                  </span>
                </div>
                {patient.nhs_number && (
                  <div>
                    <span className="font-medium">NHS:</span> {patient.nhs_number}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 self-end md:self-center">
              <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Record
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Record
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Record
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditPatientDialog
        patient={patient}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onPatientUpdated={handlePatientUpdated}
      />
    </>
  )
}

export default PatientHeader
