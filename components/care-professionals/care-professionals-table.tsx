"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

type CareProfessional = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: string
  specialization?: string
  qualification?: string
  license_number?: string
  employment_status?: string
  start_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
  address?: string
  notes?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  avatar_url?: string
}

interface CareProfessionalsTableProps {
  professionals: CareProfessional[]
}

export function CareProfessionalsTable({ professionals = [] }: CareProfessionalsTableProps) {
  // Ensure professionals is an array
  const professionalsArray = Array.isArray(professionals) ? professionals : []

  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Safely sort professionals
  const sortedProfessionals = [...professionalsArray].sort((a, b) => {
    if (!sortColumn) return 0

    // Safely access properties that might be undefined
    const aValue = a[sortColumn as keyof CareProfessional] || ""
    const bValue = b[sortColumn as keyof CareProfessional] || ""

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Get initials safely
  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName.charAt(0) || ""
    const lastInitial = lastName.charAt(0) || ""
    return (firstInitial + lastInitial).toUpperCase() || "CP"
  }

  // If no professionals, show a message
  if (professionalsArray.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No care professionals found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("first_name")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Name</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Specialization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProfessionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {professional.avatar_url && (
                      <AvatarImage
                        src={professional.avatar_url || "/placeholder.svg"}
                        alt={`${professional.first_name} ${professional.last_name}`}
                        onError={(e) => {
                          // Handle image loading errors
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    )}
                    <AvatarFallback className="bg-muted">
                      {getInitials(professional.first_name, professional.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  {professional.first_name} {professional.last_name}
                </div>
              </TableCell>
              <TableCell>{professional.role || "N/A"}</TableCell>
              <TableCell className="hidden md:table-cell">{professional.specialization || "N/A"}</TableCell>
              <TableCell>
                <Badge variant={professional.is_active ? "default" : "secondary"}>
                  {professional.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/care-professionals/${professional.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
