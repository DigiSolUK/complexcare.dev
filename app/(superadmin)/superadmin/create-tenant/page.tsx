import type { Metadata } from "next"
import SuperadminHeader from "@/components/superadmin/superadmin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateTenantForm } from "@/components/superadmin/create-tenant-form"

export const metadata: Metadata = {
  title: "Create Tenant - Superadmin",
  description: "Create a new tenant organization in the ComplexCare CRM system",
}

export default function CreateTenantPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SuperadminHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create New Tenant</h1>
          <p className="text-muted-foreground mb-8">
            Create a new tenant organization with its own isolated environment and admin user.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Tenant Details</CardTitle>
              <CardDescription>
                Fill in the details below to create a new tenant. The tenant will be created with its own subdomain and
                admin user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateTenantForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
