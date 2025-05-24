import { type NextRequest, NextResponse } from "next/server"
import clinicalNotesService from "@/lib/services/clinical-notes-service"
import { getCurrentTenant } from "@/lib/tenant-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getCurrentTenant()
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const patientId = params.id
    const notes = await clinicalNotesService.getNotes(tenant.id, patientId)

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching patient clinical notes:", error)
    return NextResponse.json({ error: "Failed to fetch patient clinical notes" }, { status: 500 })
  }
}
