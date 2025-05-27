"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { useTenant } from "@/contexts/tenant-context"
import { useToast } from "@/components/ui/use-toast"
import { AIEnhancedOrganizationForm } from "@/components/onboarding/ai-enhanced-organization-form"
import { AIRecommendations } from "@/components/onboarding/ai-recommendations"
import type { OrganizationProfile, OnboardingRecommendation } from "@/lib/ai/onboarding-ai-service"

export default function OrganizationProfilePage() {
  const { markStepAsCompleted } = useOnboarding()
  const { currentTenant } = useTenant()
  const { toast } = useToast()
  const [organizationProfile, setOrganizationProfile] = useState<Partial<OrganizationProfile>>({
    name: currentTenant?.name || "",
  })

  const handleFormSubmit = async (data: OrganizationProfile) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update local state
    setOrganizationProfile(data)

    toast({
      title: "Organization profile updated",
      description: "Your organization profile has been saved successfully.",
    })

    markStepAsCompleted("organization")
  }

  const handleApplyRecommendations = (recommendations: OnboardingRecommendation) => {
    // In a real implementation, this would update various settings based on recommendations
    console.log("Applying recommendations:", recommendations)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organization Profile</h1>
        <p className="text-muted-foreground mt-2">Complete your organization details to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIEnhancedOrganizationForm initialData={organizationProfile} onSubmit={handleFormSubmit} />
        </div>
        <div>
          <AIRecommendations
            organizationProfile={organizationProfile}
            onApplyRecommendations={handleApplyRecommendations}
          />
        </div>
      </div>
    </div>
  )
}
