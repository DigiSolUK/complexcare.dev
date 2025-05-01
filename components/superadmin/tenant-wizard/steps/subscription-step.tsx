"use client"

import { useWizardContext } from "../wizard-context"
import { WizardStep } from "../wizard-step"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function SubscriptionStep() {
  const { state, updateSubscription } = useWizardContext();

  return (
    <WizardStep
      title="Subscription Plan"
      description="Choose a subscription plan for this tenant"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Select a Plan</Label>
          <RadioGroup
            value={state.subscription.plan}
            onValueChange={(value) => updateSubscription({ plan: value as any })}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="basic"
                id="basic"
                className="peer sr-only"
              />
              <Label
                htmlFor="basic"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CardTitle>Basic</CardTitle>
                <CardDescription className="mt-2">
                  For small organizations just getting started
                </CardDescription>
                <div className="mt-4 text-2xl font-bold">£99/mo</div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Up to 10 users</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Basic patient management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Standard support</span>
                  </li>
                </ul>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="standard"
                id="standard"
                className="peer sr-only"
              />
              <Label
                htmlFor="standard"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CardTitle>Standard</CardTitle>
                <CardDescription className="mt-2">
                  For growing organizations with more needs
                </CardDescription>
                <div className="mt-4 text-2xl font-bold">£199/mo</div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Up to 25 users</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Advanced patient management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Clinical notes & medication tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="premium"
                id="premium"
                className="peer sr-only"
              />
              <Label
                htmlFor="premium"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CardTitle>Premium</CardTitle>
                <CardDescription className="mt-2">
                  For established organizations with complex needs
                </CardDescription>
                <div className="mt-4 text-2xl font-bold">£399/mo</div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Up to 100 users</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>All Standard features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Advanced reporting & analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>AI-powered features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>24/7 premium support</span>
                  </li>
                </ul>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="enterprise"
                id="enterprise"
              />\
