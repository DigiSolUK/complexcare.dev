import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SuperadminTenantActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Activity</CardTitle>
        <CardDescription>Monitor tenant usage and activity across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search tenants..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Export</Button>
              <Button variant="outline">Filter</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Tenant Name</th>
                  <th className="p-3 text-left font-medium">Subscription</th>
                  <th className="p-3 text-left font-medium">Users</th>
                  <th className="p-3 text-left font-medium">Last Activity</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">ComplexCare Medical Group</td>
                  <td className="p-3">Enterprise</td>
                  <td className="p-3">128</td>
                  <td className="p-3">Just now</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Ubercare Health Services</td>
                  <td className="p-3">Professional</td>
                  <td className="p-3">64</td>
                  <td className="p-3">5 minutes ago</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">MediCare Solutions</td>
                  <td className="p-3">Standard</td>
                  <td className="p-3">32</td>
                  <td className="p-3">1 hour ago</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">HealthFirst Clinic</td>
                  <td className="p-3">Professional</td>
                  <td className="p-3">48</td>
                  <td className="p-3">3 hours ago</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">CareConnect Network</td>
                  <td className="p-3">Trial</td>
                  <td className="p-3">12</td>
                  <td className="p-3">1 day ago</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Trial
                    </span>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">WellBeing Healthcare</td>
                  <td className="p-3">Standard</td>
                  <td className="p-3">24</td>
                  <td className="p-3">5 days ago</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Suspended
                    </span>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
