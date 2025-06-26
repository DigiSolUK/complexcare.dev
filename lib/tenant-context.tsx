"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Tenant } from "@/types"

interface TenantContextType {
  currentTenant: Tenant | null
  tenants: Tenant[]
  isLoading: boolean
  error: string | null
  switchTenant: (tenantId: string) => Promise<void>
  refreshTenants: () => Promise<void>
}

const TenantContext = createContext<TenantContextType>({
  currentTenant: null,
  tenants: [],
  isLoading: true,
  error: null,
  switchTenant: async () => {},
  refreshTenants: async () => {},
})

export const useTenant = () => useContext(TenantContext)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      } else if (tenantsData.length > 0) {
        // If no primary tenant is set but user has tenants, use the first one
        setCurrentTenant(tenantsData[0])
      }
    } catch (err) {
      console.error("Error fetching tenants:", err)
      setError("Failed to load tenants. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const switchTenant = async (tenantId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Find the tenant in the list
      const tenant = tenants.find((t) => t.id === tenantId)

      if (!tenant) {
        throw new Error("Tenant not found")
      }

      // Set as primary tenant
      const response = await fetch("/api/user/tenants/primary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenantId }),
      })

      if (!response.ok) {
        throw new Error("Failed to switch tenant")
      }

      setCurrentTenant(tenant)

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

  return (
    <TenantContext.Provider
      value={{
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
