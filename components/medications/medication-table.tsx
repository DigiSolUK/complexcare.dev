"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, FileEdit, Trash2, Clock, CheckCircle } from "lucide-react"

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Medication = {
  id: string
  patientName: string
  patientId: string
  medicationName: string
  dosage: string
  frequency: string
  route: string
  startDate: string
  endDate: string | null
  isActive: boolean
  prescribedBy: string
  reason: string
}

const medications: Medication[] = [
  {
    id: "M001",
    patientName: "John Doe",
    patientId: "P001",
    medicationName: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    route: "Oral",
    startDate: "2023-01-15",
    endDate: null,
    isActive: true,
    prescribedBy: "Dr. Sarah Johnson",
    reason: "Type 2 Diabetes",
  },
  {
    id: "M002",
    patientName: "Jane Smith",
    patientId: "P002",
    medicationName: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    route: "Oral",
    startDate: "2023-02-10",
    endDate: null,
    isActive: true,
    prescribedBy: "Dr. Michael Chen",
    reason: "Hypertension",
  },
  {
    id: "M003",
    patientName: "Robert Johnson",
    patientId: "P003",
    medicationName: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    route: "Oral",
    startDate: "2023-03-05",
    endDate: "2023-03-12",
    isActive: false,
    prescribedBy: "Dr. Emily Williams",
    reason: "Bacterial infection",
  },
  {
    id: "M004",
    patientName: "Emily Williams",
    patientId: "P004",
    medicationName: "Sertraline",
    dosage: "50mg",
    frequency: "Once daily",
    route: "Oral",
    startDate: "2023-04-20",
    endDate: null,
    isActive: true,
    prescribedBy: "Dr. James Wilson",
    reason: "Depression",
  },
  {
    id: "M005",
    patientName: "Michael Brown",
    patientId: "P005",
    medicationName: "Ibuprofen",
    dosage: "400mg",
    frequency: "As needed",
    route: "Oral",
    startDate: "2023-05-12",
    endDate: "2023-05-19",
    isActive: false,
    prescribedBy: "Dr. Lisa Thompson",
    reason: "Pain management",
  },
]

export function MedicationTable() {
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

  const sortedMedications = [...medications].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof Medication]
    const bValue = b[sortColumn as keyof Medication]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("patientName")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Patient</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("medicationName")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Medication</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("startDate")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Start Date</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMedications.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell className="font-medium">{medication.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">
                      {medication.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {medication.patientName}
                </div>
              </TableCell>
              <TableCell>{medication.medicationName}</TableCell>
              <TableCell>{medication.dosage}</TableCell>
              <TableCell>{medication.frequency}</TableCell>
              <TableCell>{new Date(medication.startDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {medication.isActive ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200">
                    <Clock className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                )}
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit Medication</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Medication</span>
                    </DropdownMenuItem>
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

