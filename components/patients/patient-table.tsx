"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Eye, MoreHorizontal, FileText, Calendar } from "lucide-react"

interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  status: string
  primaryCondition?: string
  nhsNumber?: string
  contactNumber?: string
  email?: string
  primaryCareProvider?: string
}

interface PatientTableProps {
  patients: Patient[]
  isLoading: boolean
}

export function PatientTable({ patients, isLoading }: PatientTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "stable":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ row }) => {
        const dob = row.getValue("dateOfBirth") as string
        try {
          return dob ? format(new Date(dob), "dd/MM/yyyy") : "-"
        } catch (error) {
          return dob || "-"
        }
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <div className="capitalize">{row.getValue("gender") || "-"}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge className={getStatusColor(status)}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "primaryCondition",
      header: "Primary Condition",
      cell: ({ row }) => <div>{row.getValue("primaryCondition") || "-"}</div>,
    },
    {
      accessorKey: "nhsNumber",
      header: "NHS Number",
      cell: ({ row }) => <div>{row.getValue("nhsNumber") || "-"}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/clinical-notes`)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Clinical Notes</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/appointments?patientId=${patient.id}`)}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Appointments</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: patients,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter patients..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? "Loading..." : "No patients found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
