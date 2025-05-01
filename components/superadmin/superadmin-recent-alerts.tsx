import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SuperadminRecentAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>System alerts and notifications requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="24h">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Mark All as Read</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Database CPU Utilization Spike</h4>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Database CPU utilization exceeded 90% for more than 5 minutes. This might indicate a performance issue
                  or inefficient queries.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Storage Space Warning</h4>
                  <span className="text-xs text-muted-foreground">5 hours ago</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Document storage is at 85% capacity. Consider increasing storage allocation or implementing cleanup
                  procedures.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border p-4">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">New Tenant Registration</h4>
                  <span className="text-xs text-muted-foreground">12 hours ago</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  New tenant "MediCare Solutions" has completed registration and is awaiting approval.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">System Backup Completed</h4>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Daily system backup completed successfully. All databases and configuration files were backed up.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
