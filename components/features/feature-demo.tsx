"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FeatureGate } from "./feature-gate"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function FeatureDemo() {
  return (
    <div className="space-y-4">
      <FeatureGate
        featureKey="gp_connect"
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>GP Connect Integration</CardTitle>
              <CardDescription>This feature is currently disabled</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Feature Disabled</AlertTitle>
                <AlertDescription>
                  The GP Connect integration is currently disabled. Please contact your administrator to enable this
                  feature.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>GP Connect Integration</CardTitle>
            <CardDescription>View patient records from GP Connect</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This content is only visible when the GP Connect feature is enabled.</p>
          </CardContent>
        </Card>
      </FeatureGate>

      <FeatureGate
        featureKey="medication_management"
        fallback={
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Feature Disabled</AlertTitle>
            <AlertDescription>The Medication Management feature is currently disabled.</AlertDescription>
          </Alert>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>Medication Management</CardTitle>
            <CardDescription>Manage patient medications</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This content is only visible when the Medication Management feature is enabled.</p>
          </CardContent>
        </Card>
      </FeatureGate>
    </div>
  )
}

