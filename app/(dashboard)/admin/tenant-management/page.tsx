import type { Metadata } from "next"
import { TenantManagementClient } from "./tenant-management-client"

export const metadata: Metadata = {
  title: "Tenant Management | ComplexCare CRM",
  description: "Manage tenants in the ComplexCare CRM system",
}

export default function TenantManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
        <p className="text-muted-foreground">Create, update, and manage tenant organizations in the system</p>
      </div>

      <TenantManagementClient />
    </div>
  )
}
