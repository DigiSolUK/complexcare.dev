import type { Metadata } from "next"
import { PricingTiers } from "@/components/pricing/pricing-tiers"
import { PricingCalculator } from "@/components/pricing/pricing-calculator"
import { FeatureComparison } from "@/components/pricing/feature-comparison"

export const metadata: Metadata = {
  title: "Pricing | ComplexCare CRM",
  description:
    "Flexible pricing plans for healthcare organizations of all sizes. Choose the features you need and only pay for what you use.",
}

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Transparent, Flexible Pricing</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the plan that fits your organization's needs. Only pay for the features you use.
        </p>
      </div>

      {/* Standard pricing tiers */}
      <PricingTiers />

      {/* Interactive pricing calculator */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Build Your Custom Plan</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select only the features you need and see your custom price instantly.
          </p>
        </div>
        <PricingCalculator />
      </div>

      {/* Feature comparison table */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Compare Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See which features are included in each plan.
          </p>
        </div>
        <FeatureComparison />
      </div>

      {/* FAQ Section */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-\
