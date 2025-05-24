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
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Invoice[]>([])

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/invoices")
        if (!response.ok) {
          throw new Error(`Failed to fetch invoices: ${response.status} ${response.statusText}`)
        }

        const responseData = await response.json()

        // Ensure data is an array
        if (!Array.isArray(responseData)) {
          console.warn("Expected array of invoices but got:", responseData)
          setData([])
          setStats({
            totalPaid: 0,
            totalOverdue: 0,
            totalPending: 0,
            totalDraft: 0,
            invoiceCount: 0,
            percentChange: 0,
          })
          return
        }

        setData(responseData)

        // Calculate stats safely
        const totalPaid = responseData
          .filter((invoice) => invoice.status === "paid")
          .reduce((sum, invoice) => {
            const amount = Number.parseFloat(invoice.amount?.toString() || "0")
            return sum + (isNaN(amount) ? 0 : amount)
          }, 0)

        const totalOverdue = responseData
          .filter((invoice) => invoice.status === "overdue")
          .reduce((sum, invoice) => {
            const amount = Number.parseFloat(invoice.amount?.toString() || "0")
            return sum + (isNaN(amount) ? 0 : amount)
          }, 0)

        const totalPending = responseData
          .filter((invoice) => invoice.status === "sent")
          .reduce((sum, invoice) => {
            const amount = Number.parseFloat(invoice.amount?.toString() || "0")
            return sum + (isNaN(amount) ? 0 : amount)
          }, 0)

        const totalDraft = responseData
          .filter((invoice) => invoice.status === "draft")
          .reduce((sum, invoice) => {
            const amount = Number.parseFloat(invoice.amount?.toString() || "0")
            return sum + (isNaN(amount) ? 0 : amount)
          }, 0)

        setStats({
          totalPaid,
          totalOverdue,
          totalPending,
          totalDraft,
          invoiceCount: responseData.length,
          percentChange: 5.2, // Example value, would be calculated based on historical data
        })
      } catch (err) {
        console.error("Error fetching invoice stats:", err)
        setError("Failed to load invoice statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
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
          </div>
        </div>
      </div>
    )
  }

  const getPercentage = (status: string) => {
    if (stats.invoiceCount === 0) return 0
    return Math.round((data.filter((i) => i.status === status).length / stats.invoiceCount) * 100)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <p className="text-xs text-muted-foreground">{getPercentage("overdue")}% of total invoices</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalPending)}</div>
          <p className="text-xs text-muted-foreground">{getPercentage("sent")}% of total invoices</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Draft</CardTitle>
          <FileText className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalDraft)}</div>
          <p className="text-xs text-muted-foreground">{getPercentage("draft")}% of total invoices</p>
        </CardContent>
      </Card>
    </div>
  )
}
