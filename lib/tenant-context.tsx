"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface TenantBranding {
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
}

interface Tenant {
  id: string
  name: string
  branding?: TenantBranding
}

interface TenantContextType {
  currentTenant: Tenant | null
  isLoading: boolean
  error: string | null
  setTenant: (tenantId: string) => void // This might be simplified or removed later if tenant switching isn't needed without auth
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenant = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // In a non-authenticated setup, we rely on a default tenant ID from env
        const defaultTenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || process.env.DEFAULT_TENANT_ID

        if (!defaultTenantId) {
          throw new Error("DEFAULT_TENANT_ID is not configured in environment variables.")
        }

        // For this project, we'll use a simple mock tenant based on the default ID
        // as there's no explicit API for tenant details without authentication.
        const mockTenant: Tenant = {
          id: defaultTenantId,
          name: "ComplexCare CRM", // Default name
          branding: {
            logoUrl: "/placeholder.svg", // Default logo
            primaryColor: "#007bff",
            secondaryColor: "#6c757d",
          },
        }
        setCurrentTenant(mockTenant)
      } catch (err) {
        console.error("Failed to load tenant:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred while loading tenant.")
        setCurrentTenant(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenant()
  }, []) // Empty dependency array means this runs once on mount

  const setTenant = (tenantId: string) => {
    // In a non-authenticated setup, changing tenant might involve
    // reloading the app or changing the DEFAULT_TENANT_ID env var.
    // For now, we'll just update the state directly for demonstration.
    setCurrentTenant((prev) => ({
      ...prev,
      id: tenantId,
      name: `Tenant ${tenantId.substring(0, 8)}`, // Simple name for demonstration
    }))
  }

  return (
    <TenantContext.Provider value={{ currentTenant, isLoading, error, setTenant }}>{children}</TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}
