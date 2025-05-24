"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, UserPlus, Calendar, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { PatientAssignmentDialog } from "./patient-assignment-dialog"
import { useRouter } from "next/navigation"

interface AssignedPatient {
  id: string
  patient_id: string
  patient_first_name: string
  patient_last_name: string
  patient_date_of_birth: string
  patient_contact_number: string
  patient_avatar_url?: string
  assignment_type: string
  start_date: string
  end_date?: string
  notes?: string
}

interface AssignedPatientsListProps {
  careProfessionalId: string
  careProfessionalName: string
}

export function AssignedPatientsList({ careProfessionalId, careProfessionalName }: AssignedPatientsListProps) {
  const [assignments, setAssignments] = useState<AssignedPatient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchAssignments()
  }, [careProfessionalId])

  const fetchAssignments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/care-professionals/${careProfessionalId}/assignments`)
      if (!response.ok) throw new Error("Failed to fetch assignments")
      const data = await response.json()
      setAssignments(data.data || [])
    } catch (error) {
      console.error("Error fetching assignments:", error)
      toast({
        title: "Error",
        description: "Failed to load assigned patients",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this patient assignment?")) {
      return
    }

    try {
      const response = await fetch(`/api/care-professionals/${careProfessionalId}/assignments/${assignmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove assignment")

      toast({
        title: "Success",
        description: "Patient assignment removed",
      })

      fetchAssignments()
    } catch (error) {
      console.error("Error removing assignment:", error)
      toast({
        title: "Error",
        description: "Failed to remove patient assignment",
        variant: "destructive",
      })
    }
  }

  const getAssignmentTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      primary: "default",
      secondary: "secondary",
      specialist: "outline",
      temporary: "outline",
    }
    return <Badge variant={variants[type] || "default"}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assigned Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assigned Patients ({assignments.length})</CardTitle>
          <Button onClick={() => setShowAssignDialog(true)} size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Assign Patient
          </Button>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No patients assigned to this care professional yet.</p>
              <Button onClick={() => setShowAssignDialog(true)} variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Assign First Patient
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={assignment.patient_avatar_url || "/placeholder.svg"}
                            alt={`${assignment.patient_first_name} ${assignment.patient_last_name}`}
                          />
                          <AvatarFallback>
                            {assignment.patient_first_name[0]}
                            {assignment.patient_last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {assignment.patient_first_name} {assignment.patient_last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Age: {calculateAge(assignment.patient_date_of_birth)} • {assignment.patient_contact_number}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getAssignmentTypeBadge(assignment.assignment_type)}</TableCell>
                    <TableCell>{format(new Date(assignment.start_date), "PP")}</TableCell>
                    <TableCell>
                      {assignment.end_date ? format(new Date(assignment.end_date), "PP") : "Ongoing"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/patients/${assignment.patient_id}`)}>
                            View Patient
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/patients/${assignment.patient_id}/appointments?professional=${careProfessionalId}`,
                              )
                            }
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            View Appointments
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRemoveAssignment(assignment.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Assignment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PatientAssignmentDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        careProfessionalId={careProfessionalId}
        careProfessionalName={careProfessionalName}
        onAssignmentCreated={fetchAssignments}
      />
    </>
  )
}
