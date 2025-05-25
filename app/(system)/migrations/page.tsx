import { PageHeader } from "@/components/page-header"
import { MigrationManagementPanel } from "@/components/admin/migration-management-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function MigrationsPage() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading="Database Migrations"
        text="Manage database schema changes with version control and rollback capabilities"
      />

      <div className="grid gap-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Migration Best Practices</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Always test migrations in a development environment first</li>
              <li>Use dry run mode to preview changes before applying them</li>
              <li>Take a database backup before running migrations in production</li>
              <li>Review migration files for potential data loss before execution</li>
            </ul>
          </AlertDescription>
        </Alert>

        <MigrationManagementPanel />

        <Card>
          <CardHeader>
            <CardTitle>Migration Commands</CardTitle>
            <CardDescription>CLI commands for managing migrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <code className="bg-muted px-2 py-1 rounded text-sm">npm run migrate:create [name]</code>
                <p className="text-sm text-muted-foreground mt-1">Create a new migration file</p>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded text-sm">npm run migrate:up</code>
                <p className="text-sm text-muted-foreground mt-1">Run all pending migrations</p>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded text-sm">npm run migrate:down</code>
                <p className="text-sm text-muted-foreground mt-1">Rollback the last migration</p>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded text-sm">npm run migrate:status</code>
                <p className="text-sm text-muted-foreground mt-1">Show migration status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
