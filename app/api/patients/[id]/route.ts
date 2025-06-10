import { NextResponse, type NextRequest } from "next/server"
import { PatientService } from "@/lib/services/patient-service"
import { requireAuth } from "@/lib/auth/stack-auth-server"
import { patientSchema } from "@/lib/validations/schemas"
import { z } from "zod"

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAuth(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { user, tenantId } = auth
  const { id } = params

  try {
    const patient = await PatientService.getById(id, tenantId)
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }
    return NextResponse.json({ data: patient })
  } catch (error) {
    console.error(`API GET /patients/${id} error:`, error)
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAuth(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { user, tenantId } = auth
  const { id } = params

  try {
    const jsonData = await req.json()
    // Validate partial data for update
    const validatedData = patientSchema.partial().parse(jsonData)

    const updatedPatient = await PatientService.update(id, validatedData, tenantId, user.id)
    if (!updatedPatient) {
      return NextResponse.json({ error: "Patient not found or update failed" }, { status: 404 })
    }
    return NextResponse.json({ data: updatedPatient })
  } catch (error) {
    console.error(`API PUT /patients/${id} error:`, error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAuth(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const { user, tenantId } = auth
  const { id } = params

  try {
    const success = await PatientService.delete(id, tenantId, user.id)
    if (!success) {
      return NextResponse.json({ error: "Patient not found or delete failed" }, { status: 404 })
    }
    return NextResponse.json({ message: "Patient deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error(`API DELETE /patients/${id} error:`, error)
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 })
  }
}
