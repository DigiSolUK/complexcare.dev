import { type NextRequest, NextResponse } from "next/server"
import clinicalNotesService from "@/lib/services/clinical-notes-service"
import { getCurrentTenant } from "@/lib/tenant-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getCurrentTenant()
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const categories = await clinicalNotesService.getCategories(tenant.id)

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching clinical note categories:", error)
    return NextResponse.json({ error: "Failed to fetch clinical note categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getCurrentTenant()
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const data = await request.json()

    const category = await clinicalNotesService.createCategory(tenant.id, data)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note category:", error)
    return NextResponse.json({ error: "Failed to create clinical note category" }, { status: 500 })
  }
}
