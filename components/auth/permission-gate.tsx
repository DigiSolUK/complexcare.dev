"use client"

import { type ReactNode, useEffect, useState } from "react"
import type { Permission } from "@/lib/auth/permissions"

type PermissionGateProps = {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPermission() {
      try {
        const response = await fetch(`/api/auth/check-permission?permission=${permission}`)
        const data = await response.json()
        setHasPermission(data.hasPermission)
      } catch (error) {
        console.error("Error checking permission:", error)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkPermission()
  }, [permission])

  if (isLoading) {
    return null // Or a loading indicator
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>
}
