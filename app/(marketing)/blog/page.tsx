import type { Metadata } from "next"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { constructMetadata } from "@/lib/metadata"

export const metadata: Metadata = constructMetadata({
  title: "ComplexCare.dev Blog - Healthcare Management Insights & Updates",
  description:
    "Explore the ComplexCare.dev blog for insights, updates, and resources on complex care management, healthcare technology, and best practices for UK healthcare providers.",
  keywords: [
    "healthcare blog",
    "complex care insights",
    "healthcare management blog",
    "UK healthcare technology",
    "care management resources",
    "healthcare best practices",
    "patient care blog",
  ],
})

export default function BlogPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-50 to-accent-100 dark:from-accent-950 dark:to-accent-900 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent ring-1 ring-inset ring-accent/20">
              INSIGHTS & UPDATES
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">ComplexCare.dev Blog</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Insights, updates, and resources for complex care management in the UK healthcare system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="rounded-lg border bg-muted/50 overflow-hidden shadow-lg">
              <div className="aspect-video bg-gradient-to-r from-accent-300 to-primary-300 dark:from-accent-700 dark:to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Featured Article</span>
              </div>
            </div>
            <div className="space-y-4">
              <Badge className="bg-accent text-white hover:bg-accent-600">Featured</Badge>
              <h2 className="text-3xl font-bold tracking-tighter">The Future of Complex Care Management</h2>
              <p className="text-muted-foreground">May 15, 2023 • 8 min read</p>
              <p className="text-muted-foreground md:text-lg">
                Explore how technology is transforming complex care management and improving patient outcomes in the UK
                healthcare system. This comprehensive guide examines the latest trends and innovations in healthcare
                technology.
              </p>
              <Button asChild className="bg-accent hover:bg-accent-700">
                <Link href="/blog/future-of-complex-care-management">
                  Read Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              LATEST ARTICLES
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Recent Articles</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Stay up-to-date with the latest insights and updates from our team.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <div className="h-full w-full bg-gradient-to-r from-primary-300 to-primary-400 dark:from-primary-700 dark:to-primary-800"></div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300"
                  >
                    Healthcare
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-accent-100 text-accent-700 hover:bg-accent-200 dark:bg-accent-900 dark:text-accent-300"
                  >
                    Technology
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">Improving Patient Engagement with Digital Tools</CardTitle>
                <CardDescription>April 28, 2023 • 5 min read</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">
                  Discover how digital tools are revolutionizing patient engagement and leading to better health
                  outcomes for individuals with complex care needs.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full text-accent hover:text-accent-700 hover:bg-accent-50 dark:hover:bg-accent-950"
                >
                  <Link href="/blog/improving-patient-engagement">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <div className="h-full w-full bg-gradient-to-r from-accent-300 to-accent-400 dark:from-accent-700 dark:to-accent-800"></div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300"
                  >
                    Compliance
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-accent-100 text-accent-700 hover:bg-accent-200 dark:bg-accent-900 dark:text-accent-300"
                  >
                    GDPR
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">Understanding Healthcare Data Regulations in 2023</CardTitle>
                <CardDescription>April 15, 2023 • 6 min read</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">
                  A comprehensive guide to navigating the complex landscape of healthcare data regulations, including
                  GDPR, HIPAA, and NHS requirements.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full text-accent hover:text-accent-700 hover:bg-accent-50 dark:hover:bg-accent-950"
                >
                  <Link href="/blog/healthcare-data-regulations">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <div className="h-full w-full bg-gradient-to-r from-success-300 to-success-400 dark:from-success-700 dark:to-success-800"></div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-success-100 text-success-700 hover:bg-success-200 dark:bg-success-900 dark:text-success-300"
                  >
                    Care Planning
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-warning-100 text-warning-700 hover:bg-warning-200 dark:bg-warning-900 dark:text-warning-300"
                  >
                    Best Practices
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">5 Essential Elements of Effective Care Plans</CardTitle>
                <CardDescription>March 30, 2023 • 4 min read</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">
                  Learn the key components that make care plans effective for patients with complex needs, and how to
                  implement them in your organization.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full text-accent hover:text-accent-700 hover:bg-accent-50 dark:hover:bg-accent-950"
                >
                  <Link href="/blog/effective-care-plans">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              asChild
              className="border-accent text-accent hover:bg-accent-50 hover:text-accent-700 dark:hover:bg-accent-950"
            >
              <Link href="/blog/archive">
                View All Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent ring-1 ring-inset ring-accent/20">
              CATEGORIES
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Browse by Category</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Find articles on topics that interest you most.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Link
              href="/blog/category/healthcare-technology"
              className="rounded-lg border bg-background p-4 text-center hover:bg-accent-50 hover:border-accent-200 hover:text-accent-700 transition-colors dark:hover:bg-accent-950 dark:hover:border-accent-800 dark:hover:text-accent-300"
            >
              <h3 className="font-medium">Healthcare Technology</h3>
              <p className="text-sm text-muted-foreground">12 articles</p>
            </Link>
            <Link
              href="/blog/category/care-planning"
              className="rounded-lg border bg-background p-4 text-center hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors dark:hover:bg-primary-950 dark:hover:border-primary-800 dark:hover:text-primary-300"
            >
              <h3 className="font-medium">Care Planning</h3>
              <p className="text-sm text-muted-foreground">8 articles</p>
            </Link>
            <Link
              href="/blog/category/compliance"
              className="rounded-lg border bg-background p-4 text-center hover:bg-success-50 hover:border-success-200 hover:text-success-700 transition-colors dark:hover:bg-success-950 dark:hover:border-success-800 dark:hover:text-success-300"
            >
              <h3 className="font-medium">Compliance</h3>
              <p className="text-sm text-muted-foreground">9 articles</p>
            </Link>
            <Link
              href="/blog/category/patient-engagement"
              className="rounded-lg border bg-background p-4 text-center hover:bg-warning-50 hover:border-warning-200 hover:text-warning-700 transition-colors dark:hover:bg-warning-950 dark:hover:border-warning-800 dark:hover:text-warning-300"
            >
              <h3 className="font-medium">Patient Engagement</h3>
              <p className="text-sm text-muted-foreground">7 articles</p>
            </Link>
            <Link
              href="/blog/category/best-practices"
              className="rounded-lg border bg-background p-4 text-center hover:bg-accent-50 hover:border-accent-200 hover:text-accent-700 transition-colors dark:hover:bg-accent-950 dark:hover:border-accent-800 dark:hover:text-accent-300"
            >
              <h3 className="font-medium">Best Practices</h3>
              <p className="text-sm text-muted-foreground">15 articles</p>
            </Link>
            <Link
              href="/blog/category/product-updates"
              className="rounded-lg border bg-background p-4 text-center hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors dark:hover:bg-primary-950 dark:hover:border-primary-800 dark:hover:text-primary-300"
            >
              <h3 className="font-medium">Product Updates</h3>
              <p className="text-sm text-muted-foreground">6 articles</p>
            </Link>
            <Link
              href="/blog/category/case-studies"
              className="rounded-lg border bg-background p-4 text-center hover:bg-success-50 hover:border-success-200 hover:text-success-700 transition-colors dark:hover:bg-success-950 dark:hover:border-success-800 dark:hover:text-success-300"
            >
              <h3 className="font-medium">Case Studies</h3>
              <p className="text-sm text-muted-foreground">4 articles</p>
            </Link>
            <Link
              href="/blog/category/industry-news"
              className="rounded-lg border bg-background p-4 text-center hover:bg-warning-50 hover:border-warning-200 hover:text-warning-700 transition-colors dark:hover:bg-warning-950 dark:hover:border-warning-800 dark:hover:text-warning-300"
            >
              <h3 className="font-medium">Industry News</h3>
              <p className="text-sm text-muted-foreground">10 articles</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900 dark:to-primary-900 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20">
              NEWSLETTER
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Subscribe to Our Newsletter</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Get the latest insights and updates delivered directly to your inbox.
              </p>
            </div>
            <div className="mx-auto w-full max-w-md space-y-2">
              <form className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-lg flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/70 focus-visible:ring-accent"
                />
                <Button type="submit" className="bg-white text-accent hover:bg-white/90">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-white/70">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
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
            "@type": "Blog",
            headline: "ComplexCare.dev Blog",
            description: "Insights, updates, and resources for complex care management in the UK healthcare system.",
            url: "https://complexcare.dev/blog",
            publisher: {
              "@type": "Organization",
              name: "ComplexCare.dev",
              logo: {
                "@type": "ImageObject",
                url: "https://complexcare.dev/logo.png",
              },
            },
            blogPost: [
              {
                "@type": "BlogPosting",
                headline: "The Future of Complex Care Management",
                description:
                  "Explore how technology is transforming complex care management and improving patient outcomes.",
                datePublished: "2023-05-15",
                author: {
                  "@type": "Person",
                  name: "Dr. Sarah Johnson",
                },
              },
              {
                "@type": "BlogPosting",
                headline: "Improving Patient Engagement with Digital Tools",
                description:
                  "Discover how digital tools are revolutionizing patient engagement and leading to better health outcomes.",
                datePublished: "2023-04-28",
                author: {
                  "@type": "Person",
                  name: "Emily Thompson",
                },
              },
              {
                "@type": "BlogPosting",
                headline: "Understanding Healthcare Data Regulations in 2023",
                description:
                  "A comprehensive guide to navigating the complex landscape of healthcare data regulations.",
                datePublished: "2023-04-15",
                author: {
                  "@type": "Person",
                  name: "James Wilson",
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}
