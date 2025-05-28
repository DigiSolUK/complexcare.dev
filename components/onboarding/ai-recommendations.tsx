"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, CheckCircle2, RefreshCw, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getOnboardingRecommendations } from "@/lib/ai/onboarding-ai-service"
import type { OrganizationProfile, OnboardingRecommendation } from "@/lib/ai/onboarding-ai-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AIRecommendationsProps {
  organizationProfile: Partial<OrganizationProfile>
  onApplyRecommendations?: (recommendations: OnboardingRecommendation) => void
}

export function AIRecommendations({ organizationProfile, onApplyRecommendations }: AIRecommendationsProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [recommendations, setRecommendations] = useState<OnboardingRecommendation | null>(null)

  const loadRecommendations = async (showToast = false) => {
    try {
      const result = await getOnboardingRecommendations(organizationProfile)
      setRecommendations(result)
      if (showToast) {
        toast({
          title: "Recommendations updated",
          description: "AI recommendations have been refreshed based on your organization profile.",
        })
      }
    } catch (error) {
      console.error("Error loading recommendations:", error)
      if (showToast) {
        toast({
          title: "Error loading recommendations",
          description: "There was a problem generating AI recommendations.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (organizationProfile.name) {
      loadRecommendations()
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadRecommendations(true)
  }

  const handleApply = () => {
    if (recommendations && onApplyRecommendations) {
      onApplyRecommendations(recommendations)
      toast({
        title: "Recommendations applied",
        description: "AI recommendations have been applied to your setup.",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-6 w-24" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!organizationProfile.name) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            AI Setup Recommendations
          </CardTitle>
          <CardDescription>Complete your organization profile to get personalized AI recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 text-center text-muted-foreground">
            <p>AI will analyze your organization details to provide tailored setup recommendations.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            AI Setup Recommendations
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
        <CardDescription>Personalized recommendations based on your organization profile</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <h3 className="text-sm font-medium">Recommended Modules</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Core system modules recommended for your organization type</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendations.modules.map((module) => (
                  <Badge key={module} variant="secondary">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <h3 className="text-sm font-medium">Recommended Features</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Features that would benefit your organization based on your profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendations.features.map((feature) => (
                  <Badge key={feature} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <h3 className="text-sm font-medium">Suggested Integrations</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">External systems that would integrate well with your setup</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendations.integrations.map((integration) => (
                  <Badge key={integration} variant="outline" className="bg-blue-50">
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <h3 className="text-sm font-medium">Recommended User Roles</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">User roles that align with your organization structure</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendations.roles.map((role) => (
                  <Badge key={role} variant="outline" className="bg-green-50">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Setup Priorities</h3>
              <ul className="space-y-2">
                {recommendations.setupPriorities.map((priority, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{priority}</span>
                  </li>
                ))}
              </ul>
            </div>

            {onApplyRecommendations && (
              <Button className="w-full" onClick={handleApply}>
                <Sparkles className="h-4 w-4 mr-2" />
                Apply These Recommendations
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center p-6">
            <p>No recommendations available. Try refreshing.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
