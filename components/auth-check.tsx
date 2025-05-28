"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const router = useRouter()

  // For development, always consider the user authenticated
  useEffect(() => {
    setIsAuthenticated(true)
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
