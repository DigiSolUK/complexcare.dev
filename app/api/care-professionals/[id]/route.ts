import { type NextRequest, NextResponse } from "next/server"
import {
  getCareProfessionalById,
  updateCareProfessional,
  deactivateCareProfessional,
} from "@/lib/services/care-professional-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Set a flag for demo mode
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
    let tenantId = "demo-tenant"

    if (!demoMode) {
      try {
        const user = await getCurrentUser()
        if (!user) {
          return NextResponse.json({ error: "Unauthorized - Please log in to access this resource" }, { status: 401 })
        }
        tenantId = user.tenant_id
      } catch (authError) {
        console.error("Authentication error:", authError)
        // Fall back to demo mode if authentication fails
      }
    }

    const professional = await getCareProfessionalById(tenantId, params.id)

    if (!professional) {
      return NextResponse.json({ error: "Care professional not found" }, { status: 404 })
    }

    return NextResponse.json(professional)
  } catch (error) {
    console.error("Error in GET /api/care-professionals/[id]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Set a flag for demo mode
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
    let tenantId = "demo-tenant"
    let userId = "demo-user"

    if (!demoMode) {
      try {
        const user = await getCurrentUser()
        if (!user) {
          return NextResponse.json({ error: "Unauthorized - Please log in to access this resource" }, { status: 401 })
        }
        tenantId = user.tenant_id
        userId = user.id
      } catch (authError) {
        console.error("Authentication error:", authError)
        // Fall back to demo mode if authentication fails
      }
    }

    const data = await request.json()
    const professional = await updateCareProfessional(tenantId, params.id, data, userId)

    if (!professional) {
      return NextResponse.json({ error: "Failed to update care professional" }, { status: 400 })
    }

    return NextResponse.json(professional)
  } catch (error) {
    console.error("Error in PUT /api/care-professionals/[id]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Set a flag for demo mode
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
    let tenantId = "demo-tenant"
    let userId = "demo-user"

    if (!demoMode) {
      try {
        const user = await getCurrentUser()
        if (!user) {
          return NextResponse.json({ error: "Unauthorized - Please log in to access this resource" }, { status: 401 })
        }
        tenantId = user.tenant_id
        userId = user.id
      } catch (authError) {
        console.error("Authentication error:", authError)
        // Fall back to demo mode if authentication fails
      }
    }

    const professional = await deactivateCareProfessional(tenantId, params.id, userId)

    if (!professional) {
      return NextResponse.json({ error: "Failed to deactivate care professional" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/care-professionals/[id]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

