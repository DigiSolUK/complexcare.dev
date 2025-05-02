import { NextResponse } from "next/server"
import { getPatientWearableDevices } from "@/lib/services/wearable-integration-service"
import { getTenantIdFromRequest } from "@/lib/tenant-utils"
import { logError } from "@/lib/services/error-logging-service"

export async function GET(request: Request, { params }: { params: { patientId: string } }) {
  try {
    const tenantId = getTenantIdFromRequest(request)
    const patientId = params.patientId

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const devices = await getPatientWearableDevices(patientId, tenantId)

    return NextResponse.json(devices)
  } catch (error) {
    logError({
      message: `Error fetching patient wearable devices: ${error}`,
      stack: (error as Error).stack,
      componentPath: "app/api/wearables/devices/[patientId]/route.ts:GET",
      severity: "medium",
    })

    return NextResponse.json({ error: "Failed to fetch patient wearable devices" }, { status: 500 })
  }
}
