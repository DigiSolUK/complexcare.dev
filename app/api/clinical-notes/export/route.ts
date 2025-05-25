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
    const format = searchParams.get("format") || "json"
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required for export" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const whereConditions = [`cn.tenant_id = '${tenantId}'`, `cn.patient_id = '${patientId}'`]

    if (dateFrom) {
      whereConditions.push(`cn.created_at >= '${dateFrom}'`)
    }

    if (dateTo) {
      whereConditions.push(`cn.created_at <= '${dateTo}'`)
    }

    const whereClause = whereConditions.join(" AND ")

    const result = await sql.unsafe(`
      SELECT 
        cn.*,
        cnc.name as category_name,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
        p.first_name || ' ' || p.last_name as patient_name
      FROM clinical_notes cn
      LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN users u ON cn.created_by = u.id
      LEFT JOIN patients p ON cn.patient_id = p.id
      WHERE ${whereClause}
      ORDER BY cn.created_at DESC
    `)

    if (format === "csv") {
      // Convert to CSV format
      const headers = [
        "ID",
        "Title",
        "Content",
        "Category",
        "Created By",
        "Created At",
        "Is Private",
        "Is Important",
        "Tags",
        "Follow Up Date",
      ]

      const csvRows = [
        headers.join(","),
        ...result.map((note) =>
          [
            note.id,
            `"${note.title.replace(/"/g, '""')}"`,
            `"${note.content.replace(/"/g, '""')}"`,
            note.category_name || "",
            note.created_by_name || "",
            note.created_at,
            note.is_private,
            note.is_important,
            `"${note.tags.join(", ")}"`,
            note.follow_up_date || "",
          ].join(","),
        ),
      ]

      const csvContent = csvRows.join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="clinical-notes-${patientId}-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    // Default JSON format
    return NextResponse.json({
      patient_id: patientId,
      export_date: new Date().toISOString(),
      total_notes: result.length,
      notes: result,
    })
  } catch (error) {
    console.error("Error in GET /api/clinical-notes/export:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
