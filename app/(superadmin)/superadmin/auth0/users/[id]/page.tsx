"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Key } from "lucide-react"
import { getAuth0User, getUserRoles } from "@/lib/actions/auth0-actions"
import { EditAuth0UserForm } from "@/components/superadmin/edit-auth0-user-form"
import { useState } from "react"
import { PasswordResetDialog } from "@/components/superadmin/password-reset-dialog"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false)

  try {
    const user = await getAuth0User(params.id)
    const roles = await getUserRoles(params.id)

    const formatDate = (dateString: string | undefined) => {
      if (!dateString) return "N/A"
      return new Date(dateString).toLocaleString()
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/superadmin/auth0">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
              <p className="text-muted-foreground">View and manage user information</p>
            </div>
          </div>
          <div className="space-x-2">
            <Button asChild>
              <Link href={`/superadmin/auth0/users/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordResetDialogOpen(true)}>
              <Key className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user.picture && (
            <img
              src={user.picture || "/placeholder.svg"}
              alt={user.name || user.email}
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name || "No Name"}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              {user.blocked ? <Badge variant="destructive">Blocked</Badge> : <Badge variant="success">Active</Badge>}
              {user.email_verified ? (
                <Badge variant="outline">Email Verified</Badge>
              ) : (
                <Badge variant="outline" className="text-amber-500 border-amber-500">
                  Not Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="edit">Edit User</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Basic user details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">User ID</div>
                    <div className="text-sm text-muted-foreground break-all">{user.user_id}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Name</div>
                    <div className="text-sm text-muted-foreground">{user.name || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">First Name</div>
                    <div className="text-sm text-muted-foreground">{user.given_name || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Last Name</div>
                    <div className="text-sm text-muted-foreground">{user.family_name || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Nickname</div>
                    <div className="text-sm text-muted-foreground">{user.nickname || "N/A"}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>Login and verification information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Created At</div>
                    <div className="text-sm text-muted-foreground">{formatDate(user.created_at)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Last Login</div>
                    <div className="text-sm text-muted-foreground">{formatDate(user.last_login)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Login Count</div>
                    <div className="text-sm text-muted-foreground">{user.logins_count || 0}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Email Verified</div>
                    <div className="text-sm text-muted-foreground">{user.email_verified ? "Yes" : "No"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Account Status</div>
                    <div className="text-sm text-muted-foreground">{user.blocked ? "Blocked" : "Active"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Connection</div>
                    <div className="text-sm text-muted-foreground">{user.identities?.[0]?.connection || "N/A"}</div>
                  </div>
                </CardContent>
              </Card>

              {(user.user_metadata || user.app_metadata) && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                    <CardDescription>Custom user and application metadata</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.user_metadata && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">User Metadata</h3>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                          {JSON.stringify(user.user_metadata, null, 2)}
                        </pre>
                      </div>
                    )}

                    {user.app_metadata && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">App Metadata</h3>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                          {JSON.stringify(user.app_metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Roles assigned to this user</CardDescription>
              </CardHeader>
              <CardContent>
                {roles.length > 0 ? (
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-start space-x-2 p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{role.name}</div>
                          {role.description && <div className="text-sm text-muted-foreground">{role.description}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No roles assigned to this user</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Edit User</CardTitle>
                <CardDescription>Update user information</CardDescription>
              </CardHeader>
              <CardContent>
                <EditAuth0UserForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Password Reset Dialog */}
        <PasswordResetDialog user={user} open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching user:", error)
    return notFound()
  }
}
