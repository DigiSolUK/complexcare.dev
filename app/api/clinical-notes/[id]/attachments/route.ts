import { type NextRequest, NextResponse } from "next/server"
import { getAttachmentsByNoteId, addAttachmentToNote } from "@/lib/services/clinical-notes-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const noteId = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId") || DEFAULT_TENANT_ID

    const attachments = await getAttachmentsByNoteId(noteId, tenantId)
    return NextResponse.json(attachments)
  } catch (error) {
    console.error(`Error in GET /api/clinical-notes/${params.id}/attachments:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const noteId = params.id
    const data = await request.json()
    const tenantId = data.tenant_id || DEFAULT_TENANT_ID

    // Validate required fields
    if (!data.file_name || !data.file_path) {
      return NextResponse.json({ error: "File name and path are required" }, { status: 400 })
    }

    // Set uploaded_by from session if not provided
    if (!data.uploaded_by) {
      data.uploaded_by = session.user?.id || session.user?.email
    }

    data.note_id = noteId

    const attachment = await addAttachmentToNote(data, tenantId)

    if (!attachment) {
      return NextResponse.json({ error: "Failed to add attachment" }, { status: 500 })
    }

    return NextResponse.json(attachment, { status: 201 })
  } catch (error) {
    console.error(`Error in POST /api/clinical-notes/${params.id}/attachments:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
