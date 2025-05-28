"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useTenantWizard } from "../tenant-wizard-context"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small care providers",
    price: { monthly: 99, annual: 990 },
    features: ["Up to 10 users", "50 patient records", "Basic reporting", "Email support", "Mobile app access"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing care organizations",
    price: { monthly: 299, annual: 2990 },
    features: [
      "Up to 50 users",
      "Unlimited patient records",
      "Advanced reporting",
      "Priority support",
      "API access",
      "Custom integrations",
      "Audit logs",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large healthcare providers",
    price: { monthly: 799, annual: 7990 },
    features: [
      "Unlimited users",
      "Unlimited patient records",
      "AI-powered insights",
      "24/7 phone support",
      "Custom training",
      "Dedicated account manager",
      "SLA guarantee",
      "White-label options",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Tailored to your specific needs",
    price: { monthly: null, annual: null },
    features: [
      "Everything in Enterprise",
      "Custom features",
      "Custom integrations",
      "On-premise deployment",
      "Custom SLA",
    ],
  },
]

export function SubscriptionStep() {
  const { data, updateData } = useTenantWizard()
  const { subscription } = data

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Choose a Plan</h3>
        <p className="text-sm text-muted-foreground">
          Select the subscription plan that best fits your organization's needs.
        </p>
      </div>

      <div className="space-y-4">
        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <Label
            htmlFor="monthly"
            className={cn(
              "cursor-pointer",
              subscription.billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Monthly
          </Label>
          <RadioGroup
            value={subscription.billingCycle}
            onValueChange={(value: "monthly" | "annual") => updateData("subscription", { billingCycle: value })}
            className="flex"
          >
            <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
            <div className="relative">
              <div className="block h-6 w-12 rounded-full bg-muted" />
              <div
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
                  subscription.billingCycle === "annual" ? "translate-x-6" : "translate-x-0.5",
                )}
              />
            </div>
            <RadioGroupItem value="annual" id="annual" className="sr-only" />
          </RadioGroup>
          <Label
            htmlFor="annual"
            className={cn(
              "cursor-pointer",
              subscription.billingCycle === "annual" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Annual
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </Label>
        </div>

        {/* Plans Grid */}
        <RadioGroup
          value={subscription.plan}
          onValueChange={(value: any) => updateData("subscription", { plan: value })}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {plans.map((plan) => (
            <div key={plan.id} className="relative">
              <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
              <Label htmlFor={plan.id} className="block cursor-pointer">
                <Card
                  className={cn(
                    "relative h-full transition-colors hover:border-primary",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                  )}
                >
                  {plan.popular && <Badge className="absolute -top-2 right-4">Most Popular</Badge>}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      {plan.price.monthly ? (
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold">
                            £
                            {subscription.billingCycle === "monthly"
                              ? plan.price.monthly
                              : Math.floor(plan.price.annual! / 12)}
                          </span>
                          <span className="ml-1 text-muted-foreground">/month</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold">Contact Us</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="mr-2 h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup
            value={subscription.paymentMethod}
            onValueChange={(value: any) => updateData("subscription", { paymentMethod: value })}
            className="grid gap-2 sm:grid-cols-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="cursor-pointer">
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="invoice" id="invoice" />
              <Label htmlFor="invoice" className="cursor-pointer">
                Invoice
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct_debit" id="direct_debit" />
              <Label htmlFor="direct_debit" className="cursor-pointer">
                Direct Debit
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
