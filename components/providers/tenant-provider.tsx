"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import { DEFAULT_TENANT_ID, getCurrentTenantId } from "@/lib/tenant"

// Define the Tenant context type
interface TenantContextType {
  tenantId: string
  setTenantId: (id: string) => void
}

// Create the context with default values
const TenantContext = createContext<TenantContextType>({
  tenantId: DEFAULT_TENANT_ID,
  setTenantId: () => {},
})

// Export the tenant provider component
export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState<string>(DEFAULT_TENANT_ID)

  // Function to validate and set tenant ID
  const handleSetTenantId = (id: string) => {
    // Use our utility to validate and get a safe tenant ID
    const validTenantId = getCurrentTenantId(id)
    setTenantId(validTenantId)
  }

  // Log tenant ID changes for debugging
  useEffect(() => {
    console.log("Tenant ID set to:", tenantId)
  }, [tenantId])

  return (
    <TenantContext.Provider
      value={{
        tenantId,
        setTenantId: handleSetTenantId,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

// Create a hook for using the tenant context
export function useTenant() {
  const context = useContext(TenantContext)

  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider")
  }

  return context
}
