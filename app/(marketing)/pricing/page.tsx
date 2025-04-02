import type { Metadata } from "next"
import { constructMetadata } from "@/lib/metadata"
import { PricingPage as PricingComponent } from "@/components/pricing/pricing-page"

export const metadata: Metadata = constructMetadata({
  title: "ComplexCare CRM Pricing - Simple Per-User Pricing for Healthcare Providers",
  description:
    "Transparent per-user pricing for ComplexCare CRM. Choose from Basic, Professional, or Enterprise plans designed for UK healthcare providers managing complex care.",
  keywords: [
    "healthcare CRM pricing",
    "complex care software cost",
    "per-user pricing",
    "healthcare software pricing",
    "care management system cost",
    "UK healthcare software pricing",
    "enterprise healthcare solutions",
  ],
})

export default function PricingPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Pricing</h1>
      <PricingComponent />
    </div>
  )
}

