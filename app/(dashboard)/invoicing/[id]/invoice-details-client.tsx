"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { InvoiceDetails } from "@/components/invoicing/invoice-details"
import { InvoiceItemsTable } from "@/components/invoicing/invoice-items-table"
import { InvoiceStatusUpdate } from "@/components/invoicing/invoice-status-update"
import { InvoiceActions } from "@/components/invoicing/invoice-actions"
import { InvoicePaymentHistory } from "@/components/invoicing/invoice-payment-history"
import { toast } from "@/components/ui/use-toast"

interface Invoice {
  id: string
  invoice_number: string
  client_name: string
  client_email: string
  amount: number
  status: string
  issue_date: string
  due_date: string
  items?: Array<{
    id: string
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
  payments?: Array<{
    id: string
    date: string
    amount: number
    method: string
    reference: string
  }>
}

export function InvoiceDetailsClient({ invoiceId }: { invoiceId: string }) {
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInvoice() {
      try {
        setLoading(true)
        const response = await fetch(`/api/invoices/${invoiceId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch invoice: ${response.statusText}`)
        }

        const data = await response.json()
        setInvoice(data)
      } catch (err) {
        console.error("Error fetching invoice:", err)
        setError("Failed to load invoice details. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load invoice details",
          variant: "destructive",
        })

        // Create mock data for demo purposes
        setInvoice({
          id: invoiceId,
          invoice_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          client_name: "Demo Client",
          client_email: "client@example.com",
          amount: 1250.0,
          status: "pending",
          issue_date: new Date().toISOString().split("T")[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          items: [
            {
              id: "item-1",
              description: "Care Services - Standard",
              quantity: 10,
              unit_price: 100,
              total: 1000,
            },
            {
              id: "item-2",
              description: "Equipment Rental",
              quantity: 1,
              unit_price: 250,
              total: 250,
            },
          ],
          payments: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [invoiceId])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!invoice) return

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`)
      }

      const updatedInvoice = await response.json()
      setInvoice(updatedInvoice)

      toast({
        title: "Status Updated",
        description: `Invoice status changed to ${newStatus}`,
      })
    } catch (err) {
      console.error("Error updating invoice status:", err)
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !invoice) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-red-500 mb-4 text-xl">Error Loading Invoice</div>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => router.push("/invoicing")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invoice) return null

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/invoicing")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoice_number}</h1>
        </div>
        <InvoiceActions invoice={invoice} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>View and manage invoice information</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceDetails invoice={invoice} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
              <CardDescription>Products and services included in this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceItemsTable items={invoice.items || []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of payments for this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoicePaymentHistory invoice={invoice} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Update invoice status</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceStatusUpdate invoice={invoice} onStatusChange={handleStatusUpdate} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
              <CardDescription>Financial summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">£{(invoice.amount * 0.8).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (20%)</span>
                <span className="font-medium">£{(invoice.amount * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span className="font-medium">£0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>£{Number.parseFloat(invoice.amount.toString()).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm">
                <span>Amount Paid</span>
                <span className="font-medium">
                  £{invoice.status === "paid" ? Number.parseFloat(invoice.amount.toString()).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Balance Due</span>
                <span className={invoice.status === "paid" ? "text-green-600" : ""}>
                  £{invoice.status === "paid" ? "0.00" : Number.parseFloat(invoice.amount.toString()).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
