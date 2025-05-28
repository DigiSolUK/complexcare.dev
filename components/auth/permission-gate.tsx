"use client"

import { type ReactNode, useState } from "react"
import type { Permission } from "@/lib/auth/permissions"

type PermissionGateProps = {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  // Always grant permission in development mode
  const [hasPermission, setHasPermission] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  return hasPermission ? <>{children}</> : <>{fallback}</>
}
