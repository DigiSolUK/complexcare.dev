"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Calendar,
  Activity,
  ClipboardList,
  AlertTriangle,
  Clock,
  UserCheck,
  FileText,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  PieChart,
  LineChart,
} from "lucide-react"
import { format, parseISO, isToday, isThisWeek } from "date-fns"
import { useRouter } from "next/navigation"
import { SimpleDashboard } from "./simple-dashboard"
import { tryCatch } from "@/lib/error-utils"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart as LineChartComponent } from "@/components/charts/line-chart"
import { PieChart as PieChartComponent } from "@/components/charts/pie-chart"

interface DashboardStats {
  totalPatients: number
  activePatients: number
  criticalPatients: number
  appointmentsToday: number
  appointmentsThisWeek: number
  tasksOverdue: number
  tasksDueToday: number
  completionRate: number
  patientsByStatus: {
    status: string
    count: number
  }[]
  patientsByRisk: {
    risk: string
    count: number
  }[]
  patientsByGender: {
    gender: string
    count: number
  }[]
  patientActivity: {
    date: string
    count: number
  }[]
  recentPatients: {
    id: string
    name: string
    dateOfBirth: string
    status: string
    lastAppointment: string
    avatar?: string
  }[]
  upcomingAppointments: {
    id: string
    patientName: string
    patientId: string
    date: string
    time: string
    type: string
    status: string
    avatar?: string
  }[]
  dueTasks: {
    id: string
    title: string
    dueDate: string
    priority: string
    assignedTo: string
    status: string
  }[]
}

export function EnhancedDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("week")
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/dashboard/stats');
        // const data = await response.json();
        // setStats(data);

        // Mock data for demonstration
        setTimeout(() => {
          try {
            setStats({
              totalPatients: 248,
              activePatients: 187,
              criticalPatients: 12,
              appointmentsToday: 8,
              appointmentsThisWeek: 32,
              tasksOverdue: 5,
              tasksDueToday: 11,
              completionRate: 78,
              patientsByStatus: [
                { status: "Active", count: 187 },
                { status: "Inactive", count: 42 },
                { status: "Critical", count: 12 },
                { status: "Stable", count: 7 },
              ],
              patientsByRisk: [
                { risk: "Low", count: 142 },
                { risk: "Medium", count: 76 },
                { risk: "High", count: 30 },
              ],
              patientsByGender: [
                { gender: "Male", count: 118 },
                { gender: "Female", count: 124 },
                { gender: "Other", count: 6 },
              ],
              patientActivity: [
                { date: "2025-05-18", count: 12 },
                { date: "2025-05-19", count: 18 },
                { date: "2025-05-20", count: 15 },
                { date: "2025-05-21", count: 22 },
                { date: "2025-05-22", count: 19 },
                { date: "2025-05-23", count: 14 },
                { date: "2025-05-24", count: 8 },
              ],
              recentPatients: [
                {
                  id: "pat-1",
                  name: "John Smith",
                  dateOfBirth: "1965-05-15",
                  status: "Active",
                  lastAppointment: "2025-05-20",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                },
                {
                  id: "pat-2",
                  name: "Emily Johnson",
                  dateOfBirth: "1978-11-23",
                  status: "Critical",
                  lastAppointment: "2025-05-22",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  id: "pat-3",
                  name: "Michael Williams",
                  dateOfBirth: "1982-03-08",
                  status: "Stable",
                  lastAppointment: "2025-05-21",
                  avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                },
                {
                  id: "pat-4",
                  name: "Sarah Brown",
                  dateOfBirth: "1970-09-12",
                  status: "Active",
                  lastAppointment: "2025-05-23",
                  avatar: "https://randomuser.me/api/portraits/women/22.jpg",
                },
              ],
              upcomingAppointments: [
                {
                  id: "apt-1",
                  patientName: "John Smith",
                  patientId: "pat-1",
                  date: "2025-05-24",
                  time: "10:00",
                  type: "Check-up",
                  status: "confirmed",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                },
                {
                  id: "apt-2",
                  patientName: "Emily Johnson",
                  patientId: "pat-2",
                  date: "2025-05-24",
                  time: "14:30",
                  type: "Physiotherapy",
                  status: "confirmed",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  id: "apt-3",
                  patientName: "Michael Williams",
                  patientId: "pat-3",
                  date: "2025-05-25",
                  time: "09:15",
                  type: "Follow-up",
                  status: "pending",
                  avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                },
                {
                  id: "apt-4",
                  patientName: "Sarah Brown",
                  patientId: "pat-4",
                  date: "2025-05-25",
                  time: "11:45",
                  type: "Consultation",
                  status: "confirmed",
                  avatar: "https://randomuser.me/api/portraits/women/22.jpg",
                },
              ],
              dueTasks: [
                {
                  id: "task-1",
                  title: "Review medication for John Smith",
                  dueDate: "2025-05-24",
                  priority: "High",
                  assignedTo: "Dr. Sarah Johnson",
                  status: "pending",
                },
                {
                  id: "task-2",
                  title: "Follow up on Emily Johnson's test results",
                  dueDate: "2025-05-24",
                  priority: "Medium",
                  assignedTo: "Dr. Robert Brown",
                  status: "pending",
                },
                {
                  id: "task-3",
                  title: "Update care plan for Michael Williams",
                  dueDate: "2025-05-23",
                  priority: "Low",
                  assignedTo: "James Williams",
                  status: "overdue",
                },
                {
                  id: "task-4",
                  title: "Schedule next appointment for Sarah Brown",
                  dueDate: "2025-05-25",
                  priority: "Medium",
                  assignedTo: "Admin Staff",
                  status: "pending",
                },
              ],
            })
            setLoading(false)
          } catch (err) {
            console.error("Error setting dashboard data:", err)
            setError(err instanceof Error ? err : new Error("Unknown error occurred"))
            setLoading(false)
          }
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error instanceof Error ? error : new Error("Unknown error occurred"))
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "stable":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      if (isToday(date)) {
        return "Today"
      }
      if (isThisWeek(date, { weekStartsOn: 1 })) {
        return format(date, "EEEE")
      }
      return format(date, "MMM d")
    } catch (e) {
      return dateString
    }
  }

  // If there's an error, show the simple dashboard as a fallback
  if (error) {
    console.error("Dashboard error, falling back to simple dashboard:", error)
    return <SimpleDashboard />
  }

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  // Prepare chart data
  const patientStatusData = stats.patientsByStatus.map((item) => ({
    name: item.status,
    value: item.count,
  }))

  const patientRiskData = stats.patientsByRisk.map((item) => ({
    name: item.risk,
    value: item.count,
  }))

  const patientActivityData = stats.patientActivity.map((item) => ({
    name: format(parseISO(item.date), "MMM d"),
    value: item.count,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{stats.totalPatients}</p>
                  <span className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    4%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Active: {stats.activePatients}</span>
                <span>{Math.round((stats.activePatients / stats.totalPatients) * 100)}%</span>
              </div>
              <Progress value={(stats.activePatients / stats.totalPatients) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{stats.appointmentsToday}</p>
                  <span className="text-xs text-muted-foreground">today</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>This week: {stats.appointmentsThisWeek}</span>
                <span>{Math.round((stats.appointmentsToday / stats.appointmentsThisWeek) * 100)}%</span>
              </div>
              <Progress value={(stats.appointmentsToday / stats.appointmentsThisWeek) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{stats.tasksDueToday}</p>
                  <span className="text-xs text-muted-foreground">due today</span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <ClipboardList className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="text-red-600 font-medium">Overdue: {stats.tasksOverdue}</span>
                <span>Completion: {stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Patients</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{stats.criticalPatients}</p>
                  <span className="text-xs text-red-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Attention needed
                  </span>
                </div>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Of total: {stats.totalPatients}</span>
                <span>{Math.round((stats.criticalPatients / stats.totalPatients) * 100)}%</span>
              </div>
              <Progress value={(stats.criticalPatients / stats.totalPatients) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              Today's Appointments
            </CardTitle>
            <CardDescription>{stats.appointmentsToday} appointments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingAppointments
                .filter((apt) => isToday(parseISO(apt.date)))
                .map((appointment) => (
                  <div key={appointment.id} className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary rounded-md p-2 flex flex-col items-center justify-center min-w-[60px]">
                      <span className="text-xs font-medium">{appointment.time.substring(0, 5)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patientName} />
                          <AvatarFallback>{getInitials(appointment.patientName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{appointment.patientName}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}

              {stats.upcomingAppointments.filter((apt) => isToday(parseISO(apt.date))).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">No appointments scheduled for today</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              View All Appointments
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" />
              Tasks Due Soon
            </CardTitle>
            <CardDescription>
              {stats.tasksDueToday} tasks due today, {stats.tasksOverdue} overdue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.dueTasks
                .sort((a, b) => {
                  // Sort by overdue first, then by due date
                  if (a.status === "overdue" && b.status !== "overdue") return -1
                  if (a.status !== "overdue" && b.status === "overdue") return 1
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                })
                .slice(0, 4)
                .map((task) => (
                  <div key={task.id} className="flex items-start gap-4">
                    <div
                      className={`rounded-md p-2 flex flex-col items-center justify-center min-w-[60px] ${
                        task.status === "overdue" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <span className="text-xs font-medium">{formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">Assigned to: {task.assignedTo}</p>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <ClipboardList className="mr-2 h-4 w-4" />
              View All Tasks
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-muted-foreground" />
              Patients by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {tryCatch(
              () => (
                <PieChartComponent data={patientStatusData} colors={["#22c55e", "#94a3b8", "#ef4444", "#3b82f6"]} />
              ),
              <p className="text-red-500">Error rendering chart</p>,
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-muted-foreground" />
              Patients by Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {tryCatch(
              () => (
                <BarChart data={patientRiskData} colors={["#22c55e", "#eab308", "#ef4444"]} />
              ),
              <p className="text-red-500">Error rendering chart</p>,
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-muted-foreground" />
              Patient Activity
            </CardTitle>
            <Tabs defaultValue="week" className="w-full" onValueChange={setTimeframe}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="h-[240px]">
            {tryCatch(
              () => (
                <LineChartComponent data={patientActivityData} colors={["#3b82f6"]} />
              ),
              <p className="text-red-500">Error rendering chart</p>,
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-muted-foreground" />
              Recent Patients
            </CardTitle>
            <CardDescription>Recently updated patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                    <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{patient.name}</h4>
                      <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>DOB: {formatDate(patient.dateOfBirth)}</span>
                      <span>Last seen: {formatDate(patient.lastAppointment)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/patients")}>
              <Users className="mr-2 h-4 w-4" />
              View All Patients
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
              System Activity
            </CardTitle>
            <CardDescription>Recent system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New patient registered</p>
                  <p className="text-sm text-muted-foreground">Robert Thompson was added to the system</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-100 text-green-800 rounded-full p-2">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Appointment completed</p>
                  <p className="text-sm text-muted-foreground">
                    Dr. Sarah Johnson completed appointment with Emily Johnson
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 text-yellow-800 rounded-full p-2">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Medication alert</p>
                  <p className="text-sm text-muted-foreground">Potential interaction detected for John Smith</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 text-purple-800 rounded-full p-2">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Clinical note added</p>
                  <p className="text-sm text-muted-foreground">Dr. Robert Brown added a note for Michael Williams</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Clock className="mr-2 h-4 w-4" />
              View Activity Log
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
