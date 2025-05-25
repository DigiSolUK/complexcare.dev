"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Activity, Calendar, Eye, FileText, Pill, User, Search } from "lucide-react"
import { getRecentActivities } from "@/lib/services/activity-log-service"

interface ActivityLog {
  id: string
  activity_type: string
  description: string
  created_at: string
  metadata: any
  user_name: string
  patient_name: string
}

export function ActivityLogsContent() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const data = await getRecentActivities(100)
        setActivities(data)
        setFilteredActivities(data)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  useEffect(() => {
    let filtered = activities

    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.user_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((activity) => activity.activity_type === filterType)
    }

    setFilteredActivities(filtered)
  }, [searchTerm, filterType, activities])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "patient_created":
      case "patient_updated":
        return <User className="h-4 w-4" />
      case "patient_viewed":
        return <Eye className="h-4 w-4" />
      case "appointment_created":
      case "appointment_updated":
      case "appointment_cancelled":
        return <Calendar className="h-4 w-4" />
      case "medication_added":
      case "medication_updated":
      case "medication":
        return <Pill className="h-4 w-4" />
      case "clinical_note_created":
      case "clinical_note_updated":
        return <FileText className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    if (type.includes("created")) return "default"
    if (type.includes("updated")) return "secondary"
    if (type.includes("cancelled") || type.includes("deleted")) return "destructive"
    return "outline"
  }

  const stats = {
    total: activities.length,
    today: activities.filter((a) => {
      const today = new Date()
      const activityDate = new Date(a.created_at)
      return activityDate.toDateString() === today.toDateString()
    }).length,
    patients: new Set(activities.map((a) => a.patient_name).filter(Boolean)).size,
    users: new Set(activities.map((a) => a.user_name).filter(Boolean)).size,
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time activities logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activities</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">Activities logged today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patients}</div>
            <p className="text-xs text-muted-foreground">Patients with activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">Users who logged activities</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>View all system activities and audit trail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="patient_viewed">Patient Views</SelectItem>
                <SelectItem value="patient_created">Patient Created</SelectItem>
                <SelectItem value="patient_updated">Patient Updated</SelectItem>
                <SelectItem value="appointment_created">Appointments</SelectItem>
                <SelectItem value="medication">Medications</SelectItem>
                <SelectItem value="clinical_note_created">Clinical Notes</SelectItem>
                <SelectItem value="visit">Visits</SelectItem>
                <SelectItem value="assessment">Assessments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading activities...</div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No activities found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{getActivityIcon(activity.activity_type)}</TableCell>
                      <TableCell className="font-medium">{activity.description}</TableCell>
                      <TableCell>
                        <Badge variant={getActivityBadgeVariant(activity.activity_type)}>
                          {activity.activity_type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{activity.patient_name || "-"}</TableCell>
                      <TableCell>{activity.user_name || "System"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
