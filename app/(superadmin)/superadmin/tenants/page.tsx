import { TenantManagementPanel } from "@/components/superadmin/tenant-management-panel"

export default function TenantsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
        <p className="text-muted-foreground">Create and manage tenants in the ComplexCare CRM system</p>
      </div>

      <TenantManagementPanel />
    </div>
  )
}
