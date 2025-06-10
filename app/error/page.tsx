import { getDatabaseInfo } from "@/lib/db-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default async function ErrorPage() {
  const dbInfo = await getDatabaseInfo()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Application Error</CardTitle>
          <CardDescription>Something went wrong while loading the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Database Connection Status</h3>
            <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm">
              <p>
                <span className="font-semibold">Connected:</span>{" "}
                <span className={dbInfo.connected ? "text-green-600" : "text-red-600"}>
                  {dbInfo.connected ? "Yes" : "No"}
                </span>
              </p>
              {dbInfo.connected ? (
                <>
                  <p>
                    <span className="font-semibold">Database:</span> {dbInfo.currentDatabase}
                  </p>
                  <p>
                    <span className="font-semibold">Version:</span> {dbInfo.version}
                  </p>
                </>
              ) : (
                <p>
                  <span className="font-semibold">Error:</span> {dbInfo.error}
                </p>
              )}
            </div>
          </div>

          {dbInfo.missingEnvVars && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Missing Database Configuration</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      The application cannot connect to the database because the connection string is missing or
                      invalid. Please make sure one of the following environment variables is set:
                    </p>
                    <ul className="mt-1 list-disc list-inside">
                      <li>DATABASE_URL</li>
                      <li>POSTGRES_URL</li>
                      <li>production_DATABASE_URL</li>
                      <li>production_POSTGRES_URL</li>
                      <li>AUTH_DATABASE_URL</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium">Troubleshooting Steps</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              <li>Check that your database connection string is correctly set in environment variables</li>
              <li>Verify that your database server is running and accessible</li>
              <li>Check for network connectivity issues</li>
              <li>Review application logs for more detailed error information</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Try Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
