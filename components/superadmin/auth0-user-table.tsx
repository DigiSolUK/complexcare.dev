"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Search, UserPlus, RefreshCw, Key } from "lucide-react"
import { deleteAuth0User, updateAuth0User, assignRolesToUser } from "@/lib/actions/auth0-actions"
import { EditAuth0UserForm } from "./edit-auth0-user-form"
import { PasswordResetDialog } from "./password-reset-dialog"

interface Auth0User {
  user_id: string
  email: string
  name: string
  nickname?: string
  picture?: string
  created_at: string
  last_login?: string
  logins_count: number
  blocked?: boolean
  email_verified: boolean
  app_metadata?: any
  user_metadata?: any
  identities?: any[]
  given_name?: string
  family_name?: string
}

interface Auth0Role {
  id: string
  name: string
  description?: string
}

interface Auth0UserTableProps {
  initialUsers: Auth0User[]
  totalUsers: number
  roles: Auth0Role[]
  userRoles: Record<string, string[]>
  page: number
  perPage: number
}

export function Auth0UserTable({ initialUsers, totalUsers, roles, userRoles, page, perPage }: Auth0UserTableProps) {
  const router = useRouter()
  const [users, setUsers] = useState<Auth0User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Auth0User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false)

  const totalPages = Math.ceil(totalUsers / perPage)

  const handleSearch = async () => {
    setIsSearching(true)
    router.push(`/superadmin/auth0?page=1&query=${encodeURIComponent(searchQuery)}`)
    setIsSearching(false)
  }

  const handlePageChange = (newPage: number) => {
    router.push(`/superadmin/auth0?page=${newPage}&query=${encodeURIComponent(searchQuery)}`)
  }

  const handleEditUser = (user: Auth0User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: Auth0User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleManageRoles = (user: Auth0User) => {
    setSelectedUser(user)
    setSelectedRoles(userRoles[user.user_id] || [])
    setIsRolesDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await deleteAuth0User(selectedUser.user_id)
      setUsers(users.filter((user) => user.user_id !== selectedUser.user_id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBlockUser = async (user: Auth0User, blocked: boolean) => {
    try {
      await updateAuth0User(user.user_id, { blocked })
      setUsers(users.map((u) => (u.user_id === user.user_id ? { ...u, blocked } : u)))
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Failed to update user. Please try again.")
    }
  }

  const handleSaveRoles = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await assignRolesToUser(selectedUser.user_id, selectedRoles)
      setIsRolesDialogOpen(false)
    } catch (error) {
      console.error("Error assigning roles:", error)
      alert("Failed to assign roles. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handlePasswordReset = (user: Auth0User) => {
    setSelectedUser(user)
    setIsPasswordResetDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        <Button onClick={() => router.push("/superadmin/auth0/create")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Logins</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {user.picture && (
                      <img
                        src={user.picture || "/placeholder.svg"}
                        alt={user.name || user.email}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <div>
                      <div>{user.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{user.nickname || "No nickname"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.email_verified ? "Verified" : "Not verified"}
                  </div>
                </TableCell>
                <TableCell>
                  {user.blocked ? (
                    <Badge variant="destructive">Blocked</Badge>
                  ) : (
                    <Badge variant="success">Active</Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{user.last_login ? formatDate(user.last_login) : "Never"}</TableCell>
                <TableCell>{user.logins_count}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/superadmin/auth0/users/${user.user_id}`)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleManageRoles(user)}>Manage Roles</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePasswordReset(user)}>
                        <Key className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.blocked ? (
                        <DropdownMenuItem onClick={() => handleBlockUser(user, false)}>Unblock User</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleBlockUser(user, true)}>Block User</DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update information for {selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <EditAuth0UserForm
              user={selectedUser}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {selectedUser?.email && ` "${selectedUser.email}"`} and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manage Roles Dialog */}
      <Dialog open={isRolesDialogOpen} onOpenChange={setIsRolesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>Assign roles to {selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRoles([...selectedRoles, role.id])
                    } else {
                      setSelectedRoles(selectedRoles.filter((id) => id !== role.id))
                    }
                  }}
                />
                <Label htmlFor={`role-${role.id}`} className="flex-1">
                  <div>{role.name}</div>
                  {role.description && <div className="text-xs text-muted-foreground">{role.description}</div>}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setIsRolesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRoles} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Roles"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      {selectedUser && (
        <PasswordResetDialog
          user={selectedUser}
          open={isPasswordResetDialogOpen}
          onOpenChange={setIsPasswordResetDialogOpen}
        />
      )}
    </div>
  )
}
