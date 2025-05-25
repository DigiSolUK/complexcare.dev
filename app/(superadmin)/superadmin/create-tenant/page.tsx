import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TenantCreationForm } from "@/components/superadmin/tenant-creation-form"

export const metadata: Metadata = {
  title: "Create Tenant - Superadmin",
  description: "Create a new tenant organization in the ComplexCare CRM system",
}

export default function CreateTenantPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Tenant</h1>
        <p className="text-muted-foreground">
          Create a new tenant organization with its own isolated environment and Auth0 integration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new tenant. The tenant will be created with its own Auth0 client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantCreationForm />
        </CardContent>
      </Card>
    </div>
  )
}
