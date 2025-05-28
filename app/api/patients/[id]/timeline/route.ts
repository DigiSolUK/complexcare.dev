import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get("range") || "week"

    const sql = neon(process.env.DATABASE_URL!)

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    switch (range) {
      case "day":
        startDate.setDate(startDate.getDate() - 1)
        break
      case "week":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "month":
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "3months":
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    // Fetch timeline events from multiple sources
    const timelineQuery = `
      WITH timeline_events AS (
        -- Appointments
        SELECT 
          a.id,
          'appointment' as type,
          a.appointment_type as title,
          CONCAT('Appointment with ', cp.first_name, ' ', cp.last_name) as description,
          a.appointment_date as timestamp,
          CONCAT(cp.first_name, ' ', cp.last_name) as performed_by,
          jsonb_build_object(
            'status', a.status,
            'duration', a.duration,
            'notes', a.notes
          ) as details,
          CASE 
            WHEN a.appointment_type = 'emergency' THEN 'critical'
            WHEN a.appointment_type = 'urgent' THEN 'important'
            ELSE 'routine'
          END as severity
        FROM appointments a
        LEFT JOIN care_professionals cp ON a.care_professional_id = cp.id
        WHERE a.patient_id = $1 
          AND a.tenant_id = $2
          AND a.appointment_date BETWEEN $3 AND $4

        UNION ALL

        -- Clinical Notes
        SELECT 
          cn.id,
          'note' as type,
          cn.note_type as title,
          SUBSTRING(cn.content, 1, 200) as description,
          cn.created_at as timestamp,
          u.name as performed_by,
          jsonb_build_object(
            'category', cn.category,
            'attachments', cn.attachments
          ) as details,
          CASE 
            WHEN cn.is_urgent THEN 'important'
            ELSE 'routine'
          END as severity
        FROM clinical_notes cn
        LEFT JOIN users u ON cn.created_by = u.id
        WHERE cn.patient_id = $1 
          AND cn.tenant_id = $2
          AND cn.created_at BETWEEN $3 AND $4

        UNION ALL

        -- Medications
        SELECT 
          m.id,
          'medication' as type,
          CONCAT('Medication: ', m.medication_name) as title,
          CONCAT(m.dosage, ' - ', m.frequency) as description,
          m.start_date as timestamp,
          u.name as performed_by,
          jsonb_build_object(
            'dosage', m.dosage,
            'frequency', m.frequency,
            'end_date', m.end_date,
            'instructions', m.instructions
          ) as details,
          'routine' as severity
        FROM medications m
        LEFT JOIN users u ON m.prescribed_by = u.id
        WHERE m.patient_id = $1 
          AND m.tenant_id = $2
          AND m.start_date BETWEEN $3 AND $4

        UNION ALL

        -- Activity Logs
        SELECT 
          al.id,
          al.activity_type as type,
          al.activity_type as title,
          al.description,
          al.created_at as timestamp,
          u.name as performed_by,
          al.metadata as details,
          'routine' as severity
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE al.patient_id = $1 
          AND al.tenant_id = $2
          AND al.created_at BETWEEN $3 AND $4
      )
      SELECT * FROM timeline_events
      ORDER BY timestamp DESC
    `

    const events = await sql(timelineQuery, [
      params.id,
      session.user.tenantId,
      startDate.toISOString(),
      endDate.toISOString(),
    ])

    return NextResponse.json(events)
  } catch (error) {
    console.error("Timeline fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 })
  }
}
