"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Edit, Trash, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CareProfessional } from "@/types"

interface CareProfessionalsTableProps {
  professionals: CareProfessional[]
  isLoading: boolean
  onView: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onRefresh: () => void
}

export function CareProfessionalsTable({
  professionals,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onRefresh,
}: CareProfessionalsTableProps) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setTimeout(() => setRefreshing(false), 500)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (professionals.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No care professionals found</h3>
        <p className="text-muted-foreground mb-4">Add your first care professional to get started.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium">Care Professionals</h3>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Employment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map((professional) => (
              <TableRow key={professional.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={professional.avatar_url}
                        alt={`${professional.first_name} ${professional.last_name}`}
                      />
                      <AvatarFallback>{`${professional.first_name.charAt(0)}${professional.last_name.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                    <span>
                      {professional.first_name} {professional.last_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{professional.role}</TableCell>
                <TableCell>{professional.specialization || "-"}</TableCell>
                <TableCell>
                  <Badge variant={professional.employment_status === "Full-time" ? "default" : "outline"}>
                    {professional.employment_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(professional.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(professional.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem onClick={() => onDelete(professional.id)} className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="border rounded-md">
      <div className="p-4 border-b">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

