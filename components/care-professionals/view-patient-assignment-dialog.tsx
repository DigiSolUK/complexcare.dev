"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Calendar, Phone, Mail, AlertCircle, Pencil, XCircle } from "lucide-react"
import { EditPatientAssignmentDialog } from "./edit-patient-assignment-dialog"
import { getAssignmentTypes } from "@/lib/services/patient-assignment-service"
import type { PatientAssignment } from "@/lib/services/patient-assignment-service"
import { formatDate } from "@/lib/utils"

interface ViewPatientAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: PatientAssignment
  careProfessionalId: string
  tenantId?: string
  onAssignmentUpdated: (assignment: PatientAssignment) => void
  onAssignmentEnded: (assignmentId: string) => void
}

export function ViewPatientAssignmentDialog({
  open,
  onOpenChange,
  assignment,
  careProfessionalId,
  tenantId,
  onAssignmentUpdated,
  onAssignmentEnded,
}: ViewPatientAssignmentDialogProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [endingAssignment, setEndingAssignment] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignmentTypes = getAssignmentTypes()
  const assignmentTypeLabel =
    assignmentTypes.find((t) => t.value === assignment.assignment_type)?.label || assignment.assignment_type

  const isActive = !assignment.end_date || new Date(assignment.end_date) >= new Date()

  const handleEndAssignment = async () => {
    if (!confirm("Are you sure you want to end this patient assignment?")) {
      return
    }

    setEndingAssignment(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/care-professionals/${careProfessionalId}/patient-assignments/${assignment.id}?endImmediately=true`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      onAssignmentEnded(assignment.id)
      onOpenChange(false)
    } catch (err) {
      console.error("Error ending patient assignment:", err)
      setError("Failed to end the assignment. Please try again.")
    } finally {
      setEndingAssignment(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <span>Patient Assignment</span>
                <Badge className="ml-2" variant={isActive ? "default" : "outline"}>
                  {isActive ? "Active" : "Ended"}
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription>Details of the patient assignment</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={assignment.avatar_url || "/placeholder.svg?height=40&width=40&query=patient"}
                  alt={`${assignment.patient_first_name} ${assignment.patient_last_name}`}
                />
                <AvatarFallback>
                  {assignment.patient_first_name?.[0]}
                  {assignment.patient_last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">
                  {assignment.patient_first_name} {assignment.patient_last_name}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {assignment.date_of_birth && (
                    <>
                      DOB: {formatDate(assignment.date_of_birth)}
                      {assignment.gender && ` • ${assignment.gender}`}
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Assignment Type:</span>
                <Badge variant="outline">{assignmentTypeLabel}</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Duration:</span>
                <span className="text-sm flex items-center">
                  <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(assignment.start_date)}
                  {assignment.end_date ? ` - ${formatDate(assignment.end_date)}` : " - Ongoing"}
                </span>
              </div>

              {assignment.notes && (
                <div className="mt-2">
                  <span className="text-sm font-medium">Notes:</span>
                  <div className="mt-1 text-sm p-3 bg-muted rounded-md">{assignment.notes}</div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Patient Contact Information</h4>
              {assignment.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{assignment.email}</span>
                </div>
              )}
              {assignment.contact_number && (
                <div className="flex items-center text-sm">
                  <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{assignment.contact_number}</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {isActive && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleEndAssignment}
                  disabled={endingAssignment}
                >
                  {endingAssignment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      End Assignment
                    </>
                  )}
                </Button>
                <Button onClick={() => setEditDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <EditPatientAssignmentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        assignment={assignment}
        careProfessionalId={careProfessionalId}
        tenantId={tenantId}
        onAssignmentUpdated={(updatedAssignment) => {
          onAssignmentUpdated(updatedAssignment)
          setEditDialogOpen(false)
        }}
      />
    </>
  )
}
