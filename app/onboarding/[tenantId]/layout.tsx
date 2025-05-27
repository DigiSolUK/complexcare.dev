import type React from "react"
import { OnboardingProvider } from "@/contexts/onboarding-context"
import { OnboardingSidebar } from "@/components/onboarding/onboarding-sidebar"
import { AIOnboardingAssistant } from "@/components/onboarding/ai-onboarding-assistant"
import { TenantProvider } from "@/contexts/tenant-context"

export default function OnboardingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenantId: string }
}) {
  return (
    <TenantProvider>
      <OnboardingProvider>
        <div className="flex min-h-screen bg-gray-50">
          <OnboardingSidebar />
          <main className="flex-1 p-8">{children}</main>
          <AIOnboardingAssistant />
        </div>
      </OnboardingProvider>
    </TenantProvider>
  )
}
