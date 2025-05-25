"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

// Define the Tenant type
export interface Tenant {
  id: string
  name: string
  slug: string
  plan?: string
  logoUrl?: string
}

// Define the context type
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

// Create the context with default values
const TenantContext = createContext<TenantContextType>({
  currentTenant: null,
  tenants: [],
  tenantId: DEFAULT_TENANT_ID,
  isLoading: true,
  error: null,
  setTenantId: () => {},
  switchTenant: async () => {},
  refreshTenants: async () => {},
})

// Provider component
export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [tenantId, setTenantIdState] = useState<string>(DEFAULT_TENANT_ID)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to set tenant ID
  const setTenantId = (id: string) => {
    setTenantIdState(id || DEFAULT_TENANT_ID)
  }

  // Function to fetch tenants
  const fetchTenants = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // For demo purposes, we'll use mock data instead of fetching from API
      // In a real app, you would fetch from /api/user/tenants
      const mockTenants: Tenant[] = [
        { id: "tenant-1", name: "Main Hospital", slug: "main-hospital", plan: "Enterprise" },
        { id: "tenant-2", name: "North Clinic", slug: "north-clinic", plan: "Professional" },
        { id: "tenant-3", name: "South Care Center", slug: "south-care", plan: "Standard" },
      ]

      setTenants(mockTenants)

      // Set the first tenant as current if none is selected
      if (!currentTenant && mockTenants.length > 0) {
        setCurrentTenant(mockTenants[0])
        setTenantId(mockTenants[0].id)
      }
    } catch (err) {
      console.error("Error fetching tenants:", err)
      setError("Failed to load tenants. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to switch tenant
  const switchTenant = async (newTenantId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Find the tenant in the list
      const tenant = tenants.find((t) => t.id === newTenantId)

      if (!tenant) {
        throw new Error("Tenant not found")
      }

      // In a real app, you would call an API to set the primary tenant
      // await fetch("/api/user/tenants/primary", {...})

      setCurrentTenant(tenant)
      setTenantId(tenant.id)

      // In a real app, you might want to reload the page or refetch data
      // window.location.reload()
    } catch (err) {
      console.error("Error switching tenant:", err)
      setError("Failed to switch tenant. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to refresh tenants
  const refreshTenants = async () => {
    await fetchTenants()
  }

  // Fetch tenants on mount
  useEffect(() => {
    fetchTenants()
  }, [])

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenants,
        tenantId,
        isLoading,
        error,
        setTenantId,
        switchTenant,
        refreshTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

// Hook to use the tenant context
export function useTenantContext() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error("useTenantContext must be used within a TenantProvider")
  }
  return context
}

// Export both names for compatibility
export const useTenant = useTenantContext
