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

    const noteId = params.id
    const notes = await clinicalNotesService.getNotes(tenant.id)
    const note = notes.find((n) => n.id === noteId)

    if (!note) {
      return NextResponse.json({ error: "Clinical note not found" }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error fetching clinical note:", error)
    return NextResponse.json({ error: "Failed to fetch clinical note" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getCurrentTenant()
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const noteId = params.id
    const data = await request.json()

    const updatedNote = await clinicalNotesService.updateNote(tenant.id, noteId, data)

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error("Error updating clinical note:", error)
    return NextResponse.json({ error: "Failed to update clinical note" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getCurrentTenant()
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const noteId = params.id
    const success = await clinicalNotesService.deleteNote(tenant.id, noteId)

    if (!success) {
      return NextResponse.json({ error: "Clinical note not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting clinical note:", error)
    return NextResponse.json({ error: "Failed to delete clinical note" }, { status: 500 })
  }
}
