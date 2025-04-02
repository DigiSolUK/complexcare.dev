"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayrollProviderTable } from "@/components/payroll/payroll-provider-table"
import { CreatePayrollProviderDialog } from "@/components/payroll/create-payroll-provider-dialog"

type PayrollProvider = {
  id: string
  name: string
  type: string
  status: string
  [key: string]: any
}

export function PayrollProvidersClient({
  initialProviders = [],
}: {
  initialProviders?: PayrollProvider[]
}) {
  const [providers, setProviders] = useState<PayrollProvider[]>(initialProviders)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredProviders = providers.filter((provider) => {
    if (selectedTab === "active") return provider.status === "active"
    if (selectedTab === "inactive") return provider.status === "inactive"
    return true // "all" tab
  })

  const handleCreateProvider = (newProvider: PayrollProvider) => {
    setProviders((prev) => [...prev, newProvider])
    setCreateDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payroll Providers</CardTitle>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Providers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value={selectedTab}>
            <PayrollProviderTable providers={filteredProviders} />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CreatePayrollProviderDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateProvider}
      />
    </Card>
  )
}

