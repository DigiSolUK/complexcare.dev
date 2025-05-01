"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { featureCatalog, type FeatureCategory, type Feature } from "@/lib/features/feature-catalog"

export function PricingCalculator() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [basePrice, setBasePrice] = useState(99)
  const [totalPrice, setTotalPrice] = useState(99)

  // Calculate total price whenever selected features change
  useEffect(() => {
    let price = basePrice

    // Add up the price of all selected features
    selectedFeatures.forEach((featureId) => {
      // Find the feature in the catalog
      for (const category of Object.values(featureCatalog)) {
        const feature = category.features.find((f) => f.id === featureId)
        if (feature) {
          price += feature.pricePerMonth
          break
        }
      }
    })

    setTotalPrice(price)
  }, [selectedFeatures, basePrice])

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  const renderFeatureCategory = (category: FeatureCategory) => {
    return (
      <div key={category.id} className="mb-6">
        <h3 className="text-lg font-medium mb-2">{category.name}</h3>
        <div className="space-y-2">{category.features.map((feature) => renderFeature(feature))}</div>
      </div>
    )
  }

  const renderFeature = (feature: Feature) => {
    const isSelected = selectedFeatures.includes(feature.id)

    return (
      <div key={feature.id} className="flex items-center space-x-2">
        <Checkbox id={feature.id} checked={isSelected} onCheckedChange={() => toggleFeature(feature.id)} />
        <Label htmlFor={feature.id} className="flex-1 cursor-pointer">
          {feature.name}
        </Label>
        <span className="text-sm text-muted-foreground">
          {feature.pricePerMonth > 0 ? `+£${feature.pricePerMonth}/mo` : "Included"}
        </span>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Customize Your Plan</CardTitle>
        <CardDescription>Select the features you need and see your custom pricing instantly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Core Platform</h3>
            <div className="flex items-center justify-between">
              <span>Base Platform</span>
              <span className="font-medium">£{basePrice}/mo</span>
            </div>
            <Separator />

            {/* Feature Categories */}
            {Object.values(featureCatalog).map(renderFeatureCategory)}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Custom Plan</CardTitle>
                <CardDescription>Based on your selected features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Platform</span>
                    <span>£{basePrice}/mo</span>
                  </div>

                  {selectedFeatures.length > 0 && (
                    <>
                      <Separator />
                      {selectedFeatures.map((featureId) => {
                        // Find the feature in the catalog
                        let feature: Feature | undefined
                        for (const category of Object.values(featureCatalog)) {
                          feature = category.features.find((f) => f.id === featureId)
                          if (feature) break
                        }

                        if (!feature) return null

                        return (
                          <div key={featureId} className="flex justify-between">
                            <span>{feature.name}</span>
                            <span>{feature.pricePerMonth > 0 ? `+£${feature.pricePerMonth}/mo` : "Included"}</span>
                          </div>
                        )
                      })}
                    </>
                  )}

                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>£{totalPrice}/mo</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started with This Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
