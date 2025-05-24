"use server"

import { neon } from "@neondatabase/serverless"
import { unstable_noStore as noStore } from "next/cache"
import { getCurrentTenant } from "@/lib/tenant-utils"

// Define types for our dashboard data
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
  recentActivity: ActivityItem[]
}

export interface RecentPatient {
  id: string
  name: string
  dateOfBirth: string
  lastUpdated: string
  status: string
}

export interface UpcomingAppointment {
  id: string
  patientName: string
  patientId: string
  dateTime: string
  duration: number
  type: string
  status: string
}

export interface PendingTask {
  id: string
  title: string
  dueDate: string
  priority: "low" | "medium" | "high"
  assignedTo: string
  status: string
}

export interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
  user: string
}

// Create a SQL client using the DATABASE_URL environment variable
const sql = neon(process.env.DATABASE_URL || "")

export async function getDashboardData(): Promise<DashboardData> {
  // Prevent caching of this data
  noStore()

  try {
    // Get current tenant ID
    const tenantId = await getCurrentTenant()

    if (!tenantId) {
      throw new Error("No tenant ID found")
    }

    // Fetch patient count and growth
    const patientCountResult = await sql`
      SELECT 
        COUNT(*) as total_count,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_count
      FROM patients
      WHERE tenant_id = ${tenantId}
    `

    const patientCount = Number.parseInt(patientCountResult[0]?.total_count || "0")
    const newPatientCount = Number.parseInt(patientCountResult[0]?.new_count || "0")
    const patientGrowth = patientCount > 0 ? Math.round((newPatientCount / patientCount) * 100) : 0

    // Fetch appointments for today
    const today = new Date().toISOString().split("T")[0]
    const appointmentsResult = await sql`
      SELECT 
        COUNT(*) as total_today,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
      FROM appointments
      WHERE 
        tenant_id = ${tenantId} AND
        DATE(appointment_date) = ${today}
    `

    const appointmentsToday = Number.parseInt(appointmentsResult[0]?.total_today || "0")
    const appointmentsPending = Number.parseInt(appointmentsResult[0]?.pending_count || "0")

    // Fetch care plans
    const carePlansResult = await sql`
      SELECT 
        COUNT(*) as active_count,
        COUNT(CASE WHEN review_date <= NOW() + INTERVAL '30 days' THEN 1 END) as review_count
      FROM care_plans
      WHERE 
        tenant_id = ${tenantId} AND
        status = 'active'
    `

    const carePlansActive = Number.parseInt(carePlansResult[0]?.active_count || "0")
    const carePlansReview = Number.parseInt(carePlansResult[0]?.review_count || "0")

    // Fetch staff compliance
    const staffComplianceResult = await sql`
      SELECT 
        ROUND(AVG(CASE WHEN compliance_status = 'compliant' THEN 100 ELSE 0 END)) as compliance_percentage,
        COUNT(CASE WHEN expiry_date <= NOW() + INTERVAL '30 days' THEN 1 END) as expiring_soon
      FROM credentials
      WHERE tenant_id = ${tenantId}
    `

    const staffCompliance = Number.parseInt(staffComplianceResult[0]?.compliance_percentage || "0")
    const certificationsExpiring = Number.parseInt(staffComplianceResult[0]?.expiring_soon || "0")

    // Fetch tasks
    const tasksResult = await sql`
      SELECT 
        COUNT(CASE WHEN status = 'assigned' OR status = 'in_progress' THEN 1 END) as assigned_count,
        COUNT(CASE WHEN status = 'completed' AND completed_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as completed_today
      FROM tasks
      WHERE tenant_id = ${tenantId}
    `

    const tasksAssigned = Number.parseInt(tasksResult[0]?.assigned_count || "0")
    const tasksCompleted = Number.parseInt(tasksResult[0]?.completed_today || "0")

    // Fetch invoices
    const invoicesResult = await sql`
      SELECT 
        SUM(CASE WHEN status = 'pending' OR status = 'overdue' THEN amount ELSE 0 END) as outstanding_amount,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count
      FROM invoices
      WHERE tenant_id = ${tenantId}
    `

    const outstandingInvoices = Number.parseInt(invoicesResult[0]?.outstanding_amount || "0")
    const overduePayments = Number.parseInt(invoicesResult[0]?.overdue_count || "0")

    // Fetch recent patients
    const recentPatientsResult = await sql`
      SELECT 
        id, 
        CONCAT(first_name, ' ', last_name) as name, 
        date_of_birth, 
        updated_at as last_updated,
        status
      FROM patients
      WHERE tenant_id = ${tenantId}
      ORDER BY updated_at DESC
      LIMIT 5
    `

    const recentPatients = recentPatientsResult.map((patient) => ({
      id: patient.id,
      name: patient.name,
      dateOfBirth: new Date(patient.date_of_birth).toISOString(),
      lastUpdated: new Date(patient.last_updated).toISOString(),
      status: patient.status,
    }))

    // Fetch upcoming appointments
    const upcomingAppointmentsResult = await sql`
      SELECT 
        a.id, 
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        p.id as patient_id,
        a.appointment_date as date_time,
        a.duration,
        a.type,
        a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE 
        a.tenant_id = ${tenantId} AND
        a.appointment_date >= NOW() AND
        a.appointment_date <= NOW() + INTERVAL '24 hours'
      ORDER BY a.appointment_date ASC
      LIMIT 5
    `

    const upcomingAppointments = upcomingAppointmentsResult.map((appointment) => ({
      id: appointment.id,
      patientName: appointment.patient_name,
      patientId: appointment.patient_id,
      dateTime: new Date(appointment.date_time).toISOString(),
      duration: Number.parseInt(appointment.duration),
      type: appointment.type,
      status: appointment.status,
    }))

    // Fetch pending tasks
    const pendingTasksResult = await sql`
      SELECT 
        t.id, 
        t.title,
        t.due_date,
        t.priority,
        CONCAT(u.first_name, ' ', u.last_name) as assigned_to,
        t.status
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE 
        t.tenant_id = ${tenantId} AND
        (t.status = 'assigned' OR t.status = 'in_progress')
      ORDER BY 
        CASE 
          WHEN t.priority = 'high' THEN 1
          WHEN t.priority = 'medium' THEN 2
          ELSE 3
        END,
        t.due_date ASC
      LIMIT 5
    `

    const pendingTasks = pendingTasksResult.map((task) => ({
      id: task.id,
      title: task.title,
      dueDate: task.due_date ? new Date(task.due_date).toISOString() : null,
      priority: task.priority as "low" | "medium" | "high",
      assignedTo: task.assigned_to,
      status: task.status,
    }))

    // Fetch recent activity
    const recentActivityResult = await sql`
      SELECT 
        a.id,
        a.activity_type as type,
        a.description,
        a.created_at as timestamp,
        CONCAT(u.first_name, ' ', u.last_name) as user
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.tenant_id = ${tenantId}
      ORDER BY a.created_at DESC
      LIMIT 10
    `

    const recentActivity = recentActivityResult.map((activity) => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      timestamp: new Date(activity.timestamp).toISOString(),
      user: activity.user,
    }))

    // Return the complete dashboard data
    return {
      patientCount,
      patientGrowth,
      appointmentsToday,
      appointmentsPending,
      carePlansActive,
      carePlansReview,
      staffCompliance,
      certificationsExpiring,
      tasksAssigned,
      tasksCompleted,
      outstandingInvoices,
      overduePayments,
      recentPatients,
      upcomingAppointments,
      pendingTasks,
      recentActivity,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)

    // Return fallback data in case of error
    return {
      patientCount: 0,
      patientGrowth: 0,
      appointmentsToday: 0,
      appointmentsPending: 0,
      carePlansActive: 0,
      carePlansReview: 0,
      staffCompliance: 0,
      certificationsExpiring: 0,
      tasksAssigned: 0,
      tasksCompleted: 0,
      outstandingInvoices: 0,
      overduePayments: 0,
      recentPatients: [],
      upcomingAppointments: [],
      pendingTasks: [],
      recentActivity: [],
    }
  }
}

// Additional server action to fetch patient activity data for the chart
export async function getPatientActivityData() {
  noStore()

  try {
    const tenantId = await getCurrentTenant()

    if (!tenantId) {
      throw new Error("No tenant ID found")
    }

    // Get the last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    // Fetch patient activity data for the last 7 days
    const activityResult = await sql`
      WITH dates AS (
        SELECT generate_series(
          current_date - interval '6 days',
          current_date,
          interval '1 day'
        )::date as date
      )
      SELECT 
        dates.date,
        COUNT(DISTINCT CASE WHEN a.activity_type = 'visit' THEN a.patient_id END) as visits,
        COUNT(DISTINCT CASE WHEN a.activity_type = 'assessment' THEN a.patient_id END) as assessments,
        COUNT(DISTINCT CASE WHEN a.activity_type = 'medication' THEN a.patient_id END) as medications
      FROM dates
      LEFT JOIN activity_logs a ON dates.date = DATE(a.created_at) AND a.tenant_id = ${tenantId}
      GROUP BY dates.date
      ORDER BY dates.date
    `

    // Format the data for the chart
    const formattedData = activityResult.map((day) => ({
      date: new Date(day.date).toISOString().split("T")[0],
      visits: Number.parseInt(day.visits || "0"),
      assessments: Number.parseInt(day.assessments || "0"),
      medications: Number.parseInt(day.medications || "0"),
    }))

    return formattedData
  } catch (error) {
    console.error("Error fetching patient activity data:", error)

    // Return fallback data in case of error
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return dates.map((date) => ({
      date,
      visits: 0,
      assessments: 0,
      medications: 0,
    }))
  }
}
