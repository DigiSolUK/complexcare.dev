import { NextResponse } from "next/server"
import { mockData } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Get tenant ID from headers or use default
    const tenantId = request.headers.get("x-tenant-id") || "ba367cfe-6de0-4180-9566-1002b75cf82c"

    // Get URL parameters
    const url = new URL(request.url)
    const patientId = url.searchParams.get("patientId")

    // Filter mock data
    let notes = mockData.clinical_notes.filter((note) => note.tenant_id === tenantId && !note.is_deleted)

    if (patientId) {
      notes = notes.filter((note) => note.patient_id === patientId)
    }

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching clinical notes:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get("x-tenant-id") || "ba367cfe-6de0-4180-9566-1002b75cf82c"

    // Create a new clinical note
    const newNote = {
      id: `cn${Date.now()}`,
      tenant_id: tenantId,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
    }

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error("Error creating clinical note:", error)
    return NextResponse.json({ error: "Failed to create clinical note" }, { status: 500 })
  }
}
