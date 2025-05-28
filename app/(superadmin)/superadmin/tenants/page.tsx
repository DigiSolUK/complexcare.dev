import type { Metadata } from "next"
import { TenantTable } from "@/components/superadmin/tenant-table"
import { getAllTenants } from "@/lib/actions/tenant-management-actions"

export const metadata: Metadata = {
  title: "Tenant Management - Superadmin",
  description: "Manage all tenants in the ComplexCare CRM system",
}

export default async function TenantsPage() {
  // Fetch all tenants
  const tenants = await getAllTenants()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
        <p className="text-muted-foreground">Manage all tenants in the ComplexCare CRM system</p>
      </div>

      <TenantTable tenants={tenants} />
    </div>
  )
}
