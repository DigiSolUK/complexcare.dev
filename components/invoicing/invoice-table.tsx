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
          throw new Error(`Failed to fetch invoices: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()

        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.warn("Expected array of invoices but got:", data)
          setInvoices([])
        } else {
          setInvoices(data)
        }
      } catch (err) {
        console.error("Error loading invoices:", err)
        setError("Error loading invoices. Please try again.")
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
        invoice.invoice_number?.toLowerCase().includes(query) ||
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
        return <Badge>{status || "Unknown"}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-500">Loading invoices...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 my-4">
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
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
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
            <TableCell className="font-medium">{invoice.invoice_number || "N/A"}</TableCell>
            <TableCell>{invoice.patient_name || "Unknown Patient"}</TableCell>
            <TableCell>{formatCurrency(invoice.amount || 0)}</TableCell>
            <TableCell>{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : "N/A"}</TableCell>
            <TableCell>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "N/A"}</TableCell>
            <TableCell>{getStatusBadge(invoice.status || "unknown")}</TableCell>
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
