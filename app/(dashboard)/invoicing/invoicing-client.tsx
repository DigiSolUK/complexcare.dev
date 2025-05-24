"use client"

import { useState } from "react"
import { PlusCircle, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { InvoiceTable } from "@/components/invoicing/invoice-table"
import { CreateInvoiceDialog } from "@/components/invoicing/create-invoice-dialog"
import { InvoiceStats } from "@/components/invoicing/invoice-stats"
import { ErrorBoundary } from "@/components/error-boundaries"

export default function InvoicingClient() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchQuery("") // Reset search when changing tabs
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoicing</h1>
          <p className="text-muted-foreground">Manage invoices and billing for your clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <ErrorBoundary fallback={<div className="p-4 bg-red-50 rounded-md">Error loading invoice statistics</div>}>
        <InvoiceStats />
      </ErrorBoundary>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>View and manage all your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input
                  placeholder="Search invoices..."
                  className="max-w-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <ErrorBoundary fallback={<div className="p-4 bg-red-50 rounded-md">Error loading invoices</div>}>
                <InvoiceTable filter="all" searchQuery={searchQuery} />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Draft Invoices</CardTitle>
              <CardDescription>Invoices that have not been sent yet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input
                  placeholder="Search draft invoices..."
                  className="max-w-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <ErrorBoundary fallback={<div className="p-4 bg-red-50 rounded-md">Error loading invoices</div>}>
                <InvoiceTable filter="draft" searchQuery={searchQuery} />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Sent Invoices</CardTitle>
              <CardDescription>Invoices that have been sent to clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input
                  placeholder="Search sent invoices..."
                  className="max-w-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <ErrorBoundary fallback={<div className="p-4 bg-red-50 rounded-md">Error loading invoices</div>}>
                <InvoiceTable filter="sent" searchQuery={searchQuery} />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Paid Invoices</CardTitle>
              <CardDescription>Invoices that have been paid by clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input
                  placeholder="Search paid invoices..."
                  className="max-w-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <ErrorBoundary fallback={<div className="p-4 bg-red-50 rounded-md">Error loading invoices</div>}>
                <InvoiceTable filter="paid" searchQuery={searchQuery} />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Overdue Invoices</CardTitle>
              <CardDescription>Invoices that are past their due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input
                  placeholder="Search overdue invoices..."
                  className="max-w-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <ErrorBoundary fallback={<div className="p-4 bg-red-50 rounded-md">Error loading invoices</div>}>
                <InvoiceTable filter="overdue" searchQuery={searchQuery} />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateInvoiceDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
