import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Shield, Clock, Users, FileText, BarChart3, Stethoscope, ClipboardList } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                UK Healthcare CRM Solution
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                ComplexCare CRM
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                A comprehensive healthcare management platform designed specifically for UK complex care providers.
                Streamline patient care, ensure compliance, and improve outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Demo
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Multi-Tenant Architecture</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Secure data isolation for healthcare organizations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">CQC Compliance Ready</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Built to meet UK healthcare regulations</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Real-time Updates</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Instant access to critical patient information
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Team Collaboration</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Seamless communication between care providers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Comprehensive Solution
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                ComplexCare CRM provides everything you need to manage complex care services efficiently and
                effectively.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Patient Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Comprehensive patient records, care plans, and health monitoring in one place.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Care Planning</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Create, manage and track personalized care plans for each patient.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Compliance Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Stay compliant with healthcare regulations, policies, and training requirements.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Document Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Securely store, organize, and share important healthcare documents.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Medication Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Track prescriptions, dosages, schedules, and medication adherence.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Analytics & Reporting</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Gain insights with powerful analytics and customizable reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trusted by Healthcare Providers
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                ComplexCare CRM is making a difference in healthcare delivery across the UK.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">500+</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">Care Providers</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">25,000+</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">Patients Managed</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">98%</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">Compliance Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">30%</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Testimonials</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">
                  "ComplexCare CRM has transformed how we manage our complex care services. The compliance features
                  alone have saved us countless hours."
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-100 p-1 dark:bg-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Care Home Manager, London</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">
                  "The patient management system is intuitive and comprehensive. It's helped us improve care
                  coordination and patient outcomes."
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-100 p-1 dark:bg-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dr. James Wilson</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Clinical Director, Manchester</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">
                  "The reporting capabilities have given us insights we never had before. We can now make data-driven
                  decisions about our care delivery."
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-100 p-1 dark:bg-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Emma Thompson</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Operations Director, Birmingham</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Care Delivery?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experience how ComplexCare CRM can help you provide better care, ensure compliance, and improve
                operational efficiency.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Explore Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

