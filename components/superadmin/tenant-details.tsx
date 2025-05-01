"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { TenantSettingsForm } from "@/components/superadmin/tenant-settings-form"
import { TenantUsersManagement } from "@/components/superadmin/tenant-users-management"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TenantDetailsProps {
  tenantId: string
}

interface TenantData {
  id: string
  name: string
  subdomain: string
  contact_email: string
  contact_phone: string
  address: string
  description: string
  is_active: boolean
  max_users: number
  created_at: string
  updated_at: string
}

export function TenantDetails({ tenantId }: TenantDetailsProps) {
  const router = useRouter()
  const [tenant, setTenant] = useState<TenantData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Partial<TenantData>>({})

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await fetch(`/api/superadmin/tenants/${tenantId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch tenant details")
        }

        const data = await response.json()
        setTenant(data)
        setFormData(data)
      } catch (error) {
        console.error("Error fetching tenant:", error)
        toast({
          title: "Error",
          description: "Failed to load tenant details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenant()
  }, [tenantId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/superadmin/tenants/${tenantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update tenant")
      }

      const updatedTenant = await response.json()
      setTenant(updatedTenant)

      toast({
        title: "Success",
        description: "Tenant information updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating tenant:", error)
      toast({
        title: "Error",
        description: "Failed to update tenant information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/superadmin/tenants/${tenantId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete tenant")
      }

      toast({
        title: "Success",
        description: "Tenant deleted successfully.",
      })

      router.push("/superadmin/tenants")
    } catch (error) {
      console.error("Error deleting tenant:", error)
      toast({
        title: "Error",
        description: "Failed to delete tenant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Tenant Not Found</h2>
        <p className="text-muted-foreground mb-6">The tenant you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => router.push("/superadmin/tenants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenants
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/superadmin/tenants")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{tenant.name}</h1>
          <Badge variant={tenant.is_active ? "default" : "secondary"}>{tenant.is_active ? "Active" : "Inactive"}</Badge>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Tenant
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the tenant &quot;{tenant.name}&quot; and all
                associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Information</CardTitle>
              <CardDescription>View and edit basic information about this tenant.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tenant Name</Label>
                    <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Subdomain</Label>
                    <Input
                      id="subdomain"
                      name="subdomain"
                      value={formData.subdomain || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      value={formData.contact_email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      name="contact_phone"
                      value={formData.contact_phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_users">Maximum Users</Label>
                    <Input
                      id="max_users"
                      name="max_users"
                      type="number"
                      min="1"
                      value={formData.max_users || 10}
                      onChange={handleNumberChange}
                    />
                  </div>

                  <div className="space-y-2 flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_active">Active Status</Label>
                      <p className="text-sm text-muted-foreground">Enable or disable this tenant</p>
                    </div>
                    <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(tenant.created_at).toLocaleString()}
                  <br />
                  Last Updated: {new Date(tenant.updated_at).toLocaleString()}
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <TenantSettingsForm tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <TenantUsersManagement tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Statistics</CardTitle>
              <CardDescription>View usage statistics and metrics for this tenant.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Statistics will be implemented in the next phase.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
