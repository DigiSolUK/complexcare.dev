"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function ApiDocsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Learn how to integrate with external services and APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dbs">
            <TabsList className="mb-4">
              <TabsTrigger value="dbs">DBS Check API</TabsTrigger>
              <TabsTrigger value="nmc">NMC Register API</TabsTrigger>
              <TabsTrigger value="payroll">Payroll API</TabsTrigger>
            </TabsList>

            <TabsContent value="dbs">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">DBS Check API Integration</h3>
                <p>
                  The Disclosure and Barring Service (DBS) API allows you to verify staff criminal record checks
                  directly from your ComplexCare CRM system.
                </p>

                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Registration Required</AlertTitle>
                  <AlertDescription>
                    You must register with the DBS API Gateway to obtain API credentials.
                  </AlertDescription>
                </Alert>

                <h4 className="font-medium mt-6">How to obtain DBS API keys:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Visit the{" "}
                    <a
                      href="https://www.gov.uk/government/organisations/disclosure-and-barring-service"
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DBS website
                    </a>
                  </li>
                  <li>Navigate to the "For Organizations" section</li>
                  <li>Complete the "API Access Request Form"</li>
                  <li>Submit your organization details and intended use case</li>
                  <li>Once approved, you'll receive your API credentials via email</li>
                  <li>Enter these credentials in the "API Keys" section of this page</li>
                </ol>

                <h4 className="font-medium mt-6">API Capabilities:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Verify DBS certificate numbers</li>
                  <li>Check certificate issue dates</li>
                  <li>Validate certificate authenticity</li>
                  <li>Receive notifications for certificate updates</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="nmc">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">NMC Register API Integration</h3>
                <p>
                  The Nursing and Midwifery Council (NMC) API allows you to verify nursing staff credentials and
                  registration status directly from your ComplexCare CRM.
                </p>

                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Registration Required</AlertTitle>
                  <AlertDescription>
                    You must register with the NMC Developer Portal to obtain API credentials.
                  </AlertDescription>
                </Alert>

                <h4 className="font-medium mt-6">How to obtain NMC API keys:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Visit the{" "}
                    <a
                      href="https://www.nmc.org.uk/"
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      NMC website
                    </a>
                  </li>
                  <li>Navigate to the "Employers" section</li>
                  <li>Register for the "NMC API Developer Program"</li>
                  <li>Complete the verification process for your organization</li>
                  <li>Once approved, you'll receive your API credentials</li>
                  <li>Enter these credentials in the "API Keys" section of this page</li>
                </ol>

                <h4 className="font-medium mt-6">API Capabilities:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Verify NMC PIN numbers</li>
                  <li>Check registration status and expiry dates</li>
                  <li>View specialties and qualifications</li>
                  <li>Set up alerts for registration changes</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="payroll">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payroll API Integration</h3>
                <p>
                  The Payroll API allows you to connect your ComplexCare CRM with popular payroll providers to
                  streamline staff payment processing.
                </p>

                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Multiple Providers Supported</AlertTitle>
                  <AlertDescription>
                    We support integration with multiple payroll providers including Sage, Xero, and QuickBooks.
                  </AlertDescription>
                </Alert>

                <h4 className="font-medium mt-6">How to obtain Payroll API keys:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Log in to your payroll provider's account</li>
                  <li>Navigate to the "Developer" or "API" section</li>
                  <li>Create a new application or integration</li>
                  <li>
                    Set the redirect URL to:{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">
                      https://your-domain.complexcare.dev/api/callback
                    </code>
                  </li>
                  <li>Request the necessary permissions (timesheet data, payment processing)</li>
                  <li>Save your client ID and secret</li>
                  <li>Enter these credentials in the "API Keys" section of this page</li>
                </ol>

                <h4 className="font-medium mt-6">API Capabilities:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Sync timesheet data to payroll</li>
                  <li>Process payments based on approved timesheets</li>
                  <li>Generate payslips and payment records</li>
                  <li>Track payment history and tax information</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
