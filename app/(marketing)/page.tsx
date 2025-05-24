import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, FileText, Stethoscope } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 overflow-hidden">
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
            <div className="relative h-[400px] w-full rounded-lg shadow-xl overflow-hidden">
              <Image
                src="/images/hero-healthcare.png"
                alt="Healthcare professionals using ComplexCare CRM"
                fill
                className="object-cover"
                priority
              />
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
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="relative h-40 w-40">
                <Image
                  src="/images/features/patient-management.png"
                  alt="Patient Management"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">Patient Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Comprehensive patient records, care plans, and health monitoring in one place.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="relative h-40 w-40">
                <Image src="/images/features/care-plans.png" alt="Care Planning" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-bold">Care Planning</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Create, manage and track personalized care plans for each patient.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="relative h-40 w-40">
                <Image
                  src="/images/features/compliance.png"
                  alt="Compliance Management"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">Compliance Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Stay compliant with healthcare regulations, policies, and training requirements.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="relative h-40 w-40">
                <Image
                  src="/images/features/analytics.png"
                  alt="Analytics & Reporting"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">Analytics & Reporting</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Gain insights with powerful analytics and customizable reports.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3">
                <Stethoscope className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Medication Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Track prescriptions, dosages, schedules, and medication adherence.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Document Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Securely store, organize, and share important healthcare documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Dashboard</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Get a complete overview of your healthcare operations at a glance.
              </p>
            </div>
          </div>
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
            <Image src="/images/dashboard-preview.png" alt="ComplexCare CRM Dashboard" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Care Planning Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="relative h-[400px] w-full rounded-lg shadow-xl overflow-hidden">
              <Image
                src="/images/care-planning.png"
                alt="Care planning with ComplexCare CRM"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Personalized Care
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">Comprehensive Care Planning</h2>
              <p className="text-gray-500 md:text-lg dark:text-gray-400">
                Create detailed, personalized care plans for each patient. Track progress, set goals, and ensure the
                highest quality of care.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Customizable care plan templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Goal setting and progress tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Collaborative care team input</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>Regular review reminders</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/features">
                  <Button>Learn More About Care Planning</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
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
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-8 shadow-sm">
              <h3 className="text-4xl font-bold text-primary">500+</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">Care Providers</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-8 shadow-sm">
              <h3 className="text-4xl font-bold text-primary">25,000+</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">Patients Managed</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-8 shadow-sm">
              <h3 className="text-4xl font-bold text-primary">98%</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">Compliance Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-8 shadow-sm">
              <h3 className="text-4xl font-bold text-primary">30%</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">Time Saved</p>
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
