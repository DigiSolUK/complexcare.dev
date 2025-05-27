"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTenant } from "@/contexts/tenant-context"

export default function OnboardingRedirect({ params }: { params: { tenantId: string } }) {
  const router = useRouter()
  const { tenantId } = useTenant()

  useEffect(() => {
    router.push(`/onboarding/${params.tenantId || tenantId}/welcome`)
  }, [router, params.tenantId, tenantId])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Loading...</div>
    </div>
  )
}
