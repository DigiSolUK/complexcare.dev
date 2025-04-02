import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get tenant ID from header (set by middleware)
    const tenantId = request.headers.get("x-tenant-id") || "demo-tenant-1"

    // For demo, return a mock tenant
    return NextResponse.json({
      id: tenantId,
      name: "ComplexCare Demo",
      domain: "demo.complexcare.dev",
      settings: {
        theme: "light",
        logo: "/logo.png",
      },
      features: {
        appointments: true,
        medications: true,
        documents: true,
        tasks: true,
        patients: true,
        careProfessionals: true,
        finance: true,
      },
      status: "active",
    })
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return NextResponse.json({ error: "Failed to fetch tenant information" }, { status: 500 })
  }
}

