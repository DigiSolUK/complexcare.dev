"use client"

import type React from "react"

import { useTenant } from "@/contexts"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenant()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!tenant) {
      router.push("/onboarding")
    } else {
      setIsLoading(false)
    }
  }, [tenant, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
