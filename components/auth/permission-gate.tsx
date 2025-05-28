"use client"

import type { ReactNode } from "react"
import type { Permission } from "@/lib/auth/permissions"

type PermissionGateProps = {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  // Always grant permission in public mode
  return <>{children}</>
}
