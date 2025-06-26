import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCareProfessionals, createCareProfessional } from "@/lib/services/care-professional-service"
import { careProfessionalSchema } from "@/lib/validations/care-professional-schema"
import { ZodError } from "zod"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized or Tenant ID missing" }, { status: 401 })
    }
    const { tenantId } = session.user
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("search") || undefined

    const professionals = await getCareProfessionals(tenantId, searchQuery)
    return NextResponse.json(professionals)
  } catch (error) {
    console.error("Error fetching care professionals:", error)
    return NextResponse.json({ error: "Failed to fetch care professionals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized or Tenant/User ID missing" }, { status: 401 })
    }
    const { tenantId, id: userId } = session.user

    const body = await request.json()
    const validatedData = careProfessionalSchema.parse(body)

    const newProfessional = await createCareProfessional(validatedData, tenantId, userId)

    return NextResponse.json(newProfessional, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error("Error creating care professional:", error)
    return NextResponse.json({ error: "Failed to create care professional" }, { status: 500 })
  }
}
