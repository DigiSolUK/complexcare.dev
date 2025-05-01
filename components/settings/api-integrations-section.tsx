"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, ExternalLink } from "lucide-react"

export function ApiIntegrationsSection() {
  return (
    <Tabs defaultValue="nmc" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="nmc">NMC PIN Verification</TabsTrigger>
        <TabsTrigger value="dbs">DBS Checks</TabsTrigger>
        <TabsTrigger value="payroll">Payroll</TabsTrigger>
        <TabsTrigger value="other">Other Integrations</TabsTrigger>
      </TabsList>

      <TabsContent value="nmc" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>NMC PIN Verification API</CardTitle>
            <CardDescription>
              Connect to the Nursing and Midwifery Council (NMC) API to verify nurse registration numbers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Integration Information</AlertTitle>
              <AlertDescription>
                The NMC provides an API for verifying the registration status of nurses and midwives. You will need to
                apply for API access through the NMC website.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nmc-api-key">NMC API Key</Label>
                <Input id="nmc-api-key" type="password" placeholder="Enter your NMC API key" />
                <p className="text-sm text-muted-foreground">
                  You can obtain your API key from the{" "}
                  <a
                    href="https://www.nmc.org.uk/registration/employer-confirmations/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    NMC Employer Confirmations service
                  </a>
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nmc-api-secret">NMC API Secret</Label>
                <Input id="nmc-api-secret" type="password" placeholder="Enter your NMC API secret" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="nmc-enabled">Enable NMC Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the system will automatically verify NMC PINs
                  </p>
                </div>
                <Switch id="nmc-enabled" />
              </div>

              <div className="flex justify-end">
                <Button>Save NMC Integration Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Obtain NMC API Access</CardTitle>
            <CardDescription>Follow these steps to get API access for NMC PIN verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Visit the{" "}
                <a
                  href="https://www.nmc.org.uk/registration/employer-confirmations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  NMC Employer Confirmations service
                </a>
              </li>
              <li>Register for an employer account if you don't already have one</li>
              <li>Navigate to the API Access section in your account dashboard</li>
              <li>Complete the API access request form, providing details about your organization</li>
              <li>Accept the terms and conditions for API usage</li>
              <li>Submit your application and wait for approval (typically 5-10 business days)</li>
              <li>Once approved, you will receive your API credentials via email</li>
              <li>Enter these credentials in the form above to enable the integration</li>
            </ol>

            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Visit NMC Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dbs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>DBS Check API</CardTitle>
            <CardDescription>
              Connect to the Disclosure and Barring Service (DBS) API for background checks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Integration Information</AlertTitle>
              <AlertDescription>
                The DBS Update Service allows employers to check the status of an individual's DBS certificate. You will
                need to register as a registered body to access the API.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dbs-client-id">DBS Client ID</Label>
                <Input id="dbs-client-id" placeholder="Enter your DBS client ID" />
                <p className="text-sm text-muted-foreground">
                  You can obtain your client ID from the{" "}
                  <a
                    href="https://www.gov.uk/government/organisations/disclosure-and-barring-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    DBS registered body portal
                  </a>
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dbs-client-secret">DBS Client Secret</Label>
                <Input id="dbs-client-secret" type="password" placeholder="Enter your DBS client secret" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dbs-registered-body-number">Registered Body Number</Label>
                <Input id="dbs-registered-body-number" placeholder="Enter your registered body number" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dbs-enabled">Enable DBS Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the system will automatically verify DBS checks
                  </p>
                </div>
                <Switch id="dbs-enabled" />
              </div>

              <div className="flex justify-end">
                <Button>Save DBS Integration Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Become a DBS Registered Body</CardTitle>
            <CardDescription>Follow these steps to get API access for DBS checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Visit the{" "}
                <a
                  href="https://www.gov.uk/government/organisations/disclosure-and-barring-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  DBS website
                </a>
              </li>
              <li>Apply to become a registered body if you're not already registered</li>
              <li>Complete the registration process and pay any applicable fees</li>
              <li>Once registered, request API access through your registered body portal</li>
              <li>Complete the API integration request form</li>
              <li>Accept the terms and conditions for API usage</li>
              <li>Submit your application and wait for approval</li>
              <li>Once approved, you will receive your API credentials</li>
              <li>Enter these credentials in the form above to enable the integration</li>
            </ol>

            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Visit DBS Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payroll" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payroll API Integration</CardTitle>
            <CardDescription>Connect to payroll services for automated payment processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Integration Information</AlertTitle>
              <AlertDescription>
                ComplexCare CRM supports integration with various payroll providers. Select your provider below and
                configure the integration settings.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="payroll-provider">Payroll Provider</Label>
                <select
                  id="payroll-provider"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a provider</option>
                  <option value="xero">Xero</option>
                  <option value="quickbooks">QuickBooks</option>
                  <option value="sage">Sage</option>
                  <option value="adp">ADP</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payroll-api-key">API Key</Label>
                <Input id="payroll-api-key" type="password" placeholder="Enter your payroll API key" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payroll-api-secret">API Secret</Label>
                <Input id="payroll-api-secret" type="password" placeholder="Enter your payroll API secret" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payroll-webhook-url">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input id="payroll-webhook-url" readOnly value="https://complexcare.uk/api/webhooks/payroll" />
                  <Button variant="outline" className="shrink-0">
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure this URL in your payroll provider's webhook settings
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payroll-enabled">Enable Payroll Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the system will automatically sync with your payroll provider
                  </p>
                </div>
                <Switch id="payroll-enabled" />
              </div>

              <div className="flex justify-end">
                <Button>Save Payroll Integration Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider-Specific Instructions</CardTitle>
            <CardDescription>Follow these steps to set up your payroll integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="xero" className="space-y-4">
              <TabsList>
                <TabsTrigger value="xero">Xero</TabsTrigger>
                <TabsTrigger value="quickbooks">QuickBooks</TabsTrigger>
                <TabsTrigger value="sage">Sage</TabsTrigger>
                <TabsTrigger value="adp">ADP</TabsTrigger>
              </TabsList>

              <TabsContent value="xero" className="space-y-4">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Log in to your Xero account</li>
                  <li>Go to Organization Settings &gt; API Connections</li>
                  <li>Click "Add Application"</li>
                  <li>Enter the required details and redirect URI</li>
                  <li>Grant the necessary permissions for payroll access</li>
                  <li>Copy the client ID and client secret</li>
                  <li>Enter these credentials in the form above</li>
                </ol>

                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Xero Developer Portal
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="quickbooks" className="space-y-4">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Log in to the QuickBooks Developer Portal</li>
                  <li>Create a new app</li>
                  <li>Configure the app settings and redirect URI</li>
                  <li>Request the necessary scopes for payroll access</li>
                  <li>Copy the client ID and client secret</li>
                  <li>Enter these credentials in the form above</li>
                </ol>

                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    QuickBooks Developer Portal
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sage" className="space-y-4">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Log in to the Sage Developer Portal</li>
                  <li>Register a new application</li>
                  <li>Configure the application settings and callback URL</li>
                  <li>Request the necessary permissions for payroll access</li>
                  <li>Copy the client ID and client secret</li>
                  <li>Enter these credentials in the form above</li>
                </ol>

                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Sage Developer Portal
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="adp" className="space-y-4">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Contact your ADP account representative</li>
                  <li>Request API access for your account</li>
                  <li>Complete the API integration request form</li>
                  <li>Wait for approval from ADP</li>
                  <li>Receive your API credentials</li>
                  <li>Enter these credentials in the form above</li>
                </ol>

                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    ADP Developer Portal
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="other" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Other Integrations</CardTitle>
            <CardDescription>Configure additional third-party integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Electronic Health Records (EHR)</h3>
                    <p className="text-sm text-muted-foreground">Connected to NHS Digital Services</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                      <line x1="2" x2="22" y1="10" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Payment Gateway</h3>
                    <p className="text-sm text-muted-foreground">Connected to Stripe</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-600"
                    >
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                      <line x1="4" x2="4" y1="22" y2="15"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Prescription Service</h3>
                    <p className="text-sm text-muted-foreground">Connected to NHS Prescription Service</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-orange-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-600"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      <line x1="3" x2="21" y1="9" y2="9"></line>
                      <line x1="9" x2="9" y1="21" y2="9"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Calendar Integration</h3>
                    <p className="text-sm text-muted-foreground">Connected to Google Calendar</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end">
                <Button variant="outline">Add New Integration</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
