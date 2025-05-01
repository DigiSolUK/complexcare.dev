"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Mail, Trash2, ShieldAlert, ShieldCheck, Shield } from "lucide-react"
import { AddUserDialog } from "@/components/superadmin/add-user-dialog"
import { InviteUserDialog } from "@/components/superadmin/invite-user-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "invited" | "inactive"
  lastLogin?: string
}

interface TenantUsersManagementProps {
  tenantId: string
  tenantName: string
}

export function TenantUsersManagement({ tenantId, tenantName }: TenantUsersManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [inviteUserOpen, setInviteUserOpen] = useState(false)
  const [deleteUserOpen, setDeleteUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/admin/tenants/${tenantId}/users`)
        if (!response.ok) throw new Error("Failed to fetch users")
        const data = await response.json()
        setUsers(data.users || [])
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [tenantId])

  const handleAddUser = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      })

      if (!response.ok) throw new Error("Failed to add user")

      const data = await response.json()
      setUsers([...users, data.user])
      toast.success("User added successfully")
    } catch (error) {
      console.error("Error adding user:", error)
      toast.error("Failed to add user")
    }
  }

  const handleInviteUser = async (email: string, role: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      })

      if (!response.ok) throw new Error("Failed to invite user")

      const data = await response.json()
      setUsers([
        ...users,
        {
          id: data.invitation.id,
          name: "Pending Invitation",
          email: data.invitation.email,
          role: data.invitation.role,
          status: "invited",
        },
      ])
      toast.success("Invitation sent successfully")
    } catch (error) {
      console.error("Error inviting user:", error)
      toast.error("Failed to send invitation")
    }
  }

  const handleRemoveUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/users/${selectedUser.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove user")

      setUsers(users.filter((user) => user.id !== selectedUser.id))
      toast.success("User removed successfully")
    } catch (error) {
      console.error("Error removing user:", error)
      toast.error("Failed to remove user")
    } finally {
      setDeleteUserOpen(false)
      setSelectedUser(null)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error("Failed to update role")

      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
      toast.success("Role updated successfully")
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Failed to update role")
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" /> Admin
          </Badge>
        )
      case "manager":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Manager
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" /> User
          </Badge>
        )
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>
      case "invited":
        return <Badge variant="warning">Invited</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users for {tenantName}</CardTitle>
            <CardDescription>Manage users who have access to this tenant</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddUserOpen(true)}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Existing User</span>
            </Button>
            <Button size="sm" onClick={() => setInviteUserOpen(true)} className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>Invite New User</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No users found for this tenant.</p>
              <p className="mt-2">Click "Add Existing User" or "Invite New User" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.lastLogin || "Never"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user)
                          setDeleteUserOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove user</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} onAddUser={handleAddUser} />

      <InviteUserDialog open={inviteUserOpen} onOpenChange={setInviteUserOpen} onInviteUser={handleInviteUser} />

      <ConfirmDialog
        open={deleteUserOpen}
        onOpenChange={setDeleteUserOpen}
        title="Remove User"
        description={`Are you sure you want to remove ${selectedUser?.name || "this user"} from the tenant? This action cannot be undone.`}
        onConfirm={handleRemoveUser}
      />
    </div>
  )
}
