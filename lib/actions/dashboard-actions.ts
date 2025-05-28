"use server"
import { getCurrentTenant } from "@/lib/tenant-utils"

export interface DashboardData {
  stats: {
    totalPatients: number
    activePatients: number
    appointmentsToday: number
    pendingTasks: number
  }
  recentPatients: Array<{
    id: string
    name: string
    dateOfBirth: string
    status: string
    lastAppointment: string
    avatar?: string
  }>
  upcomingAppointments: Array<{
    id: string
    patientName: string
    patientId: string
    date: string
    time: string
    type: string
    status: string
    avatar?: string
  }>
  pendingTasks: Array<{
    id: string
    title: string
    dueDate: string
    priority: string
    assignedTo: string
    status: string
  }>
}

export async function getDashboardData(): Promise<DashboardData> {
  const tenantId = await getCurrentTenant()

  try {
    // In a real app, these would be actual database queries
    // For now, we'll return mock data
    return {
      stats: {
        totalPatients: 248,
        activePatients: 187,
        appointmentsToday: 8,
        pendingTasks: 16,
      },
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
      pendingTasks: [
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
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to fetch dashboard data")
  }
}

export async function getPatientActivityData() {
  const tenantId = await getCurrentTenant()

  try {
    // In a real app, this would be an actual database query
    // For now, we'll return mock data
    return [
      { date: "2025-05-18", visits: 12, assessments: 8, medications: 15 },
      { date: "2025-05-19", visits: 18, assessments: 12, medications: 22 },
      { date: "2025-05-20", visits: 15, assessments: 10, medications: 18 },
      { date: "2025-05-21", visits: 22, assessments: 16, medications: 25 },
      { date: "2025-05-22", visits: 19, assessments: 14, medications: 20 },
      { date: "2025-05-23", visits: 14, assessments: 9, medications: 16 },
      { date: "2025-05-24", visits: 8, assessments: 6, medications: 12 },
    ]
  } catch (error) {
    console.error("Error fetching patient activity data:", error)
    throw new Error("Failed to fetch patient activity data")
  }
}
