"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { DEFAULT_TENANT_ID, getCurrentTenantId } from "@/lib/tenant"
import type { Tenant } from "@/types"

interface TenantContextType {
  tenantId: string
  setTenantId: (id: string) => void
  currentTenant: Tenant | null
  tenants: Tenant[]
  isLoading: boolean
  error: string | null
  switchTenant: (tenantId: string) => Promise<void>
  refreshTenants: () => Promise<void>
}

const TenantContext = createContext<TenantContextType>({
  tenantId: DEFAULT_TENANT_ID,
  setTenantId: () => {},
  currentTenant: null,
  tenants: [],
  isLoading: true,
  error: null,
  switchTenant: async () => {},
  refreshTenants: async () => {},
})

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState<string>(DEFAULT_TENANT_ID)
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to validate and set tenant ID
  const setTenantId = (id: string) => {
    const validTenantId = getCurrentTenantId(id)
    setTenantIdState(validTenantId)
  }

  const fetchTenants = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch user's tenants
      const response = await fetch("/api/user/tenants")

      if (!response.ok) {
        throw new Error("Failed to fetch tenants")
      }

      const tenantsData = await response.json()
      setTenants(tenantsData)

      // Fetch primary tenant
      const primaryResponse = await fetch("/api/user/tenants/primary")

      if (primaryResponse.ok) {
        const primaryTenant = await primaryResponse.json()
        setCurrentTenant(primaryTenant)
        setTenantIdState(primaryTenant.id)
      } else if (tenantsData.length > 0) {
        // If no primary tenant is set but user has tenants, use the first one
        setCurrentTenant(tenantsData[0])
        setTenantIdState(tenantsData[0].id)
      }
    } catch (err) {
      console.error("Error fetching tenants:", err)
      setError("Failed to load tenants. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const switchTenant = async (newTenantId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Find the tenant in the list
      const tenant = tenants.find((t) => t.id === newTenantId)

      if (!tenant) {
        throw new Error("Tenant not found")
      }

      // Set as primary tenant
      const response = await fetch("/api/user/tenants/primary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenantId: newTenantId }),
      })

      if (!response.ok) {
        throw new Error("Failed to switch tenant")
      }

      setCurrentTenant(tenant)
      setTenantIdState(newTenantId)

      // Reload the page to refresh data for the new tenant
      window.location.reload()
    } catch (err) {
      console.error("Error switching tenant:", err)
      setError("Failed to switch tenant. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTenants = async () => {
    await fetchTenants()
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  // Log tenant ID changes for debugging
  useEffect(() => {
    console.log("Tenant ID set to:", tenantId)
  }, [tenantId])

  return (
    <TenantContext.Provider
      value={{
        tenantId,
        setTenantId,
        currentTenant,
        tenants,
        isLoading,
        error,
        switchTenant,
        refreshTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

// Export both names for compatibility
export function useTenant() {
  const context = useContext(TenantContext)

  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider")
  }

  return context
}

export const useTenantContext = useTenant
