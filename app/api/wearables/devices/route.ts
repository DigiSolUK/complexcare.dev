import { NextResponse } from "next/server"
import { registerWearableDevice } from "@/lib/services/wearable-integration-service"
import { getTenantIdFromRequest } from "@/lib/tenant-utils"
import { logError } from "@/lib/services/error-logging-service"

export async function POST(request: Request) {
  try {
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const data = await request.json()

    // Add tenant ID to the data
    data.tenant_id = tenantId

    const device = await registerWearableDevice(data)

    if (!device) {
      return NextResponse.json({ error: "Failed to register wearable device" }, { status: 500 })
    }

    return NextResponse.json(device)
  } catch (error) {
    logError({
      message: `Error registering wearable device: ${error}`,
      stack: (error as Error).stack,
      componentPath: "app/api/wearables/devices/route.ts:POST",
      severity: "medium",
    })

    return NextResponse.json({ error: "Failed to register wearable device" }, { status: 500 })
  }
}
