"use client" // This page needs to be a client component to use useState for the dialog

import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { TenantUsersManagement } from "@/components/superadmin/tenant-users-management" // Assuming this component exists
import { getTenantById } from "@/lib/services/tenant-service"
import { UserService } from "@/lib/services/user-service" // Import UserService
import { InviteUserDialog } from "@/components/superadmin/invite-user-dialog" // Import the dialog
import { useState, useEffect } from "react" // Import useState and useEffect for client component state
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation" // Import useRouter for revalidation

interface TenantUsersPageProps {
  params: { id: string }
}

export default function TenantUsersPage({ params }: TenantUsersPageProps) {
  const tenantId = params.id
  const { toast } = useToast()
  const router = useRouter()

  const [tenant, setTenant] = useState<any>(null) // Use any for now, or define a Tenant type
  const [tenantUsers, setTenantUsers] = useState<any[]>([]) // Use any for now, or define TenantUser type
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const fetchTenantData = async () => {
    setLoading(true)
    setError(null)
    try {
      const tenantService = await getTenantById(tenantId)
      if (!tenantService) {
        notFound() // If tenant not found, use Next.js notFound
      }
      setTenant(tenantService)

      const userService = await UserService.create()
      const usersResult = await userService.getTenantUsers(tenantId)
      if (usersResult.success && usersResult.data) {
        setTenantUsers(usersResult.data)
      } else {
        setError(usersResult.error || "Failed to load tenant users.")
      }
    } catch (err: any) {
      console.error("Error fetching tenant data:", err)
      setError(err.message || "An unexpected error occurred while fetching tenant data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenantData()
  }, [tenantId]) // Re-fetch if tenantId changes

  const handleInvitationSent = () => {
    // Revalidate data after an invitation is sent
    fetchTenantData()
    router.refresh() // Force a refresh of the current route to re-fetch server data
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Users...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we load the tenant user data.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tenant) {
    return notFound() // Should not happen if loading and error are handled
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users for {tenant.name}</CardTitle>
            <CardDescription>Manage users and their roles within this tenant.</CardDescription>
          </div>
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </CardHeader>
        <CardContent>
          <TenantUsersManagement initialUsers={tenantUsers} tenantId={tenant.id} onUserUpdated={handleInvitationSent} />
        </CardContent>
      </Card>

      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        tenantId={tenant.id}
        onInvitationSent={handleInvitationSent}
      />
    </div>
  )
}
