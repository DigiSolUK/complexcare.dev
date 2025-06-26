import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

const createScheduleSchema = z.object({
  day_of_week: z.number().min(0).max(6), // 0 = Sunday, 6 = Saturday
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  is_available: z.boolean().default(true),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantId = request.headers.get("x-tenant-id") || process.env.DEFAULT_TENANT_ID
    const { id } = params

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const result = await sql`
      SELECT *
      FROM care_professional_schedules
      WHERE care_professional_id = ${id} AND tenant_id = ${tenantId}
      ORDER BY day_of_week, start_time
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching schedule:", error)
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenantId = request.headers.get("x-tenant-id") || process.env.DEFAULT_TENANT_ID
    const { id } = params
    const body = await request.json()

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const validatedData = createScheduleSchema.parse(body)

    const result = await sql`
      INSERT INTO care_professional_schedules (
        tenant_id,
        care_professional_id,
        day_of_week,
        start_time,
        end_time,
        is_available,
        notes,
        created_at,
        updated_at
      ) VALUES (
        ${tenantId},
        ${id},
        ${validatedData.day_of_week},
        ${validatedData.start_time},
        ${validatedData.end_time},
        ${validatedData.is_available},
        ${validatedData.notes || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating schedule:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}
