"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import {
  useTenantData,
  useCreateTenantData,
  useUpdateTenantData,
  useDeleteTenantData,
} from "@/lib/hooks/use-tenant-data"
import { DataTable } from "@/components/data-display/data-table"
import { Button } from "@/components/ui/button"
import { CreateFormDialog } from "@/components/data-management/create-form-dialog"
import { EditFormDialog } from "@/components/data-management/edit-form-dialog"
import { DeleteConfirmationDialog } from "@/components/data-management/delete-confirmation-dialog"
import { StatusBadge } from "@/components/data-display/status-badge"
import { Plus, Pencil, Trash2, MoreHorizontal, Users, Settings } from "lucide-react"
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

// Schema for tenant creation and update
const tenantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  domain: z.string().optional(),
  subscription_tier: z.enum(["free", "basic", "professional", "enterprise"]),
  status: z.enum(["active", "inactive", "pending", "suspended"]),
})

export function TenantManagementPanel() {
  const router = useRouter()
  const [selectedTenant, setSelectedTenant] = useState<any>(null)

  // Fetch tenants data
  const { data: tenants, isLoading, error, refetch } = useTenantData<any[]>("/api/admin/tenants")

  // CRUD operations
  const { createData, isLoading: isCreating } = useCreateTenantData<z.infer<typeof tenantSchema>, any>(
    "/api/admin/tenants",
  )
  const { updateData, isLoading: isUpdating } = useUpdateTenantData<z.infer<typeof tenantSchema>, any>(
    "/api/admin/tenants",
  )
  const { deleteData, isLoading: isDeleting } = useDeleteTenantData("/api/admin/tenants")

  // Handle create tenant
  const handleCreateTenant = async (data: z.infer<typeof tenantSchema>) => {
    await createData(data)
    refetch()
  }

  // Handle update tenant
  const handleUpdateTenant = async (data: z.infer<typeof tenantSchema>) => {
    if (selectedTenant) {
      await updateData(selectedTenant.id, data)
      refetch()
    }
  }

  // Handle delete tenant
  const handleDeleteTenant = async () => {
    if (selectedTenant) {
      await deleteData(selectedTenant.id)
      refetch()
    }
  }

  // Navigate to tenant users
  const navigateToTenantUsers = (tenantId: string) => {
    router.push(`/superadmin/tenants/${tenantId}/users`)
  }

  // Navigate to tenant settings
  const navigateToTenantSettings = (tenantId: string) => {
    router.push(`/superadmin/tenants/${tenantId}/settings`)
  }

  // Table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "domain",
      header: "Domain",
      cell: ({ row }) => <div>{row.getValue("domain") || "-"}</div>,
    },
    {
      accessorKey: "subscription_tier",
      header: "Subscription",
      cell: ({ row }) => <div className="capitalize">{row.getValue("subscription_tier")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tenant = row.original

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
              <DropdownMenuItem onClick={() => navigateToTenantUsers(tenant.id)}>
                <Users className="mr-2 h-4 w-4" />
                <span>Manage Users</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateToTenantSettings(tenant.id)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedTenant(tenant)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedTenant(tenant)}
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

  // Form fields for create/edit
  const formFields = [
    {
      name: "name",
      label: "Tenant Name",
      type: "text" as const,
      placeholder: "Enter tenant name",
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text" as const,
      placeholder: "tenant-slug",
      description: "Used in URLs. Only lowercase letters, numbers, and hyphens.",
      required: true,
    },
    {
      name: "domain",
      label: "Domain",
      type: "text" as const,
      placeholder: "example.com",
      description: "Optional custom domain for this tenant",
    },
    {
      name: "subscription_tier",
      label: "Subscription Tier",
      type: "select" as const,
      options: [
        { value: "free", label: "Free" },
        { value: "basic", label: "Basic" },
        { value: "professional", label: "Professional" },
        { value: "enterprise", label: "Enterprise" },
      ],
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
        { value: "suspended", label: "Suspended" },
      ],
      required: true,
    },
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>Manage all tenants in the system</CardDescription>
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
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>Manage all tenants in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">Error loading tenants: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>Manage all tenants in the system</CardDescription>
        </div>
        <CreateFormDialog
          title="Create New Tenant"
          description="Add a new tenant to the system."
          fields={formFields}
          schema={tenantSchema}
          onSubmit={handleCreateTenant}
          isSubmitting={isCreating}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={tenants || []} searchColumn="name" searchPlaceholder="Search tenants..." />

        {selectedTenant && (
          <>
            <EditFormDialog
              title="Edit Tenant"
              description="Update tenant information."
              fields={formFields}
              schema={tenantSchema}
              onSubmit={handleUpdateTenant}
              currentData={selectedTenant}
              isSubmitting={isUpdating}
              trigger={<span className="hidden" />}
            />

            <DeleteConfirmationDialog
              title="Delete Tenant"
              description="Are you sure you want to delete this tenant? This action cannot be undone and will permanently delete all associated data."
              onConfirm={handleDeleteTenant}
              isDeleting={isDeleting}
              trigger={<span className="hidden" />}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
