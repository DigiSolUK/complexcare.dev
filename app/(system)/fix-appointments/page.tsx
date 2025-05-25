import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RunDurationMigrationButton } from "@/components/admin/run-duration-migration-button"

export default function FixAppointmentsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Fix Appointments Table</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Duration Column to Appointments</CardTitle>
          <CardDescription>
            This will add the missing duration column to the appointments table, fixing the dashboard error.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The dashboard is currently showing an error because it's trying to access a <code>duration</code> column
              that doesn't exist in the appointments table. This migration will add that column with a default value of
              30 minutes.
            </p>

            <div className="bg-muted p-4 rounded-md">
              <p className="font-mono text-sm">Error: column a.duration does not exist</p>
            </div>

            <RunDurationMigrationButton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
