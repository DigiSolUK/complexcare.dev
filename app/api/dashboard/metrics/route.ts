import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const tenantId = session.user.tenantId

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    // Fetch all metrics in parallel
    const [patientMetrics, appointmentMetrics, taskMetrics, revenueMetrics] = await Promise.all([
      // Patient metrics
      sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
          COUNT(CASE WHEN created_at >= ${startOfMonth} THEN 1 END) as new_this_month
        FROM patients 
        WHERE tenant_id = ${tenantId}
      `,

      // Appointment metrics
      sql`
        SELECT 
          COUNT(CASE WHEN DATE(appointment_date) = CURRENT_DATE THEN 1 END) as today,
          COUNT(CASE WHEN appointment_date >= ${startOfWeek} THEN 1 END) as this_week,
          COUNT(CASE WHEN status = 'completed' AND appointment_date >= ${startOfMonth} THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'cancelled' AND appointment_date >= ${startOfMonth} THEN 1 END) as cancelled
        FROM appointments 
        WHERE tenant_id = ${tenantId}
      `,

      // Task metrics
      sql`
        SELECT 
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'pending' AND due_date < CURRENT_DATE THEN 1 END) as overdue,
          COUNT(CASE WHEN status = 'completed' AND completed_at >= ${startOfMonth} THEN 1 END) as completed
        FROM tasks 
        WHERE tenant_id = ${tenantId}
      `,

      // Revenue metrics (simplified - you'd need actual invoice/payment tables)
      sql`
        SELECT 
          COALESCE(SUM(CASE WHEN created_at >= ${startOfMonth} THEN amount END), 0) as month_total,
          COALESCE(SUM(CASE WHEN status = 'outstanding' THEN amount END), 0) as outstanding
        FROM invoices 
        WHERE tenant_id = ${tenantId}
      `,
    ])

    // Calculate trends (simplified - in production, compare with previous period)
    const patientTrend = 12 // Example: 12% increase
    const revenueTrend = 8 // Example: 8% increase

    // Calculate task completion rate
    const totalTasks = Number(taskMetrics[0].pending) + Number(taskMetrics[0].completed)
    const completionRate = totalTasks > 0 ? Math.round((Number(taskMetrics[0].completed) / totalTasks) * 100) : 0

    return NextResponse.json({
      patients: {
        total: Number(patientMetrics[0].total),
        active: Number(patientMetrics[0].active),
        new: Number(patientMetrics[0].new_this_month),
        trend: patientTrend,
      },
      appointments: {
        today: Number(appointmentMetrics[0].today),
        week: Number(appointmentMetrics[0].this_week),
        completed: Number(appointmentMetrics[0].completed),
        cancelled: Number(appointmentMetrics[0].cancelled),
      },
      tasks: {
        pending: Number(taskMetrics[0].pending),
        overdue: Number(taskMetrics[0].overdue),
        completed: Number(taskMetrics[0].completed),
        completionRate,
      },
      revenue: {
        month: Number(revenueMetrics[0].month_total),
        trend: revenueTrend,
        outstanding: Number(revenueMetrics[0].outstanding),
      },
    })
  } catch (error) {
    console.error("Dashboard metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 })
  }
}
