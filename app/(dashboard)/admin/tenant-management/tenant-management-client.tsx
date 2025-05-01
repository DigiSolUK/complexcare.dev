"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Edit, Trash2, MoreHorizontal, Loader2, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CreateTenantDialog } from "@/components/tenant/create-tenant-dialog"
import { TenantSettingsDialog } from "@/components/tenant/tenant-settings-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"

// Define the Tenant type
type Tenant = {
  id: string
  name: string
  domain?: string
  slug: string
  status: string
  subscription_tier: string
  created_at: string
  updated_at: string
  settings?: Record<string, any>
  branding?: Record<string, any>
}

export function TenantManagementClient() {
  const router = useRouter()
  const { toast } = useToast()

  const [tenants, setTenants] = useState<Tenant[]>([])
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

  // Fetch tenants from the API
  const fetchTenants = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/admin/tenants")

      if (!response.ok) {
        throw new Error(`Failed to fetch tenants: ${response.statusText}`)
      }

      const data = await response.json()
      setTenants(data)
      setFilteredTenants(data)
    } catch (err) {
      console.error("Error fetching tenants:", err)
      setError(err instanceof Error ? err.message : "Failed to load tenants")
    } finally {
      setIsLoading(false)
    }
  }

  // Load tenants on component mount
  useEffect(() => {
    fetchTenants()
  }, [])

  // Filter tenants based on search query and status filter
  useEffect(() => {
    let filtered = tenants

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tenant) =>
          tenant.name.toLowerCase().includes(query) ||
          tenant.slug.toLowerCase().includes(query) ||
          (tenant.domain && tenant.domain.toLowerCase().includes(query)),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((tenant) => tenant.status === statusFilter)
    }

    setFilteredTenants(filtered)
  }, [tenants, searchQuery, statusFilter])

  // Handle creating a new tenant
  const handleCreateTenant = () => {
    setCreateDialogOpen(true)
  }

  const handleCreateSuccess = () => {
    fetchTenants()
    toast({
      title: "Tenant Created",
      description: "The tenant has been created successfully.",
    })
  }

  // Handle editing a tenant
  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setEditDialogOpen(true)
  }

  const handleSaveTenant = async (updatedTenant: Tenant) => {
    try {
      const response = await fetch(`/api/admin/tenants/${updatedTenant.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTenant),
      })

      if (!response.ok) {
        throw new Error(`Failed to update tenant: ${response.statusText}`)
      }

      toast({
        title: "Tenant Updated",
        description: `${updatedTenant.name} has been updated successfully.`,
      })

      fetchTenants()
    } catch (err) {
      console.error("Error updating tenant:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update tenant",
        variant: "destructive",
      })
    }
  }

  // Handle deleting a tenant
  const handleDeleteTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteTenant = async () => {
    if (!selectedTenant) return

    try {
      const response = await fetch(`/api/admin/tenants/${selectedTenant.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete tenant: ${response.statusText}`)
      }

      toast({
        title: "Tenant Deleted",
        description: `${selectedTenant.name} has been deleted successfully.`,
      })

      fetchTenants()
    } catch (err) {
      console.error("Error deleting tenant:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete tenant",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedTenant(null)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  // Get status badge based on tenant status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "trial":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Trial</Badge>
      case "suspended":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Suspended</Badge>
      case "deleted":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Deleted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Handle exporting tenants to CSV
  const handleExportTenants = () => {
    // Convert tenants to CSV
    const headers = ["Name", "Slug", "Domain", "Status", "Subscription", "Created At"]
    const csvContent = [
      headers.join(","),
      ...filteredTenants.map((tenant) =>
        [
          `"${tenant.name}"`,
          `"${tenant.slug}"`,
          `"${tenant.domain || ""}"`,
          `"${tenant.status}"`,
          `"${tenant.subscription_tier}"`,
          `"${formatDate(tenant.created_at)}"`,
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `tenants-export-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Tenants</CardTitle>
              <CardDescription>Manage tenant organizations in the system</CardDescription>
            </div>
            <Button onClick={handleCreateTenant}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Tenant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading tenants</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" onClick={fetchTenants} className="inline-flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tenants..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={handleExportTenants}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>

              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Name</th>
                        <th className="p-3 text-left font-medium">Slug</th>
                        <th className="p-3 text-left font-medium">Domain</th>
                        <th className="p-3 text-left font-medium">Subscription</th>
                        <th className="p-3 text-left font-medium">Created</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center">
                            <div className="flex justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Loading tenants...</p>
                          </td>
                        </tr>
                      ) : filteredTenants.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center">
                            <p className="text-muted-foreground">No tenants found</p>
                            {searchQuery || statusFilter !== "all" ? (
                              <Button
                                variant="link"
                                onClick={() => {
                                  setSearchQuery("")
                                  setStatusFilter("all")
                                }}
                              >
                                Clear filters
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      ) : (
                        filteredTenants.map((tenant) => (
                          <tr key={tenant.id} className="border-b">
                            <td className="p-3 font-medium">{tenant.name}</td>
                            <td className="p-3">{tenant.slug}</td>
                            <td className="p-3">{tenant.domain || "-"}</td>
                            <td className="p-3 capitalize">{tenant.subscription_tier}</td>
                            <td className="p-3">{formatDate(tenant.created_at)}</td>
                            <td className="p-3">{getStatusBadge(tenant.status)}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditTenant(tenant)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteTenant(tenant)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">More</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => router.push(`/admin/tenant-management/${tenant.id}`)}
                                    >
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => router.push(`/admin/tenant-management/${tenant.id}/users`)}
                                    >
                                      Manage Users
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {tenant.status === "active" ? (
                                      <DropdownMenuItem className="text-amber-600">Suspend Tenant</DropdownMenuItem>
                                    ) : tenant.status === "suspended" ? (
                                      <DropdownMenuItem className="text-green-600">Reactivate Tenant</DropdownMenuItem>
                                    ) : null}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Tenant Dialog */}
      <CreateTenantDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={handleCreateSuccess} />

      {/* Edit Tenant Dialog */}
      {selectedTenant && (
        <TenantSettingsDialog
          tenant={{
            id: selectedTenant.id,
            name: selectedTenant.name,
            domain: selectedTenant.domain || "",
            status: selectedTenant.status as any,
            plan: selectedTenant.subscription_tier as any,
            usersCount: 0, // This would be fetched from the API in a real implementation
            createdAt: selectedTenant.created_at,
          }}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={(updatedTenant) => {
            handleSaveTenant({
              ...selectedTenant,
              name: updatedTenant.name,
              domain: updatedTenant.domain,
              status: updatedTenant.status,
              subscription_tier: updatedTenant.plan,
            })
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tenant"
        description={`Are you sure you want to delete ${selectedTenant?.name}? This action cannot be undone and will remove all associated data.`}
        onConfirm={confirmDeleteTenant}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  )
}
