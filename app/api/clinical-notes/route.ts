import { type NextRequest, NextResponse } from "next/server"
import { createClinicalNote } from "@/lib/services/clinical-notes-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const patientId = searchParams.get("patientId")
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search")
    const categoryId = searchParams.get("categoryId")
    const isPrivate = searchParams.get("isPrivate")
    const isImportant = searchParams.get("isImportant")
    const createdBy = searchParams.get("createdBy")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const tags = searchParams.get("tags")?.split(",")

    const sql = neon(process.env.DATABASE_URL!)

    // Build dynamic query
    const whereConditions = [`cn.tenant_id = '${tenantId}'`]

    if (patientId) {
      whereConditions.push(`cn.patient_id = '${patientId}'`)
    }

    if (search) {
      whereConditions.push(`(cn.title ILIKE '%${search}%' OR cn.content ILIKE '%${search}%')`)
    }

    if (categoryId) {
      whereConditions.push(`cn.category_id = '${categoryId}'`)
    }

    if (isPrivate !== null) {
      whereConditions.push(`cn.is_private = ${isPrivate}`)
    }

    if (isImportant !== null) {
      whereConditions.push(`cn.is_important = ${isImportant}`)
    }

    if (createdBy) {
      whereConditions.push(`cn.created_by = '${createdBy}'`)
    }

    if (dateFrom) {
      whereConditions.push(`cn.created_at >= '${dateFrom}'`)
    }

    if (dateTo) {
      whereConditions.push(`cn.created_at <= '${dateTo}'`)
    }

    if (tags && tags.length > 0) {
      const tagConditions = tags.map((tag) => `'${tag}' = ANY(cn.tags)`).join(" OR ")
      whereConditions.push(`(${tagConditions})`)
    }

    const whereClause = whereConditions.join(" AND ")
    const offset = (page - 1) * limit

    // Get total count
    const countResult = await sql.unsafe(`
      SELECT COUNT(*) as total
      FROM clinical_notes cn
      WHERE ${whereClause}
    `)

    const total = Number.parseInt(countResult[0].total)

    // Get paginated results
    const result = await sql.unsafe(`
      SELECT 
        cn.*,
        cnc.name as category_name,
        cnc.color as category_color,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
        p.first_name || ' ' || p.last_name as patient_name
      FROM clinical_notes cn
      LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
      LEFT JOIN users u ON cn.created_by = u.id
      LEFT JOIN patients p ON cn.patient_id = p.id
      WHERE ${whereClause}
      ORDER BY cn.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error in GET /api/clinical-notes:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const tenantId = data.tenant_id || DEFAULT_TENANT_ID

    // Validate required fields
    if (!data.patient_id || !data.title || !data.content) {
      return NextResponse.json({ error: "Missing required fields: patient_id, title, content" }, { status: 400 })
    }

    // Set created_by from session if not provided
    if (!data.created_by) {
      data.created_by = session.user?.id || session.user?.email
    }

    const note = await createClinicalNote(data, tenantId)

    if (!note) {
      return NextResponse.json({ error: "Failed to create clinical note" }, { status: 500 })
    }

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/clinical-notes:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
