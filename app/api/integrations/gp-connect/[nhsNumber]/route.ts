import { type NextRequest, NextResponse } from "next/server"
import { GPConnectService } from "@/lib/integrations/gp-connect"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { nhsNumber: string } }) {
  try {
    // Get the NHS number from the URL parameters
    const { nhsNumber } = params

    // Get the current user and tenant ID
    let tenantId = "demo-tenant"
    try {
      const user = await getCurrentUser()
      if (user) {
        tenantId = user.tenant_id
      }
    } catch (authError) {
      console.error("Authentication error:", authError)
      // Continue without user - we'll use demo tenant
    }

    // Get the data type from the query parameters
    const dataType = request.nextUrl.searchParams.get("dataType") || "patient"

    // Initialize the GP Connect service
    const gpConnectService = new GPConnectService(tenantId)
    await gpConnectService.initialize()

    // Get the requested data based on the data type
    let data = null
    switch (dataType) {
      case "patient":
        data = await gpConnectService.getPatient(nhsNumber)
        break
      case "medications":
        data = await gpConnectService.getMedications(nhsNumber)
        break
      case "allergies":
        data = await gpConnectService.getAllergies(nhsNumber)
        break
      case "immunizations":
        data = await gpConnectService.getImmunizations(nhsNumber)
        break
      case "conditions":
        data = await gpConnectService.getConditions(nhsNumber)
        break
      case "all":
        // Get all data types
        const patient = await gpConnectService.getPatient(nhsNumber)
        const medications = await gpConnectService.getMedications(nhsNumber)
        const allergies = await gpConnectService.getAllergies(nhsNumber)
        const immunizations = await gpConnectService.getImmunizations(nhsNumber)
        const conditions = await gpConnectService.getConditions(nhsNumber)

        data = {
          patient,
          medications,
          allergies,
          immunizations,
          conditions,
        }
        break
      default:
        return NextResponse.json({ error: `Invalid data type: ${dataType}` }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: `No data found for NHS number: ${nhsNumber}` }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GP Connect API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
