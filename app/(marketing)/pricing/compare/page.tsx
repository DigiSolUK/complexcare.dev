import { PricingPage } from "@/components/pricing/pricing-page"

export default function PricingComparePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Compare Pricing Plans</h1>
      <PricingPage showFeatureDetails={true} />
    </div>
  )
}

