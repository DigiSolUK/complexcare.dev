import { NextResponse } from "next/server"
import { publicApiService } from "@/lib/services/public-api-service"

export async function GET(request: Request) {
  try {
    // Get tenant ID from headers or use default
    const tenantId = request.headers.get("x-tenant-id") || "tenant-1"

    // Get patients from public API service
    const patients = await publicApiService.getPatients(tenantId)

    return NextResponse.json({ patients })
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get("x-tenant-id") || "tenant-1"

    // In public mode, just return the submitted data with an ID
    const newPatient = {
      id: `p${Date.now()}`,
      tenant_id: tenantId,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    }

    return NextResponse.json({ patient: newPatient }, { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
