"use client"

import { useState } from "react"
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
import { Plus, Pencil, Trash2, MoreHorizontal, Mail } from "lucide-react"
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

// Schema for user creation and update
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["admin", "user", "manager", "viewer"]),
  is_primary: z.boolean().optional(),
})

// Schema for user invitation
const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user", "manager", "viewer"]),
})

interface TenantUserManagementProps {
  tenantId: string
}

export function TenantUserManagement({ tenantId }: TenantUserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Fetch tenant users data
  const { data: users, isLoading, error, refetch } = useTenantData<any[]>(`/api/admin/tenants/${tenantId}/users`)

  // Fetch tenant data
  const { data: tenant } = useTenantData<any>(`/api/admin/tenants/${tenantId}`)

  // CRUD operations
  const { createData: inviteUser, isLoading: isInviting } = useCreateTenantData<z.infer<typeof inviteSchema>, any>(
    `/api/admin/tenants/${tenantId}/invitations`,
  )
  const { updateData: updateUserRole, isLoading: isUpdating } = useUpdateTenantData<{ role: string }, any>(
    `/api/admin/tenants/${tenantId}/users`,
  )
  const { deleteData: removeUser, isLoading: isRemoving } = useDeleteTenantData(`/api/admin/tenants/${tenantId}/users`)

  // Handle invite user
  const handleInviteUser = async (data: z.infer<typeof inviteSchema>) => {
    await inviteUser(data)
    refetch()
  }

  // Handle update user role
  const handleUpdateUserRole = async (data: { role: string }) => {
    if (selectedUser) {
      await updateUserRole(selectedUser.user_id, data)
      refetch()
    }
  }

  // Handle remove user
  const handleRemoveUser = async () => {
    if (selectedUser) {
      await removeUser(selectedUser.user_id)
      refetch()
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Table columns
  const columns = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.image || ""} alt={row.getValue("name")} />
            <AvatarFallback>{getInitials(row.getValue("name"))}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground">{row.getValue("email")}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: () => null, // Hidden as it's shown in the user column
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
    },
    {
      accessorKey: "is_primary",
      header: "Primary",
      cell: ({ row }) => (row.getValue("is_primary") ? <StatusBadge status="Primary" variant="success" /> : null),
    },
    {
      accessorKey: "joined_at",
      header: "Joined",
      cell: ({ row }) =>
        row.getValue("joined_at") ? (
          <div>{new Date(row.getValue("joined_at")).toLocaleDateString()}</div>
        ) : (
          <StatusBadge status="Invited" variant="warning" />
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

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
              <DropdownMenuItem onClick={() => setSelectedUser(user)} disabled={user.is_primary}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Change Role</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                <span>Send Message</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSelectedUser(user)}
                className="text-destructive focus:text-destructive"
                disabled={user.is_primary}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Remove User</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Form fields for invite
  const inviteFields = [
    {
      name: "email",
      label: "Email Address",
      type: "email" as const,
      placeholder: "user@example.com",
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "select" as const,
      options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
        { value: "viewer", label: "Viewer" },
      ],
      required: true,
    },
  ]

  // Form fields for role update
  const roleUpdateFields = [
    {
      name: "role",
      label: "Role",
      type: "select" as const,
      options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
        { value: "viewer", label: "Viewer" },
      ],
      required: true,
    },
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading tenant users...</CardDescription>
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
          <CardTitle>User Management</CardTitle>
          <CardDescription>Error loading tenant users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">Error loading users: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage users for tenant: {tenant?.name || tenantId}</CardDescription>
        </div>
        <CreateFormDialog
          title="Invite User"
          description="Send an invitation to a new user."
          fields={inviteFields}
          schema={inviteSchema}
          onSubmit={handleInviteUser}
          isSubmitting={isInviting}
          submitButtonText="Send Invitation"
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={users || []} searchColumn="email" searchPlaceholder="Search users..." />

        {selectedUser && (
          <>
            <EditFormDialog
              title="Change User Role"
              description={`Update role for ${selectedUser.name}`}
              fields={roleUpdateFields}
              schema={z.object({ role: z.string() })}
              onSubmit={handleUpdateUserRole}
              currentData={{ role: selectedUser.role }}
              isSubmitting={isUpdating}
              trigger={<span className="hidden" />}
            />

            <DeleteConfirmationDialog
              title="Remove User"
              description={`Are you sure you want to remove ${selectedUser.name} from this tenant? This action cannot be undone.`}
              onConfirm={handleRemoveUser}
              isDeleting={isRemoving}
              trigger={<span className="hidden" />}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
