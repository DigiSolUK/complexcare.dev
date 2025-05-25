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

    const searchParams = request.nextUrl.searchParams
    const filters = {
      patientId: searchParams.get("patientId") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      careProfessionalId: searchParams.get("careProfessionalId") || undefined,
      searchTerm: searchParams.get("searchTerm") || undefined,
      isDraft: searchParams.get("isDraft") ? searchParams.get("isDraft") === "true" : undefined,
      isConfidential: searchParams.get("isConfidential") ? searchParams.get("isConfidential") === "true" : undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    }

    const notes = await clinicalNotesService.getNotes(tenant.id, filters)

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error searching clinical notes:", error)
    return NextResponse.json({ error: "Failed to search clinical notes" }, { status: 500 })
  }
}
