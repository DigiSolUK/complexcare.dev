"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Edit, FileText, MoreHorizontal, Phone, Pill, Plus, Trash2, User } from "lucide-react"
import { PatientForm } from "@/components/patients/patient-form"
import { getPatient, deletePatient } from "@/lib/actions/patient-actions"

export default function ComprehensivePatientDetail({ patientId }: { patientId: string }) {
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchPatient() {
      try {
        setLoading(true)
        setError(null)

        const result = await getPatient(patientId)

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch patient")
        }

        setPatient(result.data)
      } catch (err: any) {
        console.error("Error fetching patient:", err)
        setError(err.message || "Failed to load patient. Please try again later.")
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Failed to load patient. Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  const handleEditSuccess = (updatedPatient: any) => {
    setPatient(updatedPatient)
    setEditDialogOpen(false)
    toast({
      title: "Patient updated",
      description: "Patient information has been updated successfully.",
    })
  }

  const handleDeletePatient = async () => {
    try {
      const result = await deletePatient(patientId)

      if (!result.success) {
        throw new Error(result.error || "Failed to delete patient")
      }

      toast({
        title: "Patient deleted",
        description: "Patient has been deleted successfully.",
      })

      // Navigate back to patients list
      router.push("/patients")
    } catch (err: any) {
      console.error("Error deleting patient:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete patient. Please try again later.",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP")
    } catch (e) {
      return dateString
    }
  }

  if (loading) {
    return <PatientDetailSkeleton />
  }

  if (error || !patient) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load patient information</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error || "Patient not found"}</p>
            <Button className="mt-4" onClick={() => router.push("/patients")}>
              Return to Patients
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Details</h1>
          <p className="text-muted-foreground">View and manage patient information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/patients")}>
            Back to Patients
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Patient
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/patients/${patientId}/appointments`)}>
                <Calendar className="h-4 w-4 mr-2" />
                Manage Appointments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/patients/${patientId}/medications`)}>
                <Pill className="h-4 w-4 mr-2" />
                Manage Medications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Patient
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={patient.avatar_url || "/placeholder.svg"}
                  alt={`${patient.first_name} ${patient.last_name}`}
                />
                <AvatarFallback>{getInitials(patient.first_name, patient.last_name)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">
                {patient.first_name} {patient.last_name}
              </h2>
              {patient.nhs_number && <p className="text-sm text-muted-foreground mb-2">NHS: {patient.nhs_number}</p>}
              <Badge className={getStatusColor(patient.status || "active")}>{patient.status || "Active"}</Badge>

              <Separator className="my-4" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    DOB: {patient.date_of_birth ? formatDate(patient.date_of_birth) : "Not provided"}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Gender: {patient.gender || "Not specified"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Phone: {patient.contact_number || "Not provided"}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("appointments")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointments
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("medications")}>
                  <Pill className="h-4 w-4 mr-2" />
                  Medications
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("notes")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Notes
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("care-plans")}>
                  <Clock className="h-4 w-4 mr-2" />
                  Care Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>Detailed information about the patient</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Personal Information</h3>
                      <div className="mt-2 space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-sm text-muted-foreground">Full Name:</span>
                          <span className="text-sm col-span-2">
                            {patient.first_name} {patient.last_name}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-sm text-muted-foreground">Date of Birth:</span>
                          <span className="text-sm col-span-2">
                            {patient.date_of_birth ? formatDate(patient.date_of_birth) : "Not provided"}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-sm text-muted-foreground">Gender:</span>
                          <span className="text-sm col-span-2">{patient.gender || "Not specified"}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-sm text-muted-foreground">NHS Number:</span>
                          <span className="text-sm col-span-2">{patient.nhs_number || "Not provided"}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <span className="text-sm col-span-2">{patient.status || "Active"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">Contact Information</h3>
                      <div className="mt-2 space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-sm text-muted-foreground">Phone:</span>
                          <span className="text-sm col-span-2">{patient.contact_number || "Not provided"}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm col-span-2">{patient.email || "Not provided"}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-sm text-muted-foreground">Address:</span>
                          <span className="text-sm col-span-2">{patient.address || "Not provided"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium">Medical Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        <span className="text-sm text-muted-foreground">Primary Condition:</span>
                        <span className="text-sm md:col-span-2">
                          {patient.primary_condition || "No condition recorded"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        <span className="text-sm text-muted-foreground">Primary Care Provider:</span>
                        <span className="text-sm md:col-span-2">{patient.primary_care_provider || "Not assigned"}</span>
                      </div>
                    </div>
                  </div>

                  {patient.notes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium">Notes</h3>
                        <p className="mt-2 text-sm">{patient.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent appointments and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No recent activity</h3>
                    <p className="text-muted-foreground mt-1">This patient has no recent activity.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>Manage patient appointments</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Appointment
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No appointments found</h3>
                    <p className="text-muted-foreground mt-1">This patient has no scheduled appointments.</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Medications</CardTitle>
                    <CardDescription>Manage patient medications</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No medications found</h3>
                    <p className="text-muted-foreground mt-1">This patient has no recorded medications.</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Clinical Notes</CardTitle>
                    <CardDescription>Manage patient clinical notes</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No notes found</h3>
                    <p className="text-muted-foreground mt-1">This patient has no clinical notes.</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care-plans">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Care Plans</CardTitle>
                    <CardDescription>Manage patient care plans</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Care Plan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No care plans found</h3>
                    <p className="text-muted-foreground mt-1">This patient has no care plans.</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Care Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Patient Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>Update patient information</DialogDescription>
          </DialogHeader>
          <PatientForm
            initialData={{
              first_name: patient.first_name,
              last_name: patient.last_name,
              date_of_birth: patient.date_of_birth ? new Date(patient.date_of_birth) : undefined,
              gender: patient.gender || "not_specified",
              nhs_number: patient.nhs_number,
              contact_number: patient.contact_number,
              email: patient.email,
              address: patient.address,
              primary_condition: patient.primary_condition,
              primary_care_provider: patient.primary_care_provider,
              status: patient.status || "active",
              notes: patient.notes,
            }}
            onSuccess={handleEditSuccess}
            isEdit={true}
            patientId={patientId}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Patient Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the patient record for{" "}
              <span className="font-semibold">
                {patient.first_name} {patient.last_name}
              </span>
              . This action cannot be undone and will remove all associated data including appointments, medications,
              and notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePatient} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PatientDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Skeleton className="h-[500px] md:col-span-1" />
        <div className="md:col-span-3 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}
