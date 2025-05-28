"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define default tenant ID
const DEFAULT_TENANT_ID = "ba367cfe-6de0-4180-9566-1002b75cf82c"

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

      // Mock tenants data
      const mockTenants: Tenant[] = [
        { id: DEFAULT_TENANT_ID, name: "Main Hospital", slug: "main-hospital", plan: "Enterprise" },
        { id: "tenant-2", name: "North Clinic", slug: "north-clinic", plan: "Professional" },
        { id: "tenant-3", name: "South Care Center", slug: "south-care", plan: "Standard" },
      ]

      setTenants(mockTenants)

      // Set the first tenant as current
      const defaultTenant = mockTenants.find((t) => t.id === DEFAULT_TENANT_ID) || mockTenants[0]
      setCurrentTenant(defaultTenant)
      setTenantId(defaultTenant.id)
    } catch (err) {
      console.error("Error fetching tenants:", err)
      setError("Failed to load tenants. Please try again.")

      // Set a default tenant even if there's an error
      const defaultTenant = { id: DEFAULT_TENANT_ID, name: "Default Hospital", slug: "default-hospital" }
      setCurrentTenant(defaultTenant)
      setTenants([defaultTenant])
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

      setCurrentTenant(tenant)
      setTenantId(tenant.id)
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
    console.error("useTenantContext must be used within a TenantProvider")
    // Return default values instead of throwing
    return {
      currentTenant: { id: DEFAULT_TENANT_ID, name: "Default Hospital", slug: "default-hospital" },
      tenants: [{ id: DEFAULT_TENANT_ID, name: "Default Hospital", slug: "default-hospital" }],
      tenantId: DEFAULT_TENANT_ID,
      isLoading: false,
      error: null,
      setTenantId: () => {},
      switchTenant: async () => {},
      refreshTenants: async () => {},
    }
  }
  return context
}

// Export both names for compatibility
export const useTenant = useTenantContext
