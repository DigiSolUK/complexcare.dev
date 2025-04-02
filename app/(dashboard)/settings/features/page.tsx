import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Feature Management",
  description: "Enable or disable features for your organization",
}

// Make this route static
export const dynamic = "force-static"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feature Management</h1>
          <p className="text-muted-foreground">Enable or disable features for your organization</p>
        </div>
      </div>

      <StaticFeaturesUI />
    </div>
  )
}

function StaticFeaturesUI() {
  return (
    <div className="space-y-6">
      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Patient Management</h3>
            <p className="text-sm text-muted-foreground">Core patient record management</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-primary"></div>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Medication Management</h3>
            <p className="text-sm text-muted-foreground">Track and manage patient medications</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-primary"></div>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Care Plan Management</h3>
            <p className="text-sm text-muted-foreground">Create and manage patient care plans</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-primary"></div>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">GP Connect Integration</h3>
            <p className="text-sm text-muted-foreground">Integration with GP Connect for patient records</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-muted"></div>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Advanced Reporting</h3>
            <p className="text-sm text-muted-foreground">Custom and advanced analytics</p>
          </div>
          <div className="h-6 w-11 rounded-full bg-muted"></div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Save Changes</button>
      </div>
    </div>
  )
}

