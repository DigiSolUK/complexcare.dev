import type { Metadata } from "next"
import { TenantUsersManagement } from "@/components/superadmin/tenant-users-management"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface TenantUsersPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Tenant Users Management",
  description: "Manage users for a specific tenant",
}

async function getTenantDetails(id: string) {
  // In a real application, you would fetch this from your API
  return {
    id,
    name: `Tenant ${id}`,
    domain: `tenant-${id}.example.com`,
  }
}

export default async function TenantUsersPage({ params }: TenantUsersPageProps) {
  const tenant = await getTenantDetails(params.id)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href={`/superadmin/tenants/${params.id}`} className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Tenant Details
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Tenant Users Management</h1>
        <p className="text-muted-foreground mt-1">Manage users for tenant: {tenant.name}</p>
      </div>

      <TenantUsersManagement tenantId={params.id} tenantName={tenant.name} />
    </div>
  )
}
