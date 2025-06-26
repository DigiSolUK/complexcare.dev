import type { Metadata } from "next"
import { TenantManagement } from "@/components/tenant/tenant-management"

export const metadata: Metadata = {
  title: "Tenant Management",
  description: "Manage all tenants in the system",
}

export default function TenantsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
        <p className="text-muted-foreground">Manage all tenants in the system</p>
      </div>

      <TenantManagement />
    </div>
  )
}
