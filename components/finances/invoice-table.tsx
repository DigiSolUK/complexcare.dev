"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  FileEdit,
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

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

type Invoice = {
  id: string
  invoiceNumber: string
  patientName: string
  patientId: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: "paid" | "unpaid" | "overdue" | "draft" | "cancelled"
  description: string
}

const invoices: Invoice[] = [
  {
    id: "INV001",
    invoiceNumber: "INV-2023-001",
    patientName: "John Doe",
    patientId: "P001",
    amount: 1250.0,
    dueDate: "2023-06-15",
    paidDate: "2023-06-10",
    status: "paid",
    description: "Monthly care package - May 2023",
  },
  {
    id: "INV002",
    invoiceNumber: "INV-2023-002",
    patientName: "Jane Smith",
    patientId: "P002",
    amount: 875.5,
    dueDate: "2023-06-20",
    paidDate: null,
    status: "unpaid",
    description: "Weekly therapy sessions - May 2023",
  },
  {
    id: "INV003",
    invoiceNumber: "INV-2023-003",
    patientName: "Robert Johnson",
    patientId: "P003",
    amount: 520.0,
    dueDate: "2023-05-25",
    paidDate: null,
    status: "overdue",
    description: "Specialist consultation - May 2023",
  },
  {
    id: "INV004",
    invoiceNumber: "INV-2023-004",
    patientName: "Emily Williams",
    patientId: "P004",
    amount: 1675.25,
    dueDate: "2023-06-30",
    paidDate: null,
    status: "draft",
    description: "Comprehensive care package - June 2023",
  },
  {
    id: "INV005",
    invoiceNumber: "INV-2023-005",
    patientName: "Michael Brown",
    patientId: "P005",
    amount: 950.0,
    dueDate: "2023-05-20",
    paidDate: null,
    status: "cancelled",
    description: "Physical therapy sessions - May 2023",
  },
]

export function InvoiceTable() {
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

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof Invoice]
    const bValue = b[sortColumn as keyof Invoice]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "unpaid":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "draft":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Paid
          </Badge>
        )
      case "unpaid":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Unpaid
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Overdue
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Draft
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Cancelled
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("invoiceNumber")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Invoice #</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
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
                onClick={() => handleSort("amount")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Amount</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("dueDate")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Due Date</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">
                      {invoice.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {invoice.patientName}
                </div>
              </TableCell>
              <TableCell>£{invoice.amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(invoice.status)}
                  {getStatusBadge(invoice.status)}
                </div>
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
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit Invoice</span>
                    </DropdownMenuItem>
                    {invoice.status === "unpaid" && (
                      <DropdownMenuItem>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <span>Mark as Paid</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Invoice</span>
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

