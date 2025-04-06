"use server"

import { cookies } from "next/headers"
import { signOut } from "@/auth"

export async function updateTenantCookie(tenantId: string) {
  cookies().set("tenantId", tenantId)
}

export async function logout() {
  await signOut()
}

