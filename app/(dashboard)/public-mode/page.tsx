import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PublicModePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Public Mode Documentation</h1>

      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Public Mode Active</AlertTitle>
        <AlertDescription>
          The system is running in public mode. All features are accessible without authentication. Data changes will
          not be persisted to the database.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What is Public Mode?</CardTitle>
            <CardDescription>Understanding how public mode works</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Public Mode is a special operating mode of the ComplexCare CRM that allows all features to be accessible
              without authentication. This is useful for development, testing, and demonstration purposes.
            </p>
            <p>In Public Mode:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>No authentication is required to access any part of the system</li>
              <li>A default tenant and user are automatically provided</li>
              <li>Mock data is used instead of real database data</li>
              <li>Changes are not persisted to the database</li>
              <li>All API endpoints are accessible without authentication</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <CardDescription>What you can do in public mode</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">All features of the ComplexCare CRM are available in public mode:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Patient management</li>
              <li>Care professional management</li>
              <li>Appointment scheduling</li>
              <li>Clinical notes</li>
              <li>Task management</li>
              <li>Reporting and analytics</li>
              <li>Multi-tenant functionality</li>
              <li>API access</li>
            </ul>
            <div className="mt-6">
              <Link href="/api-docs">
                <Button variant="outline">View API Documentation</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
            <CardDescription>How public mode is implemented</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Public Mode is implemented through several key components:</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">1. Authentication Bypass</h3>
            <p className="mb-2">All authentication checks are bypassed, and a default user is provided.</p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`// Authentication bypass
export function AuthCheck({ children }: { children: React.ReactNode }) {
  // In public mode, we allow all access
  return <>{children}</>
}`}
            </pre>

            <h3 className="text-lg font-semibold mt-4 mb-2">2. Mock Data</h3>
            <p className="mb-2">Instead of querying the real database, mock data is provided for all entities.</p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`// Mock data example
export const mockData = {
  patients: [
    {
      id: "p1",
      tenant_id: "tenant-1",
      first_name: "John",
      last_name: "Doe",
      // ...other fields
    },
    // ...more patients
  ],
  // ...other entities
}`}
            </pre>

            <h3 className="text-lg font-semibold mt-4 mb-2">3. Tenant Context</h3>
            <p className="mb-2">The tenant context is still maintained, but with mock tenants.</p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`// Mock tenants
const mockTenants: Tenant[] = [
  { id: "tenant-1", name: "Main Hospital", slug: "main-hospital", plan: "Enterprise" },
  { id: "tenant-2", name: "North Clinic", slug: "north-clinic", plan: "Professional" },
  // ...more tenants
]`}
            </pre>

            <div className="mt-6 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              <p className="text-sm text-gray-600">
                Public Mode is intended for development and demonstration purposes only. In a production environment,
                proper authentication and authorization should be implemented.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
