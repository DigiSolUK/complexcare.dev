"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { StackProvider } from "@stack-ai/react" // Assuming this is the correct import for Stack SDK

interface StackAuthConfig {
  stackPublishableClientKey: string
  stackProjectId: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StackAuthConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStackConfig() {
      try {
        const response = await fetch("/api/config/stack-auth")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch Stack Auth configuration")
        }
        const data: StackAuthConfig = await response.json()
        setConfig(data)
      } catch (err: any) {
        console.error("Error fetching Stack Auth config:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStackConfig()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-medium">Loading authentication...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error loading authentication: {error}
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex h-screen items-center justify-center text-yellow-500">
        Authentication configuration not available. Please check server logs.
      </div>
    )
  }

  return (
    <StackProvider projectId={config.stackProjectId} publishableClientKey={config.stackPublishableClientKey}>
      {children}
    </StackProvider>
  )
}
