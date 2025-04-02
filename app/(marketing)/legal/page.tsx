import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LegalPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Legal Information</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Important legal documents and compliance information for ComplexCare.app users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Documents Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <CardDescription>How we collect, use, and protect your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our Privacy Policy outlines how ComplexCare.app collects, uses, and protects your personal information
                  in compliance with GDPR, NHS, and other relevant regulations.
                </p>
                <Button asChild>
                  <Link href="/privacy">
                    Read Privacy Policy <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
                <CardDescription>Rules and guidelines for using our platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our Terms of Service outline the rules and guidelines for using ComplexCare.app, including user
                  responsibilities and platform policies.
                </p>
                <Button asChild>
                  <Link href="/terms">
                    Read Terms of Service <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>HIPAA Compliance</CardTitle>
                <CardDescription>Our approach to US healthcare data protection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn about our HIPAA compliance measures and how we protect healthcare data for our US customers in
                  accordance with federal regulations.
                </p>
                <Button asChild>
                  <Link href="/hipaa">
                    Read HIPAA Information <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>GDPR Compliance</CardTitle>
                <CardDescription>Our approach to EU and UK data protection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Understand how we comply with GDPR requirements and protect the privacy rights of EU and UK citizens
                  using our platform.
                </p>
                <Button asChild>
                  <Link href="/gdpr">
                    Read GDPR Information <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Legal Information */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Additional Legal Information</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Other important legal documents and resources.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Data Processing Agreement</h3>
              <p className="mt-2 text-muted-foreground">
                Our standard DPA for customers who require specific data processing terms.
              </p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link href="/dpa">View Document</Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Cookie Policy</h3>
              <p className="mt-2 text-muted-foreground">
                Information about how we use cookies and similar technologies on our website.
              </p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link href="/cookies">View Document</Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Acceptable Use Policy</h3>
              <p className="mt-2 text-muted-foreground">Guidelines for appropriate use of our platform and services.</p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link href="/acceptable-use">View Document</Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Service Level Agreement</h3>
              <p className="mt-2 text-muted-foreground">
                Our commitments regarding platform uptime and support response times.
              </p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link href="/sla">View Document</Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Subprocessors</h3>
              <p className="mt-2 text-muted-foreground">
                List of third-party service providers we use to deliver our services.
              </p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link href="/subprocessors">View Document</Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Legal Contacts</h3>
              <p className="mt-2 text-muted-foreground">
                How to reach our legal team for specific inquiries or concerns.
              </p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link href="/legal-contacts">View Contacts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

