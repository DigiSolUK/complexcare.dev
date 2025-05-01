"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Search, ArrowUpDown, CheckCircle, AlertCircle } from "lucide-react"
import { BarChart } from "@/components/charts"
import { useToast } from "@/hooks/use-toast"

type Invoice = {
  id: string
  tenantId: string
  tenantName: string
  amount: number
  status: "paid" | "pending" | "overdue"
  date: string
  dueDate: string
}

type Plan = {
  id: string
  name: string
  price: number
  billingCycle: "monthly" | "annual"
  features: string[]
}

export function BillingManagement() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("invoices")
  const [searchQuery, setSearchQuery] = useState("")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would fetch from your API
      // For now, we'll simulate with mock data
      setTimeout(() => {
        const mockInvoices: Invoice[] = [
          {
            id: "INV-001",
            tenantId: "ba367cfe-6de0-4180-9566-1002b75cf82c",
            tenantName: "Default Tenant",
            amount: 499.99,
            status: "paid",
            date: "2023-05-01T00:00:00Z",
            dueDate: "2023-05-15T00:00:00Z",
          },
          {
            id: "INV-002",
            tenantId: "7f8d9e2a-1b3c-4d5e-6f7g-8h9i0j1k2l3m",
            tenantName: "North London Care",
            amount: 299.99,
            status: "paid",
            date: "2023-05-01T00:00:00Z",
            dueDate: "2023-05-15T00:00:00Z",
          },
          {
            id: "INV-003",
            tenantId: "3e4r5t6y-7u8i-9o0p-a1s2-d3f4g5h6j7k8",
            tenantName: "Manchester Health Partners",
            amount: 99.99,
            status: "pending",
            date: "2023-06-01T00:00:00Z",
            dueDate: "2023-06-15T00:00:00Z",
          },
          {
            id: "INV-004",
            tenantId: "9z8y7x6w-5v4u-3t2s-1r0q-p9o8n7m6l5k4",
            tenantName: "Birmingham Care Services",
            amount: 299.99,
            status: "overdue",
            date: "2023-04-01T00:00:00Z",
            dueDate: "2023-04-15T00:00:00Z",
          },
          {
            id: "INV-005",
            tenantId: "2b3n4m5k-6j7h-8g9f-0d1s-a2p3o4i5u6y7",
            tenantName: "Edinburgh Health Network",
            amount: 499.99,
            status: "paid",
            date: "2023-05-01T00:00:00Z",
            dueDate: "2023-05-15T00:00:00Z",
          },
        ]

        const mockPlans: Plan[] = [
          {
            id: "basic",
            name: "Basic",
            price: 99.99,
            billingCycle: "monthly",
            features: ["Up to 10 users", "Basic patient management", "Standard reports", "Email support"],
          },
          {
            id: "professional",
            name: "Professional",
            price: 299.99,
            billingCycle: "monthly",
            features: [
              "Up to 50 users",
              "Advanced patient management",
              "Custom reports",
              "Priority email support",
              "Basic AI tools",
            ],
          },
          {
            id: "enterprise",
            name: "Enterprise",
            price: 499.99,
            billingCycle: "monthly",
            features: [
              "Unlimited users",
              "Complete patient management suite",
              "Advanced analytics and reporting",
              "24/7 phone and email support",
              "Full AI tools suite",
              "Custom integrations",
            ],
          },
        ]

        const mockRevenueData = [
          { name: "Jan", value: 2500 },
          { name: "Feb", value: 3200 },
          { name: "Mar", value: 3100 },
          { name: "Apr", value: 3800 },
          { name: "May", value: 4200 },
          { name: "Jun", value: 4100 },
        ]

        setInvoices(mockInvoices)
        setPlans(plans)
        setRevenueData(mockRevenueData)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching billing data:", error)
      toast({
        title: "Error",
        description: "Failed to load billing data. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Overdue</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Manage and view all tenant invoices</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search invoices..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center">
                          Invoice
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No invoices found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.tenantName}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For small care providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  £99.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Up to 10 users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic patient management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Standard reports</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-gray-300" />
                    <span className="text-muted-foreground">AI tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Professional</CardTitle>
                  <Badge>Popular</Badge>
                </div>
                <CardDescription>For medium-sized organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  £299.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Up to 50 users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced patient management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom reports</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic AI tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large healthcare networks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  £499.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Complete patient management suite</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced analytics and reporting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>24/7 phone and email support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Full AI tools suite</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue from all tenant subscriptions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <BarChart
                  data={revenueData}
                  xAxisKey="name"
                  yAxisKey="value"
                  categories={["value"]}
                  colors={["#0ea5e9"]}
                  valueFormatter={(value) => `£${value}`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
