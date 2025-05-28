import type { Metadata } from "next"
import { Building2, Users, CheckCircle, Shield } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SuperadminTenantActivity } from "@/components/superadmin/superadmin-tenant-activity"
import { SuperadminSystemHealth } from "@/components/superadmin/superadmin-system-health"
import { SuperadminRecentAlerts } from "@/components/superadmin/superadmin-recent-alerts"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getAllTenants } from "@/lib/actions/tenant-management-actions"
import { getAuth0Users, getAuth0Logs } from "@/lib/actions/auth0-actions"

export const metadata: Metadata = {
  title: "Superadmin Dashboard",
  description: "System-wide administration and monitoring",
}

export default async function SuperadminDashboardPage() {
  // Fetch data for dashboard
  const tenants = await getAllTenants()
  const auth0UsersResponse = await getAuth0Users(0, 1) // Just get count
  const auth0LogsResponse = await getAuth0Logs(0, 5) // Get recent logs

  // Calculate stats
  const activeTenants = tenants.filter((tenant) => tenant.status === "active").length
  const totalUsers = auth0UsersResponse.total || 0
  const recentLogs = auth0LogsResponse.logs || []

  // Calculate security events (failed logins, etc.)
  const securityEvents = recentLogs.filter(
    (log) => log.type.includes("failed") || log.type.includes("limit") || log.type.includes("blocked"),
  ).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Superadmin Dashboard</h1>
          <p className="text-muted-foreground">System-wide administration and monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/superadmin/auth0">Manage Auth0</Link>
          </Button>
          <Button asChild>
            <Link href="/superadmin/create-tenant">Create Tenant</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTenants}</div>
            <p className="text-xs text-muted-foreground">{tenants.length} total tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityEvents}</div>
            <p className="text-xs text-muted-foreground">In the last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Tenant Activity</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <SuperadminTenantActivity />
        </TabsContent>
        <TabsContent value="health">
          <SuperadminSystemHealth />
        </TabsContent>
        <TabsContent value="alerts">
          <SuperadminRecentAlerts />
        </TabsContent>
      </Tabs>
    </div>
  )
}
