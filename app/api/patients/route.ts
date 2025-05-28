import { NextResponse } from "next/server"
import { mockData } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Get tenant ID from headers or use default
    const tenantId = request.headers.get("x-tenant-id") || "ba367cfe-6de0-4180-9566-1002b75cf82c"

    // Use mock data
    const patients = mockData.patients.filter((p) => p.tenant_id === tenantId)

    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    // Return empty array instead of error to prevent UI issues
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get("x-tenant-id") || "ba367cfe-6de0-4180-9566-1002b75cf82c"

    // Create a new patient with mock data
    const newPatient = {
      id: `p${Date.now()}`,
      tenant_id: tenantId,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    }

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
