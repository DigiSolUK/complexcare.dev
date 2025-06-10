"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"

// Define tenant type
export type Tenant = {
  id: string
  name: string
  branding?: {
    logoUrl?: string
    primaryColor?: string
  }
}

// Create a demo tenant
const demoTenant: Tenant = {
  id: "ba367cfe-6de0-4180-9566-1002b75cf82c",
  name: "ComplexCare UK",
  branding: {
    logoUrl: "/intertwined-circles.png",
    primaryColor: "#4f46e5",
  },
}

// Define the tenant context type
type TenantContextType = {
  currentTenant: Tenant | null
  isLoading: boolean
  error: Error | null
}

// Create the tenant context with default values
const TenantContext = createContext<TenantContextType>({
  currentTenant: null,
  isLoading: true,
  error: null,
})

// Tenant provider component
export function TenantProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Simulate loading the tenant
    const timer = setTimeout(() => {
      setCurrentTenant(demoTenant)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return <TenantContext.Provider value={{ currentTenant, isLoading, error }}>{children}</TenantContext.Provider>
}

// Hook to use the tenant context
export function useTenant() {
  return useContext(TenantContext)
}
