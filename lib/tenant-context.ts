"use client"

import { createContext, useContext } from "react"

export interface Tenant {
  id: string
  name: string
  slug: string
  plan?: string
  logoUrl?: string
}

interface TenantContextType {
  currentTenant: Tenant | null
  tenants: Tenant[]
  tenantId: string
  isLoading: boolean
  error: string | null
  setTenantId: (id: string) => void
  switchTenant: (tenantId: string) => Promise<void>
  refreshTenants: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function useTenantContext() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error("useTenantContext must be used within a TenantProvider")
  }
  return context
}

export const useTenant = useTenantContext

// Re-export the provider from contexts
export { TenantProvider } from "@/contexts/tenant-context"
