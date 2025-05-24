import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, ClipboardList, Calendar, Activity, Bell, ArrowRight, PlusCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your ComplexCare CRM dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Care Plans</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">-5.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Care Professionals</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your care team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src="/images/avatars/doctor-1.png" alt="Dr. Smith" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dr. Smith added a new patient</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src="/images/avatars/nurse-1.png" alt="Nurse Johnson" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nurse Johnson updated a care plan</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src="/images/avatars/doctor-2.png" alt="Dr. Williams" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dr. Williams sent a medication reminder</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/patients/new">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
              </Link>
              <Link href="/care-plans/new">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Care Plan
                </Button>
              </Link>
              <Link href="/appointments/new">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </Link>
              <Link href="/reports/new">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Recently added or updated patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src="/images/avatars/patient-1.png" alt="John Doe" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Added today</p>
                  </div>
                </div>
                <Link href="/patients/1">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src="/images/avatars/patient-2.png" alt="Jane Smith" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jane Smith</p>
                    <p className="text-xs text-muted-foreground">Updated yesterday</p>
                  </div>
                </div>
                <Link href="/patients/2">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src="/images/avatars/patient-3.png" alt="Robert Johnson" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Robert Johnson</p>
                    <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                  </div>
                </div>
                <Link href="/patients/3">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled for the next 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">John Doe - Check-up</p>
                    <p className="text-xs font-medium text-primary">09:00 AM</p>
                  </div>
                  <p className="text-xs text-muted-foreground">With Dr. Smith</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Jane Smith - Therapy</p>
                    <p className="text-xs font-medium text-primary">11:30 AM</p>
                  </div>
                  <p className="text-xs text-muted-foreground">With Dr. Williams</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Robert Johnson - Review</p>
                    <p className="text-xs font-medium text-primary">02:15 PM</p>
                  </div>
                  <p className="text-xs text-muted-foreground">With Nurse Johnson</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
