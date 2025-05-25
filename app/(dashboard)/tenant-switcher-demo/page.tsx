import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TenantSwitcher } from "@/components/tenant/tenant-switcher"
import { TenantSwitcherCompact } from "@/components/tenant/tenant-switcher-compact"
import { ResponsiveTenantSwitcher } from "@/components/tenant/responsive-tenant-switcher"

export default function TenantSwitcherDemo() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Tenant Switcher Components</h1>

      <Card>
        <CardHeader>
          <CardTitle>Standard Tenant Switcher</CardTitle>
          <CardDescription>
            Full-featured tenant switcher with tenant name, plan badge, and search functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <TenantSwitcher />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compact Tenant Switcher</CardTitle>
          <CardDescription>Space-efficient tenant switcher for mobile or constrained layouts.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <TenantSwitcherCompact />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responsive Tenant Switcher</CardTitle>
          <CardDescription>Automatically switches between standard and compact based on screen size.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveTenantSwitcher />
        </CardContent>
      </Card>
    </div>
  )
}
