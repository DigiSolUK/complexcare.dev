"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface TenantContextType {
  tenantId: string | null
  setTenantId: (id: string | null) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState<string | null>(null)

  useEffect(() => {
    // In a real application without authentication, you might fetch this from a config
    // or rely on a hardcoded default for development/single-tenant setups.
    // For this project, we're using the DEFAULT_TENANT_ID environment variable.
    const defaultTenantId = process.env.DEFAULT_TENANT_ID
    if (defaultTenantId) {
      setTenantId(defaultTenantId)
    } else {
      console.warn("DEFAULT_TENANT_ID environment variable is not set.")
      // Fallback for development if env var is not set, or handle error
      setTenantId("default-tenant-id-if-not-set") // Consider a more robust error handling or default
    }
  }, [])

  return <TenantContext.Provider value={{ tenantId, setTenantId }}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}
