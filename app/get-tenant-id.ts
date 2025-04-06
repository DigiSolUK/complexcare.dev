"use server"

import { cookies } from "next/headers"

export async function getTenantIdFromCookies(): Promise<string> {
  try {
    const tenantId = cookies().get("tenantId")?.value || "demo-tenant-1"
    return tenantId
  } catch (error) {
    console.error("Error accessing cookies in server action:", error)
    return "demo-tenant-1"
  }
}

