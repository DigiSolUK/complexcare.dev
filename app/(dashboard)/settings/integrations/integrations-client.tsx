"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WearableIntegrationSettings } from "@/components/integrations/wearable-integration-settings"
import { Office365IntegrationSettings } from "@/components/integrations/office365-integration-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function IntegrationsClient() {
  const [activeTab, setActiveTab] = useState("wearables")

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Integration Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure external integrations to enhance your ComplexCare experience
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Integration Security</AlertTitle>
        <AlertDescription>
          All API keys and credentials are encrypted before being stored. Each tenant must provide their own API
          credentials for these integrations to work.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="wearables" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="wearables">Wearable Devices</TabsTrigger>
          <TabsTrigger value="office365">Office 365</TabsTrigger>
          <TabsTrigger value="other">Other Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="wearables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wearable Device Integrations</CardTitle>
              <CardDescription>
                Connect to various wearable device platforms to monitor patient health metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WearableIntegrationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="office365" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Office 365 Integration</CardTitle>
              <CardDescription>
                Connect to Microsoft Office 365 to sync emails, calendar events, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Office365IntegrationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Other Integrations</CardTitle>
              <CardDescription>Additional third-party integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Coming Soon</AlertTitle>
                  <AlertDescription>
                    Additional integrations are currently in development and will be available soon.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
