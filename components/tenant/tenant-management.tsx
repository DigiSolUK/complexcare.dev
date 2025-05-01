"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Download, MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CreateTenantDialog } from "./create-tenant-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Tenant } from "@/types"

export function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const { toast } = useToast()

  const fetchTenants = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/admin/tenants")

      if (!response.ok) {
        throw new Error("Failed to fetch tenants")
      }

      const data = await response.json()
      setTenants(data)
      setFilteredTenants(data)
    } catch (err) {
      console.error("Error fetching tenants:", err)
      setError("Failed to load tenants. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  useEffect(() => {
    // Filter tenants based on search query and status filter
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
        throw new Error("Failed to delete tenant")
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
        description: "Failed to delete tenant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedTenant(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "trial":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Trial</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>
      case "deleted":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Deleted</Badge>
      default:
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" onClick={fetchTenants} className="mt-2">
          Try Again
        </Button>
      </Alert>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tenants</CardTitle>
              <CardDescription>View and manage all tenants in the system</CardDescription>
            </div>
            <Button onClick={handleCreateTenant}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Tenant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                    <SelectItem value="all">All Tenants</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Tenant Name</th>
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
                        <p className="mt-2 text-muted-foreground">Loading tenants...</p>
                      </td>
                    </tr>
                  ) : filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <p className="text-muted-foreground">No tenants found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="border-b">
                        <td className="p-3 font-medium">{tenant.name}</td>
                        <td className="p-3">{tenant.slug}</td>
                        <td className="p-3">{tenant.domain || "-"}</td>
                        <td className="p-3">{tenant.subscription_tier}</td>
                        <td className="p-3">{formatDate(tenant.created_at.toString())}</td>
                        <td className="p-3">{getStatusBadge(tenant.status)}</td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => (window.location.href = `/superadmin/tenants/${tenant.id}`)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => (window.location.href = `/superadmin/tenants/${tenant.id}/edit`)}
                              >
                                Edit Tenant
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => (window.location.href = `/superadmin/tenants/${tenant.id}/users`)}
                              >
                                Manage Users
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {tenant.status === "active" ? (
                                <DropdownMenuItem className="text-amber-600">Suspend Tenant</DropdownMenuItem>
                              ) : tenant.status === "suspended" ? (
                                <DropdownMenuItem className="text-green-600">Reactivate Tenant</DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTenant(tenant)}>
                                Delete Tenant
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination would go here */}
          </div>
        </CardContent>
      </Card>

      <CreateTenantDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={handleCreateSuccess} />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tenant"
        description={`Are you sure you want to delete ${selectedTenant?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={confirmDeleteTenant}
      />
    </>
  )
}
