import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/patients/[id]/medical-history/stats
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    // Get count by category
    const categoryStats = await db.query(
      `SELECT category, COUNT(*) as count 
       FROM patient_medical_history 
       WHERE patient_id = $1 
       GROUP BY category`,
      [patientId],
    )

    // Get count by status
    const statusStats = await db.query(
      `SELECT status, COUNT(*) as count 
       FROM patient_medical_history 
       WHERE patient_id = $1 
       GROUP BY status`,
      [patientId],
    )

    // Get count by severity
    const severityStats = await db.query(
      `SELECT severity, COUNT(*) as count 
       FROM patient_medical_history 
       WHERE patient_id = $1 AND severity IS NOT NULL
       GROUP BY severity`,
      [patientId],
    )

    // Get total count
    const totalResult = await db.query(
      `SELECT COUNT(*) as total 
       FROM patient_medical_history 
       WHERE patient_id = $1`,
      [patientId],
    )

    return NextResponse.json({
      total: Number.parseInt(totalResult.rows[0].total),
      byCategory: categoryStats.rows.reduce((acc, row) => {
        acc[row.category] = Number.parseInt(row.count)
        return acc
      }, {}),
      byStatus: statusStats.rows.reduce((acc, row) => {
        acc[row.status] = Number.parseInt(row.count)
        return acc
      }, {}),
      bySeverity: severityStats.rows.reduce((acc, row) => {
        acc[row.severity] = Number.parseInt(row.count)
        return acc
      }, {}),
    })
  } catch (error) {
    console.error("Error fetching medical history stats:", error)
    return NextResponse.json({ error: "Failed to fetch medical history statistics" }, { status: 500 })
  }
}
