import { type NextRequest, NextResponse } from "next/server"
import { put, del } from "@vercel/blob"
import clinicalNotesService from "@/lib/services/clinical-notes-service"
import { getCurrentTenant } from "@/lib/tenant-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const clinicalNoteId = formData.get("clinicalNoteId") as string

    if (!file || !clinicalNoteId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload file to Vercel Blob
    const blob = await put(`clinical-notes/${tenant.id}/${clinicalNoteId}/${file.name}`, file, {
      access: "public",
    })

    // Save attachment record to database
    const attachment = await clinicalNotesService.addAttachment({
      clinical_note_id: clinicalNoteId,
      file_name: file.name,
      file_path: blob.url,
      file_type: file.type,
      file_size: file.size,
      uploaded_by: session.user.id,
    })

    return NextResponse.json(attachment, { status: 201 })
  } catch (error) {
    console.error("Error uploading attachment:", error)
    return NextResponse.json({ error: "Failed to upload attachment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const attachmentId = searchParams.get("id")
    const filePath = searchParams.get("filePath")

    if (!attachmentId || !filePath) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Delete from Vercel Blob
    await del(filePath)

    // Delete from database
    await clinicalNotesService.deleteAttachment(attachmentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting attachment:", error)
    return NextResponse.json({ error: "Failed to delete attachment" }, { status: 500 })
  }
}
