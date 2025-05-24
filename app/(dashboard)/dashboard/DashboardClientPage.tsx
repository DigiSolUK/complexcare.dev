"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { PatientActivityChart } from "@/components/dashboard/patient-activity-chart"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { TasksList } from "@/components/dashboard/tasks-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
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
import { getDashboardData, type DashboardData } from "@/lib/actions/dashboard-actions"

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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardData()
      setDashboardData(data)
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your ComplexCare CRM dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            dashboardData && <DashboardStats data={dashboardData} />
          )}

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
                <RecentPatients patients={dashboardData?.recentPatients} isLoading={loading} />
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
                <UpcomingAppointments appointments={dashboardData?.upcomingAppointments} isLoading={loading} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksList tasks={dashboardData?.pendingTasks} isLoading={loading} />
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
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentActivity.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user} - {formatActivityTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  </div>
                )}
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
                  {dashboardData?.certificationsExpiring ? (
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Credentials expiring soon</p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.certificationsExpiring} certifications expire in the next 30 days
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {dashboardData?.carePlansReview ? (
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Care plans need review</p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.carePlansReview} care plans require review
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {dashboardData?.overduePayments ? (
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Overdue payments</p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.overduePayments} payments are overdue
                        </p>
                      </div>
                    </div>
                  ) : null}
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

function getActivityColor(type: string): string {
  switch (type) {
    case "patient":
      return "bg-blue-500"
    case "appointment":
      return "bg-green-500"
    case "task":
      return "bg-yellow-500"
    case "note":
      return "bg-purple-500"
    case "medication":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function formatActivityTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
}
