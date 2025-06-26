"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Search, SortAsc, SortDesc, MoreHorizontal, UserX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateCareProfessionalDialog } from "@/components/care-professionals/create-care-professional-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/use-toast"

interface CareProfessional {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: string
  specialization: string | null
  employment_status: string | null
  is_active: boolean
  avatar_url: string | null
  created_at: string
  updated_at: string
}

type SortField = "name" | "role" | "employment_status" | "created_at"
type SortDirection = "asc" | "desc"

export default function CareProfessionalsPage() {
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const [filteredProfessionals, setFilteredProfessionals] = useState<CareProfessional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [employmentFilter, setEmploymentFilter] = useState<string>("all")

  // Sort states
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)

  const fetchCareProfessionals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/care-professionals")

      if (!response.ok) {
        throw new Error(`Failed to fetch care professionals: ${response.status}`)
      }

      const data = await response.json()
      setCareProfessionals(data)
      setFilteredProfessionals(data)
    } catch (err) {
      console.error("Error fetching care professionals:", err)
      setError("Failed to load care professionals. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCareProfessionals()
  }, [])

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...careProfessionals]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((cp) => {
        const fullName = `${cp.first_name} ${cp.last_name}`.toLowerCase()
        return (
          fullName.includes(searchLower) ||
          cp.role.toLowerCase().includes(searchLower) ||
          (cp.specialization && cp.specialization.toLowerCase().includes(searchLower)) ||
          cp.email.toLowerCase().includes(searchLower)
        )
      })
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((cp) => cp.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      filtered = filtered.filter((cp) => cp.is_active === isActive)
    }

    // Apply employment filter
    if (employmentFilter !== "all") {
      filtered = filtered.filter((cp) => cp.employment_status === employmentFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case "name":
          aValue = `${a.last_name} ${a.first_name}`.toLowerCase()
          bValue = `${b.last_name} ${b.first_name}`.toLowerCase()
          break
        case "role":
          aValue = a.role.toLowerCase()
          bValue = b.role.toLowerCase()
          break
        case "employment_status":
          aValue = (a.employment_status || "").toLowerCase()
          bValue = (b.employment_status || "").toLowerCase()
          break
        case "created_at":
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          return 0
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredProfessionals(filtered)
  }, [careProfessionals, searchTerm, roleFilter, statusFilter, employmentFilter, sortField, sortDirection])

  const handleCareProfessionalCreated = () => {
    fetchCareProfessionals()
    setIsCreateDialogOpen(false)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDeactivate = async () => {
    if (!deactivatingId) return

    try {
      const response = await fetch(`/api/care-professionals/${deactivatingId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to deactivate care professional")
      }

      toast({
        title: "Success!",
        description: "Care professional deactivated successfully.",
      })

      fetchCareProfessionals() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setDeactivatingId(null)
      setIsDeactivateDialogOpen(false)
    }
  }

  // Get unique values for filter dropdowns
  const uniqueRoles = [...new Set(careProfessionals.map((cp) => cp.role))].sort()
  const uniqueEmploymentStatuses = [
    ...new Set(careProfessionals.map((cp) => cp.employment_status).filter(Boolean)),
  ].sort()

  if (loading) {
    return <CareProfessionalsSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Care Professionals</h1>
          <p className="text-muted-foreground">
            Manage and view all care professionals in the system ({filteredProfessionals.length} of{" "}
            {careProfessionals.length})
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Add New</Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search professionals..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={employmentFilter} onValueChange={setEmploymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by employment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employment</SelectItem>
                {uniqueEmploymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSort("name")} className="flex-1">
                Name
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <SortAsc className="ml-1 h-3 w-3" />
                  ) : (
                    <SortDesc className="ml-1 h-3 w-3" />
                  ))}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSort("role")} className="flex-1">
                Role
                {sortField === "role" &&
                  (sortDirection === "asc" ? (
                    <SortAsc className="ml-1 h-3 w-3" />
                  ) : (
                    <SortDesc className="ml-1 h-3 w-3" />
                  ))}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfessionals.length > 0 ? (
          filteredProfessionals.map((cp) => (
            <Card key={cp.id} className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Link href={`/care-professionals/${cp.id}`} className="flex items-start gap-4 flex-1">
                    <Avatar>
                      <AvatarImage
                        src={cp.avatar_url || "/placeholder.svg?height=40&width=40&query=user avatar"}
                        alt={`${cp.first_name} ${cp.last_name}`}
                      />
                      <AvatarFallback>{`${cp.first_name.charAt(0)}${cp.last_name.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {cp.first_name} {cp.last_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{cp.role}</p>
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/care-professionals/${cp.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      {cp.is_active && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setDeactivatingId(cp.id)
                            setIsDeactivateDialogOpen(true)
                          }}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email: </span>
                    {cp.email}
                  </div>
                  {cp.phone && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Phone: </span>
                      {cp.phone}
                    </div>
                  )}
                  {cp.specialization && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Specialization: </span>
                      {cp.specialization}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant={cp.is_active ? "default" : "secondary"}>
                      {cp.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {cp.employment_status && <Badge variant="outline">{cp.employment_status}</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p>No care professionals found matching your criteria.</p>
          </div>
        )}
      </div>

      <CreateCareProfessionalDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCareProfessionalCreated={handleCareProfessionalCreated}
      />

      <ConfirmDialog
        isOpen={isDeactivateDialogOpen}
        onClose={() => setIsDeactivateDialogOpen(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Care Professional"
        description="Are you sure you want to deactivate this care professional? They will no longer be active in the system, but their data will be retained."
        confirmText="Deactivate"
        isDestructive
        loading={deactivatingId !== null}
      />
    </div>
  )
}

function CareProfessionalsSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
