"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { PatientActivityChart } from "@/components/dashboard/patient-activity-chart"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { TasksList } from "@/components/dashboard/tasks-list"
import {
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Pill,
  CreditCard,
  Shield,
  Brain,
  UserCheck,
  Clock,
  FileSpreadsheet,
  BarChart3,
  Settings,
  PlusCircle,
  ArrowRight,
} from "lucide-react"

const quickActions = [
  {
    title: "Add New Patient",
    description: "Register a new patient in the system",
    icon: Users,
    href: "/patients/new",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Schedule Appointment",
    description: "Book a new appointment",
    icon: Calendar,
    href: "/appointments/new",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Create Care Plan",
    description: "Design a new care plan",
    icon: ClipboardList,
    href: "/care-plans/new",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Add Clinical Note",
    description: "Document patient interaction",
    icon: FileText,
    href: "/clinical-notes/new",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

const navigationCards = [
  {
    title: "Patients",
    description: "Manage patient records and information",
    icon: Users,
    href: "/patients",
    stats: "1,234 active",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Care Professionals",
    description: "View and manage care team members",
    icon: UserCheck,
    href: "/care-professionals",
    stats: "67 professionals",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Appointments",
    description: "Schedule and track appointments",
    icon: Calendar,
    href: "/appointments",
    stats: "89 this week",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Clinical Notes",
    description: "Access patient documentation",
    icon: FileText,
    href: "/clinical-notes",
    stats: "456 notes",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Medications",
    description: "Track patient medications",
    icon: Pill,
    href: "/medications",
    stats: "234 prescriptions",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Care Plans",
    description: "Manage patient care plans",
    icon: ClipboardList,
    href: "/care-plans",
    stats: "123 active plans",
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Tasks",
    description: "Track and manage tasks",
    icon: ClipboardList,
    href: "/tasks",
    stats: "45 pending",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Timesheets",
    description: "Manage work hours and schedules",
    icon: Clock,
    href: "/timesheets",
    stats: "This week",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Invoicing",
    description: "Handle billing and payments",
    icon: CreditCard,
    href: "/invoicing",
    stats: "£45,678 pending",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Payroll",
    description: "Process staff payments",
    icon: FileSpreadsheet,
    href: "/payroll/providers",
    stats: "Next run: 5 days",
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Compliance",
    description: "Track regulatory compliance",
    icon: Shield,
    href: "/compliance",
    stats: "98% compliant",
    color: "from-red-500 to-red-600",
  },
  {
    title: "Analytics",
    description: "View reports and insights",
    icon: BarChart3,
    href: "/analytics",
    stats: "12 reports",
    color: "from-violet-500 to-violet-600",
  },
  {
    title: "AI Tools",
    description: "Access AI-powered features",
    icon: Brain,
    href: "/ai-tools",
    stats: "5 tools available",
    color: "from-fuchsia-500 to-fuchsia-600",
  },
  {
    title: "Settings",
    description: "Configure system settings",
    icon: Settings,
    href: "/settings",
    stats: "Manage",
    color: "from-gray-500 to-gray-600",
  },
]

export function DashboardClientPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your ComplexCare CRM dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/reports/new">Generate Report</Link>
          </Button>
          <Button asChild>
            <Link href="/patients/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Patient
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardStats />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div
                        className={`${action.bgColor} ${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Patient Activity</CardTitle>
                <CardDescription>Overview of patient interactions this week</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientActivityChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Latest patient updates</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatients />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Next 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {navigationCards.map((card) => {
              const Icon = card.icon
              return (
                <Link key={card.href} href={card.href}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`bg-gradient-to-br ${card.color} text-white w-12 h-12 rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{card.description}</p>
                      <p className="text-sm font-medium">{card.stats}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New patient registered</p>
                      <p className="text-xs text-muted-foreground">John Doe - 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Care plan updated</p>
                      <p className="text-xs text-muted-foreground">Jane Smith - 15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Appointment scheduled</p>
                      <p className="text-xs text-muted-foreground">Robert Brown - 1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Clinical note added</p>
                      <p className="text-xs text-muted-foreground">Emily Wilson - 2 hours ago</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href="/activity">View all activity</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Important updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Credential expiring soon</p>
                      <p className="text-xs text-muted-foreground">
                        Dr. Sarah Johnson's NMC registration expires in 30 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Compliance review due</p>
                      <p className="text-xs text-muted-foreground">Monthly compliance report due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">System update available</p>
                      <p className="text-xs text-muted-foreground">Version 2.1.0 includes new AI features</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link href="/notifications">View all notifications</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
