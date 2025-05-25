"use client"

import { ApiKeysManagement } from "@/components/settings/api-keys-management"
import { ApiIntegrationsSection } from "@/components/settings/api-integrations-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function IntegrationsClient() {
  const [activeTab, setActiveTab] = useState("api-keys")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Integrations</h1>
        <p className="text-muted-foreground">Manage API keys and integrations for external healthcare services</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integration Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <ApiKeysManagement />
        </TabsContent>

        <TabsContent value="integrations">
          <ApiIntegrationsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
