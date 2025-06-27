import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import {
  getCareProfessionalById,
  updateCareProfessional,
  deactivateCareProfessional,
} from "@/lib/services/care-professional-service"
import { updateCareProfessionalSchema } from "@/lib/validations/care-professional-schema"
import { ZodError } from "zod"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized or Tenant ID missing" }, { status: 401 })
    }
    const { tenantId } = session.user

    const professional = await getCareProfessionalById(params.id, tenantId)

    if (!professional) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    return NextResponse.json(professional)
  } catch (error) {
    console.error("Error fetching care professional:", error)
    return NextResponse.json({ error: "Failed to fetch care professional details" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized or Tenant/User ID missing" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user

    const body = await request.json()
    const validatedData = updateCareProfessionalSchema.parse(body)

    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const updatedProfessional = await updateCareProfessional(params.id, validatedData, tenantId, userId)

    return NextResponse.json(updatedProfessional)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error("Error updating care professional:", error)
    // Check if the error message is from the service layer
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to update care professional" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user

    const result = await deactivateCareProfessional(params.id, tenantId, userId)

    return NextResponse.json({
      message: "Care professional deactivated successfully",
      data: result,
    })
  } catch (error) {
    console.error("Error deactivating care professional:", error)
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to deactivate care professional" }, { status: 500 })
  }
}
