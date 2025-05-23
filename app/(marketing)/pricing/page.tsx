import type { Metadata } from "next"
import { PricingTiers } from "@/components/pricing/pricing-tiers"
import { PricingCalculator } from "@/components/pricing/pricing-calculator"
import { FeatureComparison } from "@/components/pricing/feature-comparison"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">See which features are included in each plan.</p>
        </div>
        <FeatureComparison />
      </div>

      {/* FAQ Section */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-6 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the pricing work?</AccordionTrigger>
              <AccordionContent>
                Our pricing is based on a combination of the number of users, patients, and the features you need. You
                can choose from our standard plans or build a custom plan using our pricing calculator.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
              <AccordionContent>
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing
                cycle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Is there a free trial?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a 14-day free trial for all plans. No credit card required to start.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Do you offer discounts for non-profits?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer special pricing for non-profit healthcare organizations. Please contact our sales team for
                details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards, direct debit, and bank transfers for annual plans.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                Yes, we take security very seriously. All data is encrypted at rest and in transit. We are compliant
                with HIPAA, GDPR, and other healthcare data protection regulations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to get started?</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Start your 14-day free trial today. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Start Free Trial
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  )
}
