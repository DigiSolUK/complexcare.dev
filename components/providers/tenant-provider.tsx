"use client"

import type { ReactNode } from "react"
import { TenantProvider as TenantContextProvider, useTenant as useTenantContext } from "@/lib/tenant-context"

// Re-export the hook for easier access from consuming components
export const useTenant = useTenantContext

export function TenantProvider({ children }: { children: ReactNode }) {
  return <TenantContextProvider>{children}</TenantContextProvider>
}
