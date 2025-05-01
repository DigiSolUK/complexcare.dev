"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiKeysSection } from "@/components/settings/api-keys-section"
import { ApiIntegrationsSection } from "@/components/settings/api-integrations-section"
import { ApiDocsSection } from "@/components/settings/api-docs-section"

export function ApiSettingsClient() {
  const [activeTab, setActiveTab] = useState("keys")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Settings</h1>
        <p className="text-muted-foreground">Manage API keys and external service integrations</p>
      </div>

      <Tabs defaultValue="keys" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="mt-6">
          <ApiKeysSection />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <ApiIntegrationsSection />
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <ApiDocsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
