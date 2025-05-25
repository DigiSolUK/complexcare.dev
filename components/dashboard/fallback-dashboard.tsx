import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export function FallbackDashboard() {
  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/10 dark:border-amber-900/50">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Dashboard Error
          </CardTitle>
          <CardDescription className="text-amber-600 dark:text-amber-500">
            We encountered an issue loading the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700 dark:text-amber-400">
            The dashboard is currently unavailable. This could be due to a temporary issue with the data service or
            connectivity problems. Basic information is displayed below.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-amber-600 font-medium">Limited Functionality</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
