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

    const patientId = request.nextUrl.searchParams.get("patientId")
    const notes = await clinicalNotesService.getNotes(tenant.id, patientId || undefined)

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching clinical notes:", error)
    return NextResponse.json({ error: "Failed to fetch clinical notes" }, { status: 500 })
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
    const userId = session.user.id

    const note = await clinicalNotesService.createNote(tenant.id, userId, data)

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note:", error)
    return NextResponse.json({ error: "Failed to create clinical note" }, { status: 500 })
  }
}
