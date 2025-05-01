import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PricingTier {
  name: string
  description: string
  price: number
  features: string[]
  popular?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description: "Essential care management for small providers",
    price: 99,
    features: [
      "Patient Management",
      "Care Professional Profiles",
      "Basic Scheduling",
      "Document Storage",
      "Standard Support",
    ],
  },
  {
    name: "Professional",
    description: "Complete solution for growing care providers",
    price: 249,
    popular: true,
    features: [
      "Everything in Starter",
      "Advanced Scheduling",
      "Medication Management",
      "Care Plan Builder",
      "Timesheet Management",
      "Invoicing & Billing",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    description: "Comprehensive platform for large organizations",
    price: 499,
    features: [
      "Everything in Professional",
      "Multi-tenant Management",
      "Advanced Analytics",
      "Custom Integrations",
      "Compliance Management",
      "White-labeling Options",
      "Dedicated Account Manager",
    ],
  },
]

export function PricingTiers() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {pricingTiers.map((tier) => (
        <Card key={tier.name} className={`flex flex-col ${tier.popular ? "border-primary shadow-lg" : ""}`}>
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4">
              <span className="text-3xl font-bold">£{tier.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className={`w-full ${tier.popular ? "bg-primary" : ""}`}
              variant={tier.popular ? "default" : "outline"}
            >
              {tier.popular ? "Get Started" : "Learn More"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
