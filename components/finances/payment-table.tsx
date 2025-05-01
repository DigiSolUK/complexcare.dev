"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, FileEdit, Trash2, CreditCard, Wallet, BanknoteIcon } from "lucide-react"

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

type Payment = {
  id: string
  patientName: string
  patientId: string
  invoiceNumber: string | null
  amount: number
  paymentDate: string
  paymentMethod: "credit_card" | "bank_transfer" | "cash" | "other"
  reference: string
  notes: string | null
}

const payments: Payment[] = [
  {
    id: "PAY001",
    patientName: "John Doe",
    patientId: "P001",
    invoiceNumber: "INV-2023-001",
    amount: 1250.0,
    paymentDate: "2023-06-10",
    paymentMethod: "credit_card",
    reference: "CARD-12345",
    notes: null,
  },
  {
    id: "PAY002",
    patientName: "Sarah Thompson",
    patientId: "P006",
    invoiceNumber: "INV-2023-006",
    amount: 550.0,
    paymentDate: "2023-06-08",
    paymentMethod: "bank_transfer",
    reference: "BACS-67890",
    notes: "Monthly subscription payment",
  },
  {
    id: "PAY003",
    patientName: "David Wilson",
    patientId: "P007",
    invoiceNumber: null,
    amount: 75.0,
    paymentDate: "2023-06-05",
    paymentMethod: "cash",
    reference: "CASH-00123",
    notes: "Additional service payment",
  },
  {
    id: "PAY004",
    patientName: "Laura Miller",
    patientId: "P008",
    invoiceNumber: "INV-2023-008",
    amount: 925.75,
    paymentDate: "2023-06-03",
    paymentMethod: "credit_card",
    reference: "CARD-45678",
    notes: null,
  },
  {
    id: "PAY005",
    patientName: "James Anderson",
    patientId: "P009",
    invoiceNumber: "INV-2023-009",
    amount: 1100.0,
    paymentDate: "2023-06-01",
    paymentMethod: "bank_transfer",
    reference: "BACS-12345",
    notes: "Quarterly payment",
  },
]

export function PaymentTable() {
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

  const sortedPayments = [...payments].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof Payment]
    const bValue = b[sortColumn as keyof Payment]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getPaymentMethodIcon = (method: Payment["paymentMethod"]) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case "bank_transfer":
        return <BanknoteIcon className="h-4 w-4 text-green-500" />
      case "cash":
        return <Wallet className="h-4 w-4 text-yellow-500" />
      default:
        return <BanknoteIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getPaymentMethodBadge = (method: Payment["paymentMethod"]) => {
    switch (method) {
      case "credit_card":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Credit Card
          </Badge>
        )
      case "bank_transfer":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Bank Transfer
          </Badge>
        )
      case "cash":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Cash
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Other
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("id")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>ID</span>
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
            <TableHead>Invoice #</TableHead>
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
                onClick={() => handleSort("paymentDate")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                <span>Date</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">
                      {payment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {payment.patientName}
                </div>
              </TableCell>
              <TableCell>
                {payment.invoiceNumber || <span className="text-muted-foreground text-xs">N/A</span>}
              </TableCell>
              <TableCell>£{payment.amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(payment.paymentMethod)}
                  {getPaymentMethodBadge(payment.paymentMethod)}
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
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Edit Payment</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Payment</span>
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
