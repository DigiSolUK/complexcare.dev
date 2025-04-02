"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, FileEdit, Trash2, CheckCircle, Download } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Invoice } from "@/types"

interface InvoiceTableProps {
  filter?: string
  searchQuery?: string
}

export function InvoiceTable({ filter = "all", searchQuery = "" }: InvoiceTableProps) {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/invoices")
        if (!response.ok) {
          throw new Error("Failed to fetch invoices")
        }
        const data = await response.json()
        setInvoices(data)
      } catch (err) {
        setError("Error loading invoices. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const filteredInvoices = invoices.filter((invoice) => {
    // Apply status filter
    if (filter !== "all" && invoice.status !== filter) {
      return false
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        invoice.invoice_number.toLowerCase().includes(query) ||
        invoice.patient_name?.toLowerCase().includes(query) ||
        invoice.description?.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading invoices...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  if (filteredInvoices.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No invoices found. {filter !== "all" && `Try changing the filter or `}
        Create a new invoice to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredInvoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
            <TableCell>{invoice.patient_name}</TableCell>
            <TableCell>{formatCurrency(invoice.amount)}</TableCell>
            <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/invoicing/${invoice.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => router.push(`/invoicing/${invoice.id}/edit`)}>
                  <FileEdit className="h-4 w-4" />
                </Button>
                {invoice.status === "draft" && (
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {invoice.status === "sent" && (
                  <Button variant="ghost" size="icon" className="text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

