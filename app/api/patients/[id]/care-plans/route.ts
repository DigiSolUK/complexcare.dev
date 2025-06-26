import { NextResponse } from "next/server"
import { getCarePlansForPatient } from "@/lib/services/care-plan-service"
import { auth } from "@/lib/auth"
import { getTenantId } from "@/lib/tenant-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = getTenantId(request)
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const patientId = params.id
    const carePlans = await getCarePlansForPatient(tenantId, patientId)
    return NextResponse.json(carePlans)
  } catch (error) {
    console.error("Failed to fetch care plans for patient:", error)
    return NextResponse.json({ error: "Failed to fetch care plans for patient" }, { status: 500 })
  }
}
