"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Tenant = {
  id: string
  name: string
  domain: string
  settings: Record<string, any>
  features: string[]
  status: "active" | "inactive" | "suspended"
}

type TenantContextType = {
  tenant: Tenant | null
  isLoading: boolean
  error: Error | null
  setTenant: (tenant: Tenant) => void
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  error: null,
  setTenant: () => {},
})

export function TenantProvider({
  children,
  initialTenant = null,
}: {
  children: ReactNode
  initialTenant?: Tenant | null
}) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant)
  const [isLoading, setIsLoading] = useState<boolean>(!initialTenant)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (initialTenant) return

    async function fetchTenant() {
      try {
        const response = await fetch("/api/tenant")
        if (!response.ok) {
          throw new Error("Failed to fetch tenant information")
        }
        const data = await response.json()
        setTenant(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenant()
  }, [initialTenant])

  return <TenantContext.Provider value={{ tenant, isLoading, error, setTenant }}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}

