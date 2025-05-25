import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Error Analysis | ComplexCare CRM",
  description: "Analyze and diagnose application errors",
}

export default async function ErrorAnalysisPage() {
  // This page will help diagnose the null type errors

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Error Analysis</h1>
        <p className="text-muted-foreground">Diagnose and analyze application errors</p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Common "Cannot read properties of null" Error</AlertTitle>
        <AlertDescription>
          This error typically occurs when:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Accessing properties on data that hasn't loaded yet</li>
            <li>API responses returning null instead of expected objects</li>
            <li>State being accessed before initialization</li>
            <li>Missing null checks in component props</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Error Diagnostics</CardTitle>
          <CardDescription>Check common sources of null reference errors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Quick Fixes</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Add optional chaining: &lt;code className="bg-muted px-1 rounded"&gt;object?.type&lt;/code&gt;</li>
                <li>
                  Add null checks: &lt;code className="bg-muted px-1 rounded"&gt;if (object && object.type)&lt;/code&gt;
                </li>
                <li>
                  Provide default values: &lt;code className="bg-muted px-1 rounded"&gt;object?.type ||
                  'default'&lt;/code&gt;
                </li>
                <li>
                  Use the safe access utilities: &lt;code className="bg-muted px-1 rounded"&gt;safe(() =&gt;
                  object.type, 'default')&lt;/code&gt;
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">Common Locations</h3>
              <p className="text-sm text-muted-foreground">
                Based on the error pattern, check these files for missing null checks:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>
                  Components that use <code>user.type</code> or <code>session.type</code>
                </li>
                <li>
                  API response handlers that access <code>data.type</code>
                </li>
                <li>Redux/Context state accessors</li>
                <li>Database query result processors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
