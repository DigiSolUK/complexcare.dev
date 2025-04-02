import type { Metadata } from "next"
import { Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { constructMetadata } from "@/lib/metadata"

export const metadata: Metadata = constructMetadata({
  title: "Contact ComplexCare.dev - Get in Touch with Our Healthcare Software Team",
  description:
    "Contact our team at ComplexCare.dev for inquiries about our healthcare management software, pricing, demos, or support. We're here to help UK healthcare providers.",
  keywords: [
    "contact healthcare software",
    "ComplexCare.dev support",
    "healthcare CRM contact",
    "complex care software inquiry",
    "UK healthcare software contact",
    "healthcare management demo request",
  ],
})

export default function ContactPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-50 to-accent-100 dark:from-accent-950 dark:to-accent-900 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent ring-1 ring-inset ring-accent/20">
              CONTACT US
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get in Touch</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We're here to help. Reach out to our team with any questions or inquiries about ComplexCare.dev.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">How Can We Help?</h2>
                <p className="text-muted-foreground md:text-lg">
                  Have questions about ComplexCare.dev? Our team is ready to assist you. Fill out the form and we'll get
                  back to you as soon as possible.
                </p>
              </div>

              <div className="rounded-lg border bg-accent-50 dark:bg-accent-950 p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-accent-200 dark:bg-accent-800 p-2">
                      <Mail className="h-5 w-5 text-accent-700 dark:text-accent-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">info@complexcare.dev</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-accent-200 dark:bg-accent-800 p-2">
                      <Phone className="h-5 w-5 text-accent-700 dark:text-accent-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">+44 (0) 20 1234 5678</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-accent-200 dark:bg-accent-800 p-2">
                      <MapPin className="h-5 w-5 text-accent-700 dark:text-accent-300" />
                    </div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-muted-foreground">
                        123 Healthcare Street
                        <br />
                        London, W1 1AA
                        <br />
                        United Kingdom
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-primary-50 dark:bg-primary-950 p-6">
                <h3 className="text-xl font-bold mb-4">Office Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 5:30 PM GMT
                  <br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
            <Card className="border-accent/20 shadow-lg">
              <CardHeader className="bg-accent-50 dark:bg-accent-950 rounded-t-lg border-b border-accent/10">
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="Enter your first name"
                        className="border-accent/20 focus-visible:ring-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Enter your last name"
                        className="border-accent/20 focus-visible:ring-accent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="border-accent/20 focus-visible:ring-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      className="border-accent/20 focus-visible:ring-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inquiry-type">Inquiry Type</Label>
                    <Select>
                      <SelectTrigger id="inquiry-type" className="border-accent/20 focus-visible:ring-accent">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="sales">Sales Question</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="demo">Request a Demo</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message"
                      className="min-h-[120px] border-accent/20 focus-visible:ring-accent"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              LOCATION
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Visit Our Office</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                We're located in central London, easily accessible by public transport.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-5xl rounded-lg border overflow-hidden shadow-lg">
            <div className="aspect-[16/9] bg-muted flex items-center justify-center">
              <MapPin className="h-12 w-12 text-accent" />
              <span className="ml-2 text-muted-foreground">Map placeholder</span>
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
            "@type": "Organization",
            name: "ComplexCare.dev",
            url: "https://complexcare.dev",
            logo: "https://complexcare.dev/logo.png",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+44-20-1234-5678",
              contactType: "customer service",
              email: "info@complexcare.dev",
              availableLanguage: "English",
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Healthcare Street",
              addressLocality: "London",
              postalCode: "W1 1AA",
              addressCountry: "UK",
            },
            sameAs: [
              "https://twitter.com/complexcaredev",
              "https://www.linkedin.com/company/complexcaredev",
              "https://www.facebook.com/complexcaredev",
            ],
          }),
        }}
      />
    </div>
  )
}

