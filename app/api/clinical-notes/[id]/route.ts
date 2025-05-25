import { type NextRequest, NextResponse } from "next/server"
import { getClinicalNoteById, updateClinicalNote, deleteClinicalNote } from "@/lib/services/clinical-notes-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID

    const note = await getClinicalNoteById(id, tenantId)

    if (!note) {
      return NextResponse.json({ error: "Clinical note not found" }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error(`Error in GET /api/clinical-notes/${params.id}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const data = await request.json()
    const tenantId = data.tenant_id || DEFAULT_TENANT_ID

    // Check if note exists and user has permission
    const existingNote = await getClinicalNoteById(id, tenantId)
    if (!existingNote) {
      return NextResponse.json({ error: "Clinical note not found" }, { status: 404 })
    }

    const note = await updateClinicalNote(id, data, tenantId)

    if (!note) {
      return NextResponse.json({ error: "Failed to update clinical note" }, { status: 500 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error(`Error in PUT /api/clinical-notes/${params.id}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID

    // Check if note exists
    const existingNote = await getClinicalNoteById(id, tenantId)
    if (!existingNote) {
      return NextResponse.json({ error: "Clinical note not found" }, { status: 404 })
    }

    const success = await deleteClinicalNote(id, tenantId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete clinical note" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Clinical note deleted successfully" })
  } catch (error) {
    console.error(`Error in DELETE /api/clinical-notes/${params.id}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
