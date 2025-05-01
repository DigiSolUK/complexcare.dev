"use client"

import { useState, useEffect } from "react"
import { Check, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  type Feature,
  type FeatureCategory,
  features,
  featurePlans,
  calculatePlanPrice,
  calculateCustomPrice,
} from "@/lib/features/feature-catalog"

interface FeatureSelectorProps {
  onFeaturesSelected: (features: string[], planId: string | null, totalPrice: number) => void
  initialFeatures?: string[]
  initialPlanId?: string | null
}

export function FeatureSelector({
  onFeaturesSelected,
  initialFeatures = [],
  initialPlanId = null,
}: FeatureSelectorProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatures)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(initialPlanId)
  const [activeTab, setActiveTab] = useState<string>(initialPlanId || "custom")
  const [totalPrice, setTotalPrice] = useState<number>(0)

  // Group features by category for display
  const featuresByCategory = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = []
      }
      acc[feature.category].push(feature)
      return acc
    },
    {} as Record<FeatureCategory, Feature[]>,
  )

  // Calculate price whenever selection changes
  useEffect(() => {
    let price = 0

    if (selectedPlan) {
      price = calculatePlanPrice(selectedPlan, selectedFeatures)
    } else {
      price = calculateCustomPrice(selectedFeatures)
    }

    setTotalPrice(price)
    onFeaturesSelected(selectedFeatures, selectedPlan, price)
  }, [selectedFeatures, selectedPlan, onFeaturesSelected])

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    const plan = featurePlans.find((p) => p.id === planId)
    if (plan) {
      setSelectedPlan(planId)
      setSelectedFeatures(plan.features)
      setActiveTab(planId)
    }
  }

  // Handle custom plan selection
  const handleCustomSelect = () => {
    setSelectedPlan(null)
    setActiveTab("custom")
    // Keep current feature selection for custom plan
  }

  // Toggle feature selection for custom plan
  const toggleFeature = (featureId: string) => {
    if (selectedPlan) {
      // If a plan is selected, we're adding additional features
      const plan = featurePlans.find((p) => p.id === selectedPlan)
      if (plan && plan.features.includes(featureId)) {
        // Can't remove features included in the plan
        return
      }
    }

    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  // Check if a feature is included in the selected plan
  const isFeatureIncludedInPlan = (featureId: string): boolean => {
    if (!selectedPlan) return false
    const plan = featurePlans.find((p) => p.id === selectedPlan)
    return plan ? plan.features.includes(featureId) : false
  }

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          {featurePlans.map((plan) => (
            <TabsTrigger key={plan.id} value={plan.id} onClick={() => handlePlanSelect(plan.id)}>
              {plan.name}
            </TabsTrigger>
          ))}
          <TabsTrigger value="custom" onClick={handleCustomSelect}>
            Custom
          </TabsTrigger>
        </TabsList>

        {featurePlans.map((plan) => (
          <TabsContent key={plan.id} value={plan.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{plan.name} Plan</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <Badge variant="outline" className="text-lg font-semibold">
                    £{calculatePlanPrice(plan.id, selectedFeatures)}/month
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-medium text-lg">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {categoryFeatures.map((feature) => {
                          const isIncluded = plan.features.includes(feature.id)
                          const isSelected = selectedFeatures.includes(feature.id)

                          return (
                            <div
                              key={feature.id}
                              className={`flex items-center space-x-2 p-2 rounded-md ${
                                isIncluded ? "bg-green-50" : "bg-gray-50"
                              }`}
                            >
                              {isIncluded ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Checkbox
                                  id={`feature-${feature.id}`}
                                  checked={isSelected}
                                  onCheckedChange={() => toggleFeature(feature.id)}
                                />
                              )}
                              <label htmlFor={`feature-${feature.id}`} className="flex-1 text-sm font-medium">
                                {feature.name}
                              </label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{feature.description}</p>
                                    {!isIncluded && <p className="font-semibold mt-1">+£{feature.price}/month</p>}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Selected {selectedFeatures.length} features</span>
                  </div>
                  <div>
                    <span className="font-bold text-xl">£{totalPrice}/month</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Plan</CardTitle>
              <CardDescription>Select only the features you need</CardDescription>
              <div className="mt-2">
                <Badge variant="outline" className="text-lg font-semibold">
                  £{calculateCustomPrice(selectedFeatures)}/month
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-medium text-lg">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categoryFeatures.map((feature) => {
                        const isSelected = selectedFeatures.includes(feature.id)
                        const isCore = feature.isCore

                        return (
                          <div
                            key={feature.id}
                            className={`flex items-center space-x-2 p-2 rounded-md ${
                              isCore ? "bg-blue-50" : "bg-gray-50"
                            }`}
                          >
                            {isCore ? (
                              <Check className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Checkbox
                                id={`custom-feature-${feature.id}`}
                                checked={isSelected}
                                onCheckedChange={() => toggleFeature(feature.id)}
                              />
                            )}
                            <label htmlFor={`custom-feature-${feature.id}`} className="flex-1 text-sm font-medium">
                              {feature.name}
                              {isCore && <span className="ml-1 text-xs text-blue-600">(Core)</span>}
                            </label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{feature.description}</p>
                                  {!isCore && <p className="font-semibold mt-1">+£{feature.price}/month</p>}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Selected {selectedFeatures.length} features</span>
                </div>
                <div>
                  <span className="font-bold text-xl">£{totalPrice}/month</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
