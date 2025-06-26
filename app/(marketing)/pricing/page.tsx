import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { constructMetadata } from "@/lib/metadata"

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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple Per-User Pricing</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Pay only for the care professionals who need access, with no hidden fees or long-term commitments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-20" id="pricing-plans" aria-labelledby="pricing-plans-heading">
        <div className="container px-4 md:px-6">
          <h2 id="pricing-plans-heading" className="sr-only">
            Pricing Plans
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For small care teams with simple needs</CardDescription>
                <div className="mt-4 flex items-baseline text-5xl font-bold">
                  £25<span className="ml-1 text-xl font-normal text-muted-foreground">/user/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Unlimited patients</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Basic care planning tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Appointment scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Simple patient portal</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Task management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col border-primary">
              <CardHeader>
                <div className="text-sm font-medium text-primary">Most Popular</div>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For care professionals with complex needs</CardDescription>
                <div className="mt-4 flex items-baseline text-5xl font-bold">
                  £45<span className="ml-1 text-xl font-normal text-muted-foreground">/user/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Unlimited patients</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Advanced care planning tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Appointment scheduling with reminders</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Enhanced patient portal</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Medication management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Document management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Billing & invoicing tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Basic reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Phone & email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For organizations with advanced requirements</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-2xl font-bold">Custom Pricing</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Dedicated deployment with tailored solutions</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Dedicated private deployment</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Unlimited patients and users</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Custom implementation and onboarding</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Tailored care planning workflows</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Advanced scheduling & resource allocation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Full-featured patient portal</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Custom integrations with existing systems</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Advanced security and compliance features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>24/7 priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Service Level Agreement (SLA)</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/contact">Request Custom Quote</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Volume Discounts Section */}
      <section className="bg-muted/30 py-16 md:py-20" id="volume-discounts" aria-labelledby="volume-discounts-heading">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 id="volume-discounts-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Volume Discounts
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Save more as your team grows with our volume-based discounts.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-background p-6 text-center">
              <h3 className="text-lg font-semibold">10+ Users</h3>
              <p className="mt-2 text-3xl font-bold">10% Off</p>
              <p className="mt-2 text-sm text-muted-foreground">Perfect for small to medium-sized care teams</p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <h3 className="text-lg font-semibold">25+ Users</h3>
              <p className="mt-2 text-3xl font-bold">15% Off</p>
              <p className="mt-2 text-sm text-muted-foreground">Ideal for growing organizations</p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <h3 className="text-lg font-semibold">50+ Users</h3>
              <p className="mt-2 text-3xl font-bold">20% Off</p>
              <p className="mt-2 text-sm text-muted-foreground">Best value for large healthcare providers</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20" id="pricing-faq" aria-labelledby="pricing-faq-heading">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 id="pricing-faq-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Find answers to common questions about our pricing and plans.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6">
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">How does per-user pricing work?</h3>
              <p className="mt-2 text-muted-foreground">
                You pay only for the number of care professionals who need access to the system. Patients don't count
                toward your user limit and can access the patient portal at no additional cost.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Can I add or remove users at any time?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes, you can add users as your team grows or remove users if needed. Your billing will be adjusted
                accordingly on your next billing cycle.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Do you offer annual billing?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes, you can save 15% by choosing annual billing on any of our plans. Contact our sales team for more
                information.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Is there a limit to the number of patients?</h3>
              <p className="mt-2 text-muted-foreground">
                No, all our plans include unlimited patients. You only pay for the care professionals who need access to
                the system.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Can I upgrade or downgrade my plan?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next
                billing cycle.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">What's included in the Enterprise dedicated deployment?</h3>
              <p className="mt-2 text-muted-foreground">
                Enterprise deployments include a dedicated infrastructure tailored to your organization's specific
                needs. This includes custom implementation, integration with your existing systems, enhanced security
                features, and a dedicated team for support and ongoing development. Each Enterprise solution is scoped
                individually based on your requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16 md:py-20" id="contact-sales" aria-labelledby="contact-sales-heading">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 id="contact-sales-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Still Have Questions?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Our team is here to help you find the right plan for your organization.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">Contact Sales</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/help-center">
                  Visit Help Center <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "ComplexCare CRM",
            description:
              "ComplexCare CRM is a comprehensive healthcare management solution designed for complex care providers in the UK.",
            offers: [
              {
                "@type": "Offer",
                name: "Basic Plan",
                price: "25.00",
                priceCurrency: "GBP",
                priceValidUntil: "2024-12-31",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                name: "Professional Plan",
                price: "45.00",
                priceCurrency: "GBP",
                priceValidUntil: "2024-12-31",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                name: "Enterprise Plan",
                price: "Custom",
                priceCurrency: "GBP",
                priceValidUntil: "2024-12-31",
                availability: "https://schema.org/InStock",
              },
            ],
          }),
        }}
      />
    </div>
  )
}
