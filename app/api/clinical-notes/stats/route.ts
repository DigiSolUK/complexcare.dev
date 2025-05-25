import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID
    const patientId = searchParams.get("patientId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const sql = neon(process.env.DATABASE_URL!)

    const whereConditions = [`cn.tenant_id = '${tenantId}'`]

    if (patientId) {
      whereConditions.push(`cn.patient_id = '${patientId}'`)
    }

    if (dateFrom) {
      whereConditions.push(`cn.created_at >= '${dateFrom}'`)
    }

    if (dateTo) {
      whereConditions.push(`cn.created_at <= '${dateTo}'`)
    }

    const whereClause = whereConditions.join(" AND ")

    // Get comprehensive statistics
    const stats = await sql.unsafe(`
      SELECT 
        COUNT(*) as total_notes,
        COUNT(CASE WHEN cn.is_private = true THEN 1 END) as private_notes,
        COUNT(CASE WHEN cn.is_important = true THEN 1 END) as important_notes,
        COUNT(CASE WHEN cn.follow_up_date IS NOT NULL THEN 1 END) as notes_with_followup,
        COUNT(DISTINCT cn.patient_id) as unique_patients,
        COUNT(DISTINCT cn.created_by) as unique_authors,
        AVG(LENGTH(cn.content)) as avg_content_length
      FROM clinical_notes cn
      WHERE ${whereClause}
    `)

    // Get notes by category
    const categoryStats = await sql.unsafe(`
      SELECT 
        cnc.name as category_name,
        cnc.color as category_color,
        COUNT(cn.id) as note_count
      FROM clinical_notes cn
      LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      WHERE ${whereClause}
      GROUP BY cnc.id, cnc.name, cnc.color
      ORDER BY note_count DESC
    `)

    // Get notes by month for the last 12 months
    const monthlyStats = await sql.unsafe(`
      SELECT 
        DATE_TRUNC('month', cn.created_at) as month,
        COUNT(*) as note_count
      FROM clinical_notes cn
      WHERE ${whereClause}
      AND cn.created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', cn.created_at)
      ORDER BY month DESC
    `)

    // Get top authors
    const authorStats = await sql.unsafe(`
      SELECT 
        CONCAT(u.first_name, ' ', u.last_name) as author_name,
        COUNT(cn.id) as note_count
      FROM clinical_notes cn
      LEFT JOIN users u ON cn.created_by = u.id
      WHERE ${whereClause}
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY note_count DESC
      LIMIT 10
    `)

    return NextResponse.json({
      overview: stats[0],
      by_category: categoryStats,
      by_month: monthlyStats,
      by_author: authorStats,
    })
  } catch (error) {
    console.error("Error in GET /api/clinical-notes/stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
