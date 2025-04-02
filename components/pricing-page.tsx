"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { type PricingTier, defaultPricingTiers, getFeaturesByCategory } from "@/lib/services/pricing-service"
import { featuresList } from "@/lib/services/feature-service"

interface PricingPageProps {
  currentTierId?: string
  onSelectTier?: (tierId: string) => void
  showFeatureDetails?: boolean
  isAdmin?: boolean
}

export function PricingPage({
  currentTierId,
  onSelectTier,
  showFeatureDetails = false,
  isAdmin = false,
}: PricingPageProps) {
  const [annual, setAnnual] = useState(false)
  const [tiers] = useState<PricingTier[]>(defaultPricingTiers)

  const featureMap = featuresList.reduce(
    (acc, feature) => {
      acc[feature.key] = feature
      return acc
    },
    {} as Record<string, (typeof featuresList)[0]>,
  )

  const categorizedFeatures = getFeaturesByCategory()

  const handleSelectTier = (tierId: string) => {
    if (onSelectTier) {
      onSelectTier(tierId)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Transparent Pricing for Every Care Provider</h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Choose the plan that best fits your organization's needs. All plans include core patient management features.
        </p>

        <div className="flex items-center justify-center mt-6">
          <Label htmlFor="billing-toggle" className={!annual ? "font-medium" : "text-muted-foreground"}>
            Monthly
          </Label>
          <Switch id="billing-toggle" className="mx-4" checked={annual} onCheckedChange={setAnnual} />
          <Label htmlFor="billing-toggle" className={annual ? "font-medium" : "text-muted-foreground"}>
            Annual{" "}
            <Badge variant="outline" className="ml-2 font-normal">
              Save 15%
            </Badge>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers
          .filter((tier) => !tier.isCustom || isAdmin)
          .map((tier) => (
            <Card key={tier.id} className={`flex flex-col ${tier.isPopular ? "border-primary shadow-lg" : ""}`}>
              <CardHeader>
                {tier.isPopular && <Badge className="w-fit mb-2">Most Popular</Badge>}
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {tier.isCustom ? "Custom" : `£${annual ? tier.annualPrice / 12 : tier.monthlyPrice}`}
                  </span>
                  {!tier.isCustom && <span className="text-muted-foreground ml-1">/month</span>}
                  {annual && !tier.isCustom && (
                    <div className="text-sm text-muted-foreground mt-1">Billed annually (£{tier.annualPrice})</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <h4 className="font-medium mb-2">Features include:</h4>
                <ul className="space-y-2">
                  {showFeatureDetails
                    ? Object.entries(categorizedFeatures).map(([category, features]) => (
                        <li key={category} className="mt-4">
                          <h5 className="font-medium capitalize mb-2">{category}</h5>
                          <ul className="space-y-2">
                            {features.map((feature) => {
                              const included = tier.features.includes(feature.key)
                              return (
                                <li key={feature.key} className="flex items-start">
                                  {included ? (
                                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                                  )}
                                  <span className={!included ? "text-muted-foreground" : ""}>{feature.name}</span>
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      ))
                    : tier.features.slice(0, 5).map((featureKey) => (
                        <li key={featureKey} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>{featureMap[featureKey]?.name || featureKey}</span>
                        </li>
                      ))}
                  {!showFeatureDetails && tier.features.length > 5 && (
                    <li className="text-muted-foreground">+{tier.features.length - 5} more features</li>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.isPopular ? "default" : "outline"}
                  disabled={currentTierId === tier.id}
                  onClick={() => handleSelectTier(tier.id)}
                >
                  {currentTierId === tier.id ? "Current Plan" : tier.isCustom ? "Contact Sales" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {!showFeatureDetails && (
        <div className="text-center mt-10">
          <Button variant="outline" onClick={() => (window.location.href = "/pricing/compare")}>
            Compare All Features
          </Button>
        </div>
      )}
    </div>
  )
}

