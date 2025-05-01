"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useTenant } from "@/components/providers/tenant-provider"

interface FeatureGateProps {
  featureId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ featureId, children, fallback }: FeatureGateProps) {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { tenantId } = useTenant()

  useEffect(() => {
    async function checkFeature() {
      try {
        const response = await fetch(`/api/features/check?featureId=${featureId}&tenantId=${tenantId}`)
        const data = await response.json()
        setIsEnabled(data.enabled)
      } catch (error) {
        console.error("Error checking feature:", error)
        setIsEnabled(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkFeature()
  }, [featureId, tenantId])

  if (isLoading) {
    return <div className="p-4 animate-pulse bg-muted rounded-md">Loading feature...</div>
  }

  if (!isEnabled) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Feature not available</AlertTitle>
        <AlertDescription>
          This feature is not included in your current plan.
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/pricing")}>
              Upgrade Plan
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
