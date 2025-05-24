"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Plus, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAssignmentTypes } from "@/lib/services/patient-assignment-service"
import { AddPatientAssignmentDialog } from "./add-patient-assignment-dialog"
import { ViewPatientAssignmentDialog } from "./view-patient-assignment-dialog"
import type { PatientAssignment } from "@/lib/services/patient-assignment-service"
import { formatDate } from "@/lib/utils"

interface PatientAssignmentListProps {
  careProfessionalId: string
  tenantId?: string
  includeEnded?: boolean
  allowAdd?: boolean
  allowRemove?: boolean
  className?: string
  limit?: number
}

export function PatientAssignmentList({
  careProfessionalId,
  tenantId,
  includeEnded = false,
  allowAdd = true,
  allowRemove = true,
  className = "",
  limit,
}: PatientAssignmentListProps) {
  const [assignments, setAssignments] = useState<PatientAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<PatientAssignment | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const assignmentTypes = getAssignmentTypes()

  // Fetch patient assignments
  const fetchAssignments = async () => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      if (tenantId) queryParams.append("tenantId", tenantId)
      if (includeEnded) queryParams.append("includeEnded", "true")
      if (limit) queryParams.append("limit", limit.toString())

      const response = await fetch(
        `/api/care-professionals/${careProfessionalId}/patient-assignments?${queryParams.toString()}`,
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const { data } = await response.json()
      setAssignments(data || [])
    } catch (err) {
      console.error("Error fetching patient assignments:", err)
      setError("Failed to load patient assignments. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (careProfessionalId) {
      fetchAssignments()
    }
  }, [careProfessionalId, includeEnded, tenantId, limit])

  const handleAddPatient = async (newAssignment: PatientAssignment) => {
    setAssignments((prev) => [newAssignment, ...prev])
  }

  const handleRemovePatient = async (assignmentId: string) => {
    try {
      const response = await fetch(
        `/api/care-professionals/${careProfessionalId}/patient-assignments/${assignmentId}?endImmediately=true`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Remove the assignment from the list or update its end date if includeEnded is true
      if (includeEnded) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === assignmentId ? { ...a, end_date: new Date().toISOString().split("T")[0] } : a)),
        )
      } else {
        setAssignments((prev) => prev.filter((a) => a.id !== assignmentId))
      }
    } catch (err) {
      console.error("Error removing patient assignment:", err)
      // Show error message
    }
  }

  const handleViewAssignment = (assignment: PatientAssignment) => {
    setSelectedAssignment(assignment)
    setViewDialogOpen(true)
  }

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Patient Assignments</CardTitle>
          <CardDescription>Manage patients assigned to this care professional</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchAssignments}>
              Retry
            </Button>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (assignments.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Patient Assignments</CardTitle>
          <CardDescription>Manage patients assigned to this care professional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No patients assigned</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              This care professional doesn't have any patients assigned yet.
            </p>
            {allowAdd && (
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Assign Patient
              </Button>
            )}
          </div>
        </CardContent>
        {allowAdd && (
          <AddPatientAssignmentDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            careProfessionalId={careProfessionalId}
            tenantId={tenantId}
            onAssignmentCreated={handleAddPatient}
          />
        )}
      </Card>
    )
  }

  // Display assignments
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Patient Assignments</CardTitle>
          <CardDescription>
            {assignments.length} patient{assignments.length !== 1 ? "s" : ""} assigned to this care professional
          </CardDescription>
        </div>
        {allowAdd && (
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Patient
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const isActive = !assignment.end_date || new Date(assignment.end_date) >= new Date()
            const assignmentTypeLabel =
              assignmentTypes.find((t) => t.value === assignment.assignment_type)?.label || assignment.assignment_type

            return (
              <div
                key={assignment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleViewAssignment(assignment)}
              >
                <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0">
                  <Avatar className="h-10 w-10">
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
                    <h4 className="text-sm font-medium">
                      {assignment.patient_first_name} {assignment.patient_last_name}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant={isActive ? "default" : "outline"}>{assignmentTypeLabel}</Badge>
                      {!isActive && (
                        <Badge variant="outline" className="text-muted-foreground">
                          Ended
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(assignment.start_date)}
                    {assignment.end_date && ` - ${formatDate(assignment.end_date)}`}
                  </span>
                  {allowRemove && isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm("Are you sure you want to end this patient assignment?")) {
                          handleRemovePatient(assignment.id)
                        }
                      }}
                    >
                      End
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      {assignments.length > 0 && limit && assignments.length >= limit && (
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/care-professionals/${careProfessionalId}/patients`)}
          >
            View All Patients
          </Button>
        </CardFooter>
      )}

      {allowAdd && (
        <AddPatientAssignmentDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          careProfessionalId={careProfessionalId}
          tenantId={tenantId}
          onAssignmentCreated={handleAddPatient}
        />
      )}

      {selectedAssignment && (
        <ViewPatientAssignmentDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          assignment={selectedAssignment}
          careProfessionalId={careProfessionalId}
          tenantId={tenantId}
          onAssignmentUpdated={(updated) => {
            setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
          }}
          onAssignmentEnded={(id) => {
            if (includeEnded) {
              setAssignments((prev) =>
                prev.map((a) => (a.id === id ? { ...a, end_date: new Date().toISOString().split("T")[0] } : a)),
              )
            } else {
              setAssignments((prev) => prev.filter((a) => a.id !== id))
            }
          }}
        />
      )}
    </Card>
  )
}
