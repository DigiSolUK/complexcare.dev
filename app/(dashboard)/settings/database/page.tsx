import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RunMigrationButton } from "@/components/admin/run-migration-button"
import { requirePermission } from "@/lib/auth/require-permission"
import { AlertTriangle } from "lucide-react"

export default async function DatabaseSettingsPage() {
  // Check if user has admin permissions
  const permissionCheck = await requirePermission(["admin", "superadmin"])

  if (!permissionCheck.success) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>You do not have permission to access database settings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <PageHeader heading="Database Settings" text="Manage database configuration and run migrations" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Migrations</CardTitle>
            <CardDescription>Run database migrations to update the schema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Migration Information</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        This will add the missing <code>compliance_status</code> column to the credentials table. This
                        migration is safe to run multiple times and will not affect existing data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <RunMigrationButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
