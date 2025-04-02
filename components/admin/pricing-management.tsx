"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PricingPage } from "@/components/pricing/pricing-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { getFeaturesByCategory } from "@/lib/services/pricing-service"

interface PricingManagementProps {
  currentTierId: string
}

export function PricingManagement({ currentTierId }: PricingManagementProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedTierId, setSelectedTierId] = useState(currentTierId)

  // Custom tier form state
  const [customTierName, setCustomTierName] = useState("")
  const [customTierDescription, setCustomTierDescription] = useState("")
  const [customTierMonthlyPrice, setCustomTierMonthlyPrice] = useState("")
  const [customTierAnnualPrice, setCustomTierAnnualPrice] = useState("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const categorizedFeatures = getFeaturesByCategory()

  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId)
  }

  const handleUpdateTier = async () => {
    if (selectedTierId === currentTierId) {
      toast({
        title: "No change",
        description: "You are already on this pricing tier.",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/tenant/pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tierId: selectedTierId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Pricing tier updated",
          description: "Your pricing tier has been updated successfully.",
        })
        router.refresh()
      } else {
        throw new Error(data.error || "Failed to update pricing tier")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustomTier = async () => {
    if (
      !customTierName ||
      !customTierDescription ||
      !customTierMonthlyPrice ||
      !customTierAnnualPrice ||
      selectedFeatures.length === 0
    ) {
      toast({
        title: "Validation error",
        description: "Please fill in all fields and select at least one feature.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/pricing/custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customTierName,
          description: customTierDescription,
          monthlyPrice: Number.parseFloat(customTierMonthlyPrice),
          annualPrice: Number.parseFloat(customTierAnnualPrice),
          features: selectedFeatures,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Custom tier created",
          description: "Your custom pricing tier has been created successfully.",
        })
        router.refresh()
      } else {
        throw new Error(data.error || "Failed to create custom pricing tier")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleFeature = (featureKey: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureKey) ? prev.filter((key) => key !== featureKey) : [...prev, featureKey],
    )
  }

  return (
    <Tabs defaultValue="existing">
      <TabsList className="mb-6">
        <TabsTrigger value="existing">Existing Plans</TabsTrigger>
        <TabsTrigger value="custom">Create Custom Plan</TabsTrigger>
      </TabsList>

      <TabsContent value="existing">
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Pricing Tier</CardTitle>
              <CardDescription>
                Your organization is currently on the {currentTierId.charAt(0).toUpperCase() + currentTierId.slice(1)}{" "}
                plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleUpdateTier} disabled={loading || selectedTierId === currentTierId}>
                {loading ? "Updating..." : "Update Pricing Tier"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <PricingPage
          currentTierId={currentTierId}
          onSelectTier={handleSelectTier}
          showFeatureDetails={true}
          isAdmin={true}
        />
      </TabsContent>

      <TabsContent value="custom">
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Pricing Tier</CardTitle>
            <CardDescription>Create a custom pricing tier with specific features for your clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tier Name</Label>
                  <Input
                    id="name"
                    value={customTierName}
                    onChange={(e) => setCustomTierName(e.target.value)}
                    placeholder="Enterprise Plus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-price">Monthly Price (£)</Label>
                  <Input
                    id="monthly-price"
                    type="number"
                    value={customTierMonthlyPrice}
                    onChange={(e) => setCustomTierMonthlyPrice(e.target.value)}
                    placeholder="799"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={customTierDescription}
                  onChange={(e) => setCustomTierDescription(e.target.value)}
                  placeholder="Advanced features for large healthcare organizations"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual-price">Annual Price (£)</Label>
                <Input
                  id="annual-price"
                  type="number"
                  value={customTierAnnualPrice}
                  onChange={(e) => setCustomTierAnnualPrice(e.target.value)}
                  placeholder="7990"
                />
              </div>

              <div className="space-y-4">
                <Label>Features</Label>
                {Object.entries(categorizedFeatures).map(([category, features]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium capitalize">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {features.map((feature) => (
                        <div key={feature.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature.key}
                            checked={selectedFeatures.includes(feature.key)}
                            onCheckedChange={() => toggleFeature(feature.key)}
                          />
                          <Label htmlFor={feature.key} className="cursor-pointer">
                            {feature.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleCreateCustomTier} disabled={loading} className="mt-4">
                {loading ? "Creating..." : "Create Custom Tier"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

