import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DatabaseConnectionCheck from "@/components/database-connection-check"

// Loading component for Suspense
function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="animate-pulse bg-gray-200 h-6 w-1/2 rounded"></CardTitle>
        <CardDescription className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
      </CardContent>
    </Card>
  )
}

export default function DatabaseSettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Database Settings</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<LoadingCard />}>
          <DatabaseConnectionCheck />
        </Suspense>

        <Card>
          <CardHeader>
            <CardTitle>Database Information</CardTitle>
            <CardDescription>Information about your NeonDB database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Type:</div>
                <div>PostgreSQL (NeonDB)</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Status:</div>
                <div className="text-green-600">Connected</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Environment:</div>
                <div>Production</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Diagnostics</CardTitle>
            <CardDescription>Run diagnostics on your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Run Schema Validation
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Check Database Performance
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View Database Logs
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
