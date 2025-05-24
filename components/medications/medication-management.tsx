"use client"

import { useState } from "react"
import {
  useTenantData,
  useCreateTenantData,
  useUpdateTenantData,
  useDeleteTenantData,
} from "@/lib/hooks/use-tenant-data"
import { DataTable } from "@/components/data-display/data-table"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationDialog } from "@/components/data-management/delete-confirmation-dialog"
import { StatusBadge } from "@/components/data-display/status-badge"
import { Plus, Eye, FileEdit, MoreHorizontal, Trash2 } from "lucide-react"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MedicationForm } from "@/components/medications/medication-form"

interface MedicationManagementProps {
  patientId?: string
}

export function MedicationManagement({ patientId }: MedicationManagementProps) {
  const [selectedMedication, setSelectedMedication] = useState<any>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // API endpoints based on whether we're viewing all medications or just for a specific patient
  const medicationsEndpoint = patientId ? `/api/patients/${patientId}/medications` : "/api/medications"

  // Fetch medications data
  const { data: medications, isLoading, error, refetch } = useTenantData<any[]>(medicationsEndpoint)

  // Fetch care professionals for the dropdown
  const { data: careProfessionals } = useTenantData<any[]>("/api/care-professionals")

  // CRUD operations
  const { createData, isLoading: isCreating } = useCreateTenantData<any, any>(medicationsEndpoint)
  const { updateData, isLoading: isUpdating } = useUpdateTenantData<any, any>("/api/medications")
  const { deleteData, isLoading: isDeleting } = useDeleteTenantData("/api/medications")

  // Handle create medication
  const handleCreateMedication = async (data: any) => {
    await createData(data)
    setCreateDialogOpen(false)
    refetch()
  }

  // Handle update medication
  const handleUpdateMedication = async (data: any) => {
    if (selectedMedication) {
      await updateData(selectedMedication.id, data)
      setEditDialogOpen(false)
      refetch()
    }
  }

  // Handle delete medication
  const handleDeleteMedication = async () => {
    if (selectedMedication) {
      await deleteData(selectedMedication.id)
      refetch()
    }
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString()
  }

  // Get care professional name by ID
  const getCareProfessionalName = (id: string) => {
    if (!careProfessionals) return id
    const cp = careProfessionals.find((cp) => cp.id === id)
    return cp ? `${cp.first_name} ${cp.last_name}` : id
  }

  // Table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Medication",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "dosage",
      header: "Dosage",
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => formatDate(row.getValue("start_date")),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => formatDate(row.getValue("end_date")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "prescribed_by",
      header: "Prescribed By",
      cell: ({ row }) => {
        const prescribedBy = row.getValue("prescribed_by")
        return prescribedBy ? getCareProfessionalName(prescribedBy) : "-"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const medication = row.original

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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMedication(medication)
                  setEditDialogOpen(true)
                }}
              >
                <FileEdit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSelectedMedication(medication)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // If we're not viewing a specific patient, add a patient column
  if (!patientId) {
    columns.unshift({
      accessorKey: "patient_name",
      header: "Patient",
      cell: ({ row }) => {
        const medication = row.original
        return (
          <div>
            <div className="font-medium">{medication.patient_name}</div>
            <div className="text-xs text-muted-foreground">ID: {medication.patient_id}</div>
          </div>
        )
      },
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Management</CardTitle>
          <CardDescription>Loading medications...</CardDescription>
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
          <CardTitle>Medication Management</CardTitle>
          <CardDescription>Error loading medications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">Error loading medications: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medication Management</CardTitle>
          <CardDescription>
            {patientId ? "Manage medications for this patient" : "Manage all medications in the system"}
          </CardDescription>
        </div>
        {patientId && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={medications || []}
          searchColumn="name"
          searchPlaceholder="Search medications..."
        />

        {/* Create Medication Dialog */}
        {patientId && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>Add a new medication for this patient.</DialogDescription>
              </DialogHeader>
              <MedicationForm
                patientId={patientId}
                onSubmit={handleCreateMedication}
                isSubmitting={isCreating}
                careProfessionals={careProfessionals || []}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Medication Dialog */}
        {selectedMedication && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Medication</DialogTitle>
                <DialogDescription>Update medication details.</DialogDescription>
              </DialogHeader>
              <MedicationForm
                patientId={selectedMedication.patient_id}
                initialData={selectedMedication}
                onSubmit={handleUpdateMedication}
                isSubmitting={isUpdating}
                careProfessionals={careProfessionals || []}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        {selectedMedication && (
          <DeleteConfirmationDialog
            title="Delete Medication"
            description={`Are you sure you want to delete ${selectedMedication.name}? This action cannot be undone.`}
            onConfirm={handleDeleteMedication}
            isDeleting={isDeleting}
            trigger={<span className="hidden" />}
          />
        )}
      </CardContent>
    </Card>
  )
}
