"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface TenantContextType {
  currentTenantId: string
  setCurrentTenantId: (id: string) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children, initialTenantId }: { children: ReactNode; initialTenantId: string }) {
  const [currentTenantId, setCurrentTenantId] = useState(initialTenantId)

  // Persist tenant ID to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentTenantId", currentTenantId)
    }
  }, [currentTenantId])

  // Load tenant ID from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTenantId = localStorage.getItem("currentTenantId")
      if (storedTenantId) {
        setCurrentTenantId(storedTenantId)
      }
    }
  }, [])

  return <TenantContext.Provider value={{ currentTenantId, setCurrentTenantId }}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}

