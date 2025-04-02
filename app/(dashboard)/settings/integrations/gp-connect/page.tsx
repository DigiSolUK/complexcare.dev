import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GPConnectSettingsForm } from "@/components/settings/gp-connect-settings-form"
import { GPConnectTestConnection } from "@/components/settings/gp-connect-test-connection"

export default function GPConnectSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">GP Connect Integration</h1>
        <p className="text-muted-foreground">Configure the integration with NHS GP Connect to access patient records</p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>GP Connect Configuration</CardTitle>
              <CardDescription>Enter your GP Connect API credentials and configuration settings</CardDescription>
            </CardHeader>
            <CardContent>
              <GPConnectSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>Test Connection</CardTitle>
              <CardDescription>Test your GP Connect integration with a sample patient NHS number</CardDescription>
            </CardHeader>
            <CardContent>
              <GPConnectTestConnection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>About GP Connect</CardTitle>
          <CardDescription>Information about the NHS GP Connect service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            GP Connect is an NHS Digital programme that enables different healthcare systems to communicate securely. It
            allows authorized staff at your organization to view GP practice clinical information and data.
          </p>

          <div>
            <h3 className="font-medium mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Access to structured patient records</li>
              <li>View medications, allergies, and adverse reactions</li>
              <li>Access to consultation notes and problems</li>
              <li>View patient appointments</li>
              <li>Secure, standards-based access</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Implementation Resources:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <a
                  href="https://digital.nhs.uk/services/gp-connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  NHS Digital GP Connect Service
                </a>
              </li>
              <li>
                <a
                  href="https://developer.nhs.uk/apis/gpconnect-1-6-0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GP Connect API Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://gpconnect.github.io/gpconnect-demonstrator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GP Connect Demonstrator
                </a>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

