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
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Full-text search with ranking
    const result = await sql`
      SELECT 
        cn.*,
        cnc.name as category_name,
        cnc.color as category_color,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
        p.first_name || ' ' || p.last_name as patient_name,
        ts_rank(
          to_tsvector('english', cn.title || ' ' || cn.content),
          plainto_tsquery('english', ${query})
        ) as rank
      FROM clinical_notes cn
      LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN users u ON cn.created_by = u.id
      LEFT JOIN patients p ON cn.patient_id = p.id
      WHERE cn.tenant_id = ${tenantId}
      AND (
        to_tsvector('english', cn.title || ' ' || cn.content) @@ plainto_tsquery('english', ${query})
        OR cn.title ILIKE ${"%" + query + "%"}
        OR cn.content ILIKE ${"%" + query + "%"}
        OR ${query} = ANY(cn.tags)
      )
      ORDER BY rank DESC, cn.created_at DESC
      LIMIT ${limit}
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GET /api/clinical-notes/search:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
