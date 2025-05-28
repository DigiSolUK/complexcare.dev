import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, ClipboardList } from "lucide-react"

export const metadata = {
  title: "Dashboard | ComplexCare CRM",
  description: "View your key metrics and performance indicators",
}

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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 remaining</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clinical Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 high priority</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">Diabetes Type 2</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-muted-foreground">Hypertension</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Robert Johnson</p>
                <p className="text-sm text-muted-foreground">Asthma</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">10:00 AM - Dr. Wilson</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Sarah Williams</p>
                <p className="text-sm text-muted-foreground">11:30 AM - Nurse Johnson</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Michael Brown</p>
                <p className="text-sm text-muted-foreground">2:15 PM - Dr. Wilson</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
