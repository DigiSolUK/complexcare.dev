import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logActivity } from "@/lib/services/activity-log-service"

// GET /api/patients/[id]/medical-history
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const { searchParams } = new URL(request.url)

    // Extract filter parameters
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const searchTerm = searchParams.get("searchTerm")

    // Build the query
    let query = `
      SELECT * FROM patient_medical_history 
      WHERE patient_id = $1
    `

    const queryParams: any[] = [patientId]
    let paramIndex = 2

    if (category) {
      query += ` AND category = $${paramIndex}`
      queryParams.push(category)
      paramIndex++
    }

    if (status) {
      query += ` AND status = $${paramIndex}`
      queryParams.push(status)
      paramIndex++
    }

    if (severity) {
      query += ` AND severity = $${paramIndex}`
      queryParams.push(severity)
      paramIndex++
    }

    if (startDate) {
      query += ` AND onset_date >= $${paramIndex}`
      queryParams.push(new Date(startDate))
      paramIndex++
    }

    if (endDate) {
      query += ` AND (end_date <= $${paramIndex} OR end_date IS NULL)`
      queryParams.push(new Date(endDate))
      paramIndex++
    }

    if (searchTerm) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR notes ILIKE $${paramIndex})`
      queryParams.push(`%${searchTerm}%`)
      paramIndex++
    }

    query += ` ORDER BY onset_date DESC`

    const result = await db.query(query, queryParams)

    // Log activity
    await logActivity({
      tenantId: "system", // This should be replaced with actual tenant ID
      activityType: "medical_history_viewed",
      description: "Patient medical history viewed",
      patientId,
      metadata: {
        filters: {
          category,
          status,
          severity,
          startDate,
          endDate,
          searchTerm,
        },
      },
    })

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching medical history:", error)
    return NextResponse.json({ error: "Failed to fetch medical history" }, { status: 500 })
  }
}

// POST /api/patients/[id]/medical-history
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.category || !data.status || !data.onsetDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert the new medical history entry
    const result = await db.query(
      `INSERT INTO patient_medical_history (
        patient_id, 
        category, 
        title, 
        description, 
        onset_date, 
        end_date, 
        status, 
        severity, 
        provider, 
        location, 
        notes,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        patientId,
        data.category,
        data.title,
        data.description || null,
        new Date(data.onsetDate),
        data.endDate ? new Date(data.endDate) : null,
        data.status,
        data.severity || null,
        data.provider || null,
        data.location || null,
        data.notes || null,
        data.createdBy || "system",
      ],
    )

    const newEntry = result.rows[0]

    // Log activity
    await logActivity({
      tenantId: "system", // This should be replaced with actual tenant ID
      activityType: "medical_history_added",
      description: `Medical history entry added: ${data.title}`,
      patientId,
      userId: data.createdBy || "system",
      metadata: {
        entryId: newEntry.id,
        category: data.category,
        title: data.title,
      },
    })

    return NextResponse.json(newEntry, { status: 201 })
  } catch (error) {
    console.error("Error adding medical history:", error)
    return NextResponse.json({ error: "Failed to add medical history entry" }, { status: 500 })
  }
}
