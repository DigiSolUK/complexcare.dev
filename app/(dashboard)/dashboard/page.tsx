import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Calendar, FileText, ClipboardList, Stethoscope } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clinical Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>

        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Recently added or updated patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">Diabetes Type 2</p>
                </div>
                <Link href="/patients/p1">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Hypertension</p>
                </div>
                <Link href="/patients/p2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Robert Johnson</p>
                  <p className="text-sm text-muted-foreground">Asthma</p>
                </div>
                <Link href="/patients/p3">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - Dr. Wilson</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Confirmed</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sarah Williams</p>
                  <p className="text-sm text-muted-foreground">11:30 AM - Nurse Johnson</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Confirmed</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Michael Brown</p>
                  <p className="text-sm text-muted-foreground">2:15 PM - Dr. Wilson</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Pending</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Link href="/patients/new">
                <Button className="w-full">Add New Patient</Button>
              </Link>
              <Link href="/appointments/new">
                <Button variant="outline" className="w-full">
                  Schedule Appointment
                </Button>
              </Link>
              <Link href="/clinical-notes/new">
                <Button variant="outline" className="w-full">
                  Create Clinical Note
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Clinical Notes</CardTitle>
            <CardDescription>Latest clinical documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">Initial Assessment - John Doe</p>
                </div>
                <p className="text-sm mt-2">
                  Patient presents with elevated blood glucose levels. Recommended dietary changes and increased
                  physical activity.
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">Dr. Wilson - 2 days ago</p>
                  <Link href="/clinical-notes/cn1">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                  <p className="font-medium">Blood Pressure Check - Jane Smith</p>
                </div>
                <p className="text-sm mt-2">
                  Blood pressure reading: 140/90 mmHg. Slightly elevated. Recommended stress reduction techniques and
                  follow-up in 2 weeks.
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">Nurse Johnson - 3 days ago</p>
                  <Link href="/clinical-notes/cn2">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
