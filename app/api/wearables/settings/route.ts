import { NextResponse } from "next/server"
import {
  getWearableIntegrationSettings,
  saveWearableIntegrationSettings,
} from "@/lib/services/wearable-integration-service"
import { getTenantIdFromRequest } from "@/lib/tenant-utils"
import { logError } from "@/lib/services/error-logging-service"

export async function GET(request: Request) {
  try {
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const settings = await getWearableIntegrationSettings(tenantId)

    return NextResponse.json(settings)
  } catch (error) {
    logError({
      message: `Error fetching wearable integration settings: ${error}`,
      stack: (error as Error).stack,
      componentPath: "app/api/wearables/settings/route.ts:GET",
      severity: "medium",
    })

    return NextResponse.json({ error: "Failed to fetch wearable integration settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const tenantId = getTenantIdFromRequest(request)

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const data = await request.json()

    // Add tenant ID to the data
    data.tenant_id = tenantId

    const settings = await saveWearableIntegrationSettings(data)

    if (!settings) {
      return NextResponse.json({ error: "Failed to save wearable integration settings" }, { status: 500 })
    }

    return NextResponse.json(settings)
  } catch (error) {
    logError({
      message: `Error saving wearable integration settings: ${error}`,
      stack: (error as Error).stack,
      componentPath: "app/api/wearables/settings/route.ts:POST",
      severity: "high",
    })

    return NextResponse.json({ error: "Failed to save wearable integration settings" }, { status: 500 })
  }
}
