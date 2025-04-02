"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Static features data
const staticFeatures = {
  clinical: [
    {
      key: "patient_management",
      name: "Patient Management",
      description: "Core patient record management",
      isEnabled: true,
      defaultEnabled: true,
    },
    {
      key: "medication_management",
      name: "Medication Management",
      description: "Track and manage patient medications",
      isEnabled: true,
      defaultEnabled: true,
    },
    {
      key: "care_plan_management",
      name: "Care Plan Management",
      description: "Create and manage patient care plans",
      isEnabled: true,
      defaultEnabled: true,
    },
    {
      key: "risk_assessment",
      name: "Risk Assessment",
      description: "Conduct and track patient risk assessments",
      isEnabled: false,
      defaultEnabled: false,
    },
  ],
  operations: [
    {
      key: "care_professional_management",
      name: "Care Professional Management",
      description: "Manage care staff and professionals",
      isEnabled: true,
      defaultEnabled: true,
    },
    {
      key: "basic_scheduling",
      name: "Basic Scheduling",
      description: "Schedule care visits and appointments",
      isEnabled: true,
      defaultEnabled: true,
    },
    {
      key: "document_management",
      name: "Document Management",
      description: "Upload and manage patient documents",
      isEnabled: true,
      defaultEnabled: true,
    },
  ],
  integrations: [
    {
      key: "gp_connect",
      name: "GP Connect Integration",
      description: "Integration with GP Connect for patient records",
      isEnabled: false,
      defaultEnabled: false,
    },
    {
      key: "api_access",
      name: "API Access",
      description: "Access to the ComplexCare API",
      isEnabled: false,
      defaultEnabled: false,
    },
  ],
}

export function FeaturesManagement() {
  const categories = Object.keys(staticFeatures)

  return (
    <div className="space-y-4">
      <Tabs defaultValue={categories[0]} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category.replace(/_/g, " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{category.replace(/_/g, " ")}</CardTitle>
                <CardDescription>Manage {category.replace(/_/g, " ")} features for your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {staticFeatures[category as keyof typeof staticFeatures].map((feature) => (
                    <div
                      key={feature.key}
                      className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={feature.key} className="text-base">
                            {feature.name}
                          </Label>
                          {feature.defaultEnabled ? (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-xs">
                              Optional
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id={feature.key} checked={feature.isEnabled} />
                        <Label htmlFor={feature.key} className="sr-only">
                          {feature.name}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

