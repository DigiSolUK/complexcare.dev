"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpRight, DollarSign, Clock, AlertCircle, FileText } from "lucide-react"
import type { Invoice } from "@/types"

export function InvoiceStats() {
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalOverdue: 0,
    totalPending: 0,
    totalDraft: 0,
    invoiceCount: 0,
    percentChange: 5.2, // Example value
  })
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Invoice[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/invoices")

        if (!response.ok) {
          throw new Error(`Failed to fetch invoices: ${response.statusText}`)
        }

        const data: Invoice[] = await response.json()
        setData(data)

        // Calculate stats
        const totalPaid = data
          .filter((invoice) => invoice.status === "paid")
          .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount.toString()), 0)

        const totalOverdue = data
          .filter((invoice) => invoice.status === "overdue")
          .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount.toString()), 0)

        const totalPending = data
          .filter((invoice) => invoice.status === "sent")
          .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount.toString()), 0)

        const totalDraft = data
          .filter((invoice) => invoice.status === "draft")
          .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount.toString()), 0)

        setStats({
          totalPaid,
          totalOverdue,
          totalPending,
          totalDraft,
          invoiceCount: data.length,
          percentChange: 5.2, // Example value, would be calculated based on historical data
        })
      } catch (err) {
        console.error("Error fetching invoice stats:", err)
        setError("Failed to load invoice statistics")

        // Set demo data as fallback
        const demoData = getDemoInvoices()
        setData(demoData)

        // Calculate stats from demo data
        const totalPaid = demoData
          .filter((invoice) => invoice.status === "paid")
          .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount.toString()), 0)

        const totalOverdue = demoData
          .filter((invoice) => invoice.status === "overdue")
          .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount.toString()), 0)

        const totalPending = demoData
          .filter((invoice) => invoice.status === "sent")
          .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount.toString()), 0)

        const totalDraft = demoData
          .filter((invoice) => invoice.status === "draft")
          .reduce((sum, invoice) => sum + Number.parseFloat(invoice.amount.toString()), 0)

        setStats({
          totalPaid,
          totalOverdue,
          totalPending,
          totalDraft,
          invoiceCount: demoData.length,
          percentChange: 5.2,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  // Demo data fallback
  const getDemoInvoices = (): Invoice[] => {
    return [
      {
        id: "inv-001",
        tenant_id: "demo-tenant",
        patient_id: "pat-001",
        patient_name: "John Smith",
        amount: 250.0,
        status: "sent",
      },
      {
        id: "inv-002",
        tenant_id: "demo-tenant",
        patient_id: "pat-002",
        patient_name: "Emily Wilson",
        amount: 175.5,
        status: "paid",
      },
      {
        id: "inv-003",
        tenant_id: "demo-tenant",
        patient_id: "pat-003",
        patient_name: "Robert Martin",
        amount: 320.75,
        status: "overdue",
      },
      {
        id: "inv-004",
        tenant_id: "demo-tenant",
        patient_id: "pat-004",
        patient_name: "Sarah Johnson",
        amount: 150.0,
        status: "draft",
      },
      {
        id: "inv-005",
        tenant_id: "demo-tenant",
        patient_id: "pat-005",
        patient_name: "David Taylor",
        amount: 275.25,
        status: "sent",
      },
    ] as Invoice[]
  }

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">Loading stats...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {error && (
        <div className="col-span-full bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-4">
          <p className="text-sm">{error} (Using demo data)</p>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalPaid)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600 flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              {stats.percentChange}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalOverdue)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.invoiceCount > 0
              ? `${Math.round((data.filter((i) => i.status === "overdue").length / stats.invoiceCount) * 100)}% of total invoices`
              : "No invoices"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalPending)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.invoiceCount > 0
              ? `${Math.round((data.filter((i) => i.status === "sent").length / stats.invoiceCount) * 100)}% of total invoices`
              : "No invoices"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Draft</CardTitle>
          <FileText className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalDraft)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.invoiceCount > 0
              ? `${Math.round((data.filter((i) => i.status === "draft").length / stats.invoiceCount) * 100)}% of total invoices`
              : "No invoices"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

