"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTenantWizard } from "../tenant-wizard-context"
import { Badge } from "@/components/ui/badge"

export function FeaturesStep() {
  const { data, updateData } = useTenantWizard()
  const { features, subscription } = data

  const isPremiumPlan = subscription.plan === "enterprise" || subscription.plan === "custom"
  const isProPlan = isPremiumPlan || subscription.plan === "professional"

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Features & Modules</h3>
        <p className="text-sm text-muted-foreground">
          Select the features and modules you want to enable for this tenant.
        </p>
      </div>

      <div className="space-y-6">
        {/* Core Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Core Features</CardTitle>
            <CardDescription>Essential features for care management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(features.core).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateData("features", {
                      core: { ...features.core, [key]: !!checked },
                    })
                  }
                />
                <Label htmlFor={key} className="cursor-pointer">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Advanced Features
              {!isProPlan && (
                <Badge variant="secondary" className="ml-2">
                  Professional+
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Enhanced capabilities for better care delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(features.advanced).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3">
                <Checkbox
                  id={key}
                  checked={value}
                  disabled={!isProPlan}
                  onCheckedChange={(checked) =>
                    updateData("features", {
                      advanced: { ...features.advanced, [key]: !!checked },
                    })
                  }
                />
                <Label htmlFor={key} className={`cursor-pointer ${!isProPlan ? "opacity-50" : ""}`}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance & Security</CardTitle>
            <CardDescription>Ensure data protection and regulatory compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(features.compliance).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateData("features", {
                      compliance: { ...features.compliance, [key]: !!checked },
                    })
                  }
                />
                <Label htmlFor={key} className="cursor-pointer">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
