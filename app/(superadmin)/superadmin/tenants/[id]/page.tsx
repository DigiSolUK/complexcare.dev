import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Building, Edit, Users, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getTenantById } from "@/lib/actions/tenant-management-actions"

export const metadata: Metadata = {
  title: "Tenant Details - Superadmin",
  description: "View and manage tenant details",
}

interface TenantDetailPageProps {
  params: {
    id: string
  }
}

export default async function TenantDetailPage({ params }: TenantDetailPageProps) {
  const { id } = params

  try {
    const tenant = await getTenantById(id)

    const getStatusBadge = (status: string) => {
      switch (status) {
        case "active":
          return <Badge variant="success">Active</Badge>
        case "inactive":
          return <Badge variant="secondary">Inactive</Badge>
        case "suspended":
          return <Badge variant="warning">Suspended</Badge>
        case "deleted":
          return <Badge variant="destructive">Deleted</Badge>
        default:
          return <Badge>{status}</Badge>
      }
    }

    const getSubscriptionBadge = (tier: string) => {
      switch (tier) {
        case "free":
          return <Badge variant="outline">Free</Badge>
        case "basic":
          return <Badge variant="default">Basic</Badge>
        case "professional":
          return <Badge variant="secondary">Professional</Badge>
        case "enterprise":
          return <Badge className="bg-purple-600">Enterprise</Badge>
        default:
          return <Badge>{tier}</Badge>
      }
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/superadmin/tenants">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Tenants
              </Link>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/superadmin/tenants/${id}/users`}>
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/superadmin/tenants/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Tenant
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{tenant.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(tenant.status)}
              {getSubscriptionBadge(tenant.subscription_tier)}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Information</CardTitle>
              <CardDescription>Basic information about this tenant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Tenant ID</div>
                  <div className="mt-1">{tenant.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Slug</div>
                  <div className="mt-1">{tenant.slug}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Domain</div>
                  <div className="mt-1">{tenant.domain || "Not set"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Created</div>
                  <div className="mt-1">{format(new Date(tenant.created_at), "PPP")}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auth0 Integration</CardTitle>
              <CardDescription>Auth0 client information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tenant.auth0_client_id ? (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Client ID</div>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">{tenant.auth0_client_id}</code>
                      <Button variant="ghost" size="sm">
                        <Key className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Auth0 Domain</div>
                    <div className="mt-1">{process.env.AUTH0_ISSUER_BASE_URL}</div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No Auth0 client configured for this tenant.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tenant Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">Activity data will be displayed here</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error fetching tenant ${id}:`, error)
    notFound()
  }
}
