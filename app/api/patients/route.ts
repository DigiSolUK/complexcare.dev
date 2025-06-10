import { NextResponse, type NextRequest } from "next/server"
import { PatientService } from "@/lib/services/patient-service"
import { requireAuth } from "@/lib/auth/stack-auth-server"
import { patientSchema } from "@/lib/validations/schemas"
import { z } from "zod"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { user, tenantId } = auth

  const { searchParams } = new URL(req.url)
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  try {
    const { patients, totalCount } = await PatientService.getAll(tenantId, page, limit)
    return NextResponse.json({
      data: patients,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("API GET /patients error:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { user, tenantId } = auth

  try {
    const jsonData = await req.json()
    // Validate data against the full patient schema for creation
    const validatedData = patientSchema
      .omit({ id: true, tenantId: true, createdAt: true, updatedAt: true, deletedAt: true })
      .parse(jsonData)

    const newPatient = await PatientService.create(validatedData, tenantId, user.id)
    return NextResponse.json({ data: newPatient }, { status: 201 })
  } catch (error) {
    console.error("API POST /patients error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
