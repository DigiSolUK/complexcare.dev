"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface TenantContextType {
  tenantId: string | null
  setTenantId: (id: string | null) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  // In a production multi-tenant application with authentication,
  // the tenantId would typically be derived from the authenticated user's session.
  // Since authentication is not configured, we're using a default from environment variables.
  const [tenantId, setTenantId] = useState<string | null>(null)

  useEffect(() => {
    // Load the default tenant ID from environment variables
    const defaultId = process.env.DEFAULT_TENANT_ID || null
    if (defaultId) {
      setTenantId(defaultId)
    } else {
      console.warn("DEFAULT_TENANT_ID is not set. Some features may not work correctly without a tenant ID.")
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
