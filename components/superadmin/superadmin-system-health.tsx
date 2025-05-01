import { Database, Cpu, Network, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function SuperadminSystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Monitor system performance and resource utilization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">CPU Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current</span>
                    <span className="text-sm font-medium">24%</span>
                  </div>
                  <Progress value={24} className="h-2" />
                  <span className="text-xs text-muted-foreground">Peak: 68% (2 hours ago)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Memory Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                  <span className="text-xs text-muted-foreground">16.8 GB of 40 GB used</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Database</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <span className="text-sm font-medium">56%</span>
                  </div>
                  <Progress value={56} className="h-2" />
                  <span className="text-xs text-muted-foreground">112 GB of 200 GB used</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Network</CardTitle>
                  <Network className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Throughput</span>
                    <span className="text-sm font-medium">84 Mbps</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  <span className="text-xs text-muted-foreground">Peak: 210 Mbps (1 hour ago)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Service</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Uptime</th>
                  <th className="p-3 text-left font-medium">Last Checked</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">API Server</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Operational
                    </span>
                  </td>
                  <td className="p-3">99.98% (30d)</td>
                  <td className="p-3">Just now</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View Logs
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Database Cluster</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Operational
                    </span>
                  </td>
                  <td className="p-3">99.99% (30d)</td>
                  <td className="p-3">Just now</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View Logs
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Authentication Service</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Operational
                    </span>
                  </td>
                  <td className="p-3">99.95% (30d)</td>
                  <td className="p-3">Just now</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View Logs
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Storage Service</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Operational
                    </span>
                  </td>
                  <td className="p-3">99.97% (30d)</td>
                  <td className="p-3">Just now</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View Logs
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Background Workers</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Operational
                    </span>
                  </td>
                  <td className="p-3">99.92% (30d)</td>
                  <td className="p-3">Just now</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View Logs
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button>Run System Diagnostics</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
