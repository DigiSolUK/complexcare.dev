"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTenantData, useCreateTenantData, useDeleteTenantData } from "@/lib/hooks/use-tenant-data"
import { DataTable } from "@/components/data-display/data-table"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationDialog } from "@/components/data-management/delete-confirmation-dialog"
import { Plus, Eye, FileText, Calendar, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PatientForm } from "@/components/patients/patient-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { z } from "zod"

// Schema for patient creation
const patientSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  date_of_birth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  contact_number: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional(),
  medical_record_number: z.string().optional(),
  primary_care_provider: z.string().optional(),
})

export function PatientManagement() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Fetch patients data
  const { data: patients, isLoading, error, refetch } = useTenantData<any[]>("/api/patients")

  // CRUD operations
  const { createData, isLoading: isCreating } = useCreateTenantData<z.infer<typeof patientSchema>, any>("/api/patients")
  const { deleteData, isLoading: isDeleting } = useDeleteTenantData("/api/patients")

  // Handle create patient
  const handleCreatePatient = async (data: z.infer<typeof patientSchema>) => {
    await createData(data)
    setCreateDialogOpen(false)
    refetch()
  }

  // Handle delete patient
  const handleDeletePatient = async () => {
    if (selectedPatient) {
      await deleteData(selectedPatient.id)
      refetch()
    }
  }

  // Navigate to patient details
  const navigateToPatientDetails = (patientId: string) => {
    router.push(`/patients/${patientId}`)
  }

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Patient",
      cell: ({ row }) => {
        const patient = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={patient.avatar_url || ""} alt={`${patient.first_name} ${patient.last_name}`} />
              <AvatarFallback>{getInitials(patient.first_name, patient.last_name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{`${patient.first_name} ${patient.last_name}`}</div>
              {patient.medical_record_number && (
                <div className="text-xs text-muted-foreground">MRN: {patient.medical_record_number}</div>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "date_of_birth",
      header: "Date of Birth",
      cell: ({ row }) => formatDate(row.getValue("date_of_birth")),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div className="capitalize">{row.getValue("gender")}</div>,
    },
    {
      accessorKey: "contact_number",
      header: "Contact",
      cell: ({ row }) => row.getValue("contact_number") || "-",
    },
    {
      accessorKey: "primary_care_provider",
      header: "Primary Care Provider",
      cell: ({ row }) => row.getValue("primary_care_provider") || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigateToPatientDetails(patient.id)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/care-plans`)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Care Plans</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/appointments`)}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Appointments</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSelectedPatient(patient)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Patient</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>Loading patients...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>Error loading patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">Error loading patients: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>Manage patients in the system</CardDescription>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={patients || []} searchColumn="name" searchPlaceholder="Search patients..." />

        {/* Create Patient Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Patient</DialogTitle>
              <DialogDescription>Add a new patient to the system.</DialogDescription>
            </DialogHeader>
            <PatientForm onSubmit={handleCreatePatient} isSubmitting={isCreating} />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        {selectedPatient && (
          <DeleteConfirmationDialog
            title="Delete Patient"
            description={`Are you sure you want to delete ${selectedPatient.first_name} ${selectedPatient.last_name}? This action cannot be undone and will permanently delete all associated data.`}
            onConfirm={handleDeletePatient}
            isDeleting={isDeleting}
            trigger={<span className="hidden" />}
          />
        )}
      </CardContent>
    </Card>
  )
}
