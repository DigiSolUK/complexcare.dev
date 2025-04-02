import { type NextRequest, NextResponse } from "next/server"
import { getCareProfessionals, createCareProfessional } from "@/lib/services/care-professional-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
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
        console.log("Authentication failed, using demo data")
        return NextResponse.json(await getCareProfessionals("demo-tenant"))
      }
    }

    try {
      const professionals = await getCareProfessionals(tenantId)
      return NextResponse.json(professionals)
    } catch (dbError) {
      console.error("Database error:", dbError)
      // If database query fails, return demo data
      console.log("Database query failed, using demo data")
      return NextResponse.json(await getCareProfessionals("demo-tenant"))
    }
  } catch (error) {
    console.error("Error in GET /api/care-professionals:", error)
    // Always return a valid response to prevent client-side errors
    return NextResponse.json(await getCareProfessionals("demo-tenant"))
  }
}

export async function POST(request: NextRequest) {
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
    const professional = await createCareProfessional(tenantId, data, userId)

    if (!professional) {
      return NextResponse.json({ error: "Failed to create care professional" }, { status: 400 })
    }

    return NextResponse.json(professional, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/care-professionals:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

