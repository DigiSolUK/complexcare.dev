"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTenantWizard } from "../tenant-wizard-context"
import { Check, X } from "lucide-react"

export function ReviewStep() {
  const { data } = useTenantWizard()

  const getEnabledFeatures = (features: Record<string, boolean>) => {
    return Object.entries(features)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Review & Confirm</h3>
        <p className="text-sm text-muted-foreground">Please review the information below before creating the tenant.</p>
      </div>

      <div className="space-y-4">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Organization:</span>
              <span className="font-medium">{data.basicInfo.name}</span>

              <span className="text-muted-foreground">Subdomain:</span>
              <span className="font-medium">{data.basicInfo.subdomain}.complexcare.uk</span>

              <span className="text-muted-foreground">Industry:</span>
              <span className="font-medium">{data.basicInfo.industry}</span>

              <span className="text-muted-foreground">Size:</span>
              <span className="font-medium">{data.basicInfo.size} employees</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Primary Contact:</span>
              <span className="font-medium">{data.contactInfo.primaryContactName}</span>

              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{data.contactInfo.primaryContactEmail}</span>

              <span className="text-muted-foreground">Billing Email:</span>
              <span className="font-medium">{data.contactInfo.billingEmail}</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium capitalize">{data.subscription.plan}</span>
                <Badge variant="secondary" className="ml-2">
                  {data.subscription.billingCycle}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                Payment: {data.subscription.paymentMethod.replace("_", " ")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Core Features</h4>
              <div className="flex flex-wrap gap-2">
                {getEnabledFeatures(data.features.core).map((feature) => (
                  <Badge key={feature} variant="default">
                    <Check className="mr-1 h-3 w-3" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {getEnabledFeatures(data.features.advanced).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Advanced Features</h4>
                <div className="flex flex-wrap gap-2">
                  {getEnabledFeatures(data.features.advanced).map((feature) => (
                    <Badge key={feature} variant="secondary">
                      <Check className="mr-1 h-3 w-3" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium mb-2">Compliance & Security</h4>
              <div className="flex flex-wrap gap-2">
                {getEnabledFeatures(data.features.compliance).map((feature) => (
                  <Badge key={feature} variant="outline">
                    <Check className="mr-1 h-3 w-3" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin User */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Administrator Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">
                {data.adminUser.firstName} {data.adminUser.lastName}
              </span>

              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{data.adminUser.email}</span>

              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium capitalize">{data.adminUser.role}</span>

              <span className="text-muted-foreground">Welcome Email:</span>
              <span className="font-medium">
                {data.adminUser.sendWelcomeEmail ? (
                  <Badge variant="default" className="h-5">
                    <Check className="h-3 w-3" />
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="h-5">
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
