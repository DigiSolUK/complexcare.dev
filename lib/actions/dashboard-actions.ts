"use server"

export interface DashboardData {
  patientCount: number
  patientGrowth: number
  appointmentsToday: number
  appointmentsPending: number
  carePlansActive: number
  carePlansReview: number
  staffCompliance: number
  certificationsExpiring: number
  tasksAssigned: number
  tasksCompleted: number
  outstandingInvoices: number
  overduePayments: number
  recentPatients: RecentPatient[]
  upcomingAppointments: UpcomingAppointment[]
  pendingTasks: PendingTask[]
}

export interface RecentPatient {
  id: string
  name: string
  dateOfBirth: string
  status: string
  lastUpdated: string
}

export interface UpcomingAppointment {
  id: string
  patientName: string
  patientId: string
  date: string
  time: string
  type: string
  status: string
}

export interface PendingTask {
  id: string
  title: string
  dueDate: string
  priority: string
  assignedTo: string
  status: string
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    return {
      patientCount: 248,
      patientGrowth: 4,
      appointmentsToday: 8,
      appointmentsPending: 3,
      carePlansActive: 187,
      carePlansReview: 12,
      staffCompliance: 92,
      certificationsExpiring: 5,
      tasksAssigned: 24,
      tasksCompleted: 18,
      outstandingInvoices: 12500,
      overduePayments: 3,
      recentPatients: [
        {
          id: "1",
          name: "John Smith",
          dateOfBirth: "1985-06-15",
          status: "active",
          lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        },
        {
          id: "2",
          name: "Sarah Johnson",
          dateOfBirth: "1972-11-23",
          status: "active",
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: "3",
          name: "Michael Brown",
          dateOfBirth: "1990-03-08",
          status: "pending",
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        },
        {
          id: "4",
          name: "Emily Davis",
          dateOfBirth: "1965-09-17",
          status: "inactive",
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        },
        {
          id: "5",
          name: "Robert Wilson",
          dateOfBirth: "1978-12-04",
          status: "discharged",
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        },
      ],
      upcomingAppointments: [
        {
          id: "1",
          patientName: "John Smith",
          patientId: "1",
          date: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
          time: "10:30",
          type: "Check-up",
          status: "confirmed",
        },
        {
          id: "2",
          patientName: "Sarah Johnson",
          patientId: "2",
          date: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4 hours from now
          time: "13:15",
          type: "Therapy",
          status: "confirmed",
        },
        {
          id: "3",
          patientName: "Michael Brown",
          patientId: "3",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
          time: "09:00",
          type: "Initial Assessment",
          status: "pending",
        },
        {
          id: "4",
          patientName: "Emily Davis",
          patientId: "4",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
          time: "14:45",
          type: "Follow-up",
          status: "confirmed",
        },
      ],
      pendingTasks: [
        {
          id: "1",
          title: "Review care plan for John Smith",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
          priority: "high",
          assignedTo: "Dr. Williams",
          status: "pending",
        },
        {
          id: "2",
          title: "Update medication list for Sarah Johnson",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days from now
          priority: "medium",
          assignedTo: "Nurse Thompson",
          status: "pending",
        },
        {
          id: "3",
          title: "Schedule follow-up appointment for Michael Brown",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(), // 3 days from now
          priority: "low",
          assignedTo: "Admin Staff",
          status: "pending",
        },
        {
          id: "4",
          title: "Complete discharge paperwork for Robert Wilson",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
          priority: "high",
          assignedTo: "Dr. Martinez",
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
  try {
    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    const today = new Date()
    const data = []

    // Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      data.push({
        date: dateStr,
        visits: Math.floor(Math.random() * 15) + 5,
        assessments: Math.floor(Math.random() * 10) + 3,
        medications: Math.floor(Math.random() * 8) + 2,
      })
    }

    return data
  } catch (error) {
    console.error("Error fetching patient activity data:", error)
    throw new Error("Failed to fetch patient activity data")
  }
}
