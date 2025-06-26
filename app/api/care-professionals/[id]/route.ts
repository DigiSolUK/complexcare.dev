import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import {
  getCareProfessionalById,
  updateCareProfessional,
  deactivateCareProfessional,
} from "@/lib/services/care-professional-service"
import { careProfessionalSchema } from "@/lib/validations/care-professional-schema"
import { ZodError } from "zod"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized or Tenant ID missing" }, { status: 401 })
    }
    const { tenantId } = session.user
    const { id } = params

    const professional = await getCareProfessionalById(id, tenantId)

    if (!professional) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    return NextResponse.json(professional)
  } catch (error) {
    console.error(`Error fetching care professional ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch care professional" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized or Tenant/User ID missing" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user
    const { id } = params

    const body = await request.json()
    const validatedData = careProfessionalSchema.partial().parse(body) // Use partial for updates

    const updatedProfessional = await updateCareProfessional(id, validatedData, tenantId, userId)

    return NextResponse.json(updatedProfessional)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error(`Error updating care professional ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update care professional" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized or Tenant/User ID missing" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user
    const { id } = params

    const deactivatedProfessional = await deactivateCareProfessional(id, tenantId, userId)

    return NextResponse.json(deactivatedProfessional, { status: 200 })
  } catch (error) {
    console.error(`Error deactivating care professional ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to deactivate care professional" }, { status: 500 })
  }
}
