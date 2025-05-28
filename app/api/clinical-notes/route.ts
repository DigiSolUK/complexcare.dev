import { NextResponse } from "next/server"
import { publicApiService } from "@/lib/services/public-api-service"

export async function GET(request: Request) {
  try {
    // Get tenant ID from headers or use default
    const tenantId = request.headers.get("x-tenant-id") || "tenant-1"

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    // Get clinical notes from public API service
    let clinicalNotes
    if (patientId) {
      clinicalNotes = await publicApiService.getClinicalNotesByPatientId(patientId, tenantId)
    } else {
      clinicalNotes = await publicApiService.getClinicalNotes(tenantId)
    }

    return NextResponse.json({ clinicalNotes })
  } catch (error) {
    console.error("Error fetching clinical notes:", error)
    return NextResponse.json({ error: "Failed to fetch clinical notes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get("x-tenant-id") || "tenant-1"

    // In public mode, just return the submitted data with an ID
    const newNote = {
      id: `cn${Date.now()}`,
      tenant_id: tenantId,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
    }

    return NextResponse.json({ clinicalNote: newNote }, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note:", error)
    return NextResponse.json({ error: "Failed to create clinical note" }, { status: 500 })
  }
}
