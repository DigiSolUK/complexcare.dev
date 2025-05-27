"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTenant } from "@/contexts/tenant-context"

interface OnboardingCheckProps {
  children: React.ReactNode
}

export function OnboardingCheck({ children }: OnboardingCheckProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { currentTenant, tenantId } = useTenant()

  useEffect(() => {
    // Skip check if already in onboarding flow
    if (pathname?.includes("/onboarding/")) {
      return
    }

    // Check if onboarding is needed
    const onboardingCompleted = localStorage.getItem(`onboarding-completed-${tenantId}`)

    if (currentTenant && !onboardingCompleted) {
      router.push(`/onboarding/${tenantId}/welcome`)
    }
  }, [currentTenant, tenantId, router, pathname])

  return <>{children}</>
}
