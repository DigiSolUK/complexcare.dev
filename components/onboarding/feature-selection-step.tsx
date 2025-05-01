"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FeatureSelector } from "./feature-selector"

interface FeatureSelectionStepProps {
  onNext: (data: { features: string[]; planId: string | null; totalPrice: number }) => void
  onBack: () => void
  initialData?: {
    features: string[]
    planId: string | null
    totalPrice: number
  }
}

export function FeatureSelectionStep({
  onNext,
  onBack,
  initialData = { features: [], planId: null, totalPrice: 0 },
}: FeatureSelectionStepProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialData.features)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(initialData.planId)
  const [totalPrice, setTotalPrice] = useState<number>(initialData.totalPrice)

  const handleFeaturesSelected = (features: string[], planId: string | null, price: number) => {
    setSelectedFeatures(features)
    setSelectedPlan(planId)
    setTotalPrice(price)
  }

  const handleNext = () => {
    onNext({
      features: selectedFeatures,
      planId: selectedPlan,
      totalPrice,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Features</CardTitle>
        <CardDescription>
          Choose the features you need for your organization. You can start with a pre-configured plan or build a custom
          solution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeatureSelector
          onFeaturesSelected={handleFeaturesSelected}
          initialFeatures={initialData.features}
          initialPlanId={initialData.planId}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </CardFooter>
    </Card>
  )
}
