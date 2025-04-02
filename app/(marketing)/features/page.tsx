import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Users,
  ClipboardList,
  Calendar,
  CreditCard,
  Shield,
  BarChart,
  UserCircle,
  Bell,
  FileText,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { constructMetadata } from "@/lib/metadata"

export const metadata: Metadata = constructMetadata({
  title: "ComplexCare CRM Features - Powerful Tools for Complex Care Management",
  description:
    "Explore the comprehensive features of ComplexCare CRM designed specifically for UK healthcare providers managing complex care needs.",
  keywords: [
    "healthcare CRM features",
    "care planning tools",
    "patient management features",
    "healthcare compliance tools",
    "care coordination software",
    "UK healthcare software features",
    "complex care management tools",
  ],
})

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features for Complex Care Management
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover how ComplexCare CRM can streamline your healthcare operations and improve patient outcomes
                across the UK.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Dashboards Section */}
      <section className="py-16 md:py-20" id="role-based-dashboards" aria-labelledby="dashboards-heading">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted p-2">
                <Users className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h2 id="dashboards-heading" className="text-3xl font-bold tracking-tighter">
                Role-Based Dashboards
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Customized views for administrators, care professionals, and patients ensure everyone sees the
                information most relevant to their role.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Administrator dashboards with organizational metrics</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Care professional views focused on patient care</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Patient portal with appointment and care plan information</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-muted/50 p-8">
              <div className="aspect-video overflow-hidden rounded-lg bg-background">
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                        <UserCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg border bg-background p-3">
                          <div className="text-sm text-muted-foreground">Patients</div>
                          <div className="text-2xl font-bold">246</div>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                          <div className="text-sm text-muted-foreground">Appointments</div>
                          <div className="text-2xl font-bold">18</div>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                          <div className="text-sm text-muted-foreground">Tasks</div>
                          <div className="text-2xl font-bold">42</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <div className="text-sm font-medium">Recent Activity</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-xs">
                          <Bell className="mr-2 h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span>New patient added: John Doe</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Bell className="mr-2 h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span>Appointment scheduled with Dr. Smith</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Bell className="mr-2 h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span>Care plan updated for Jane Smith</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Task Assignment and Care Planning Section */}
      <section className="bg-muted/30 py-16 md:py-20" id="care-planning" aria-labelledby="care-planning-heading">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="rounded-lg border bg-background p-8 order-2 lg:order-1">
              <div className="aspect-video overflow-hidden rounded-lg bg-muted/50">
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Care Plan: John Doe</h3>
                        <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="rounded-lg border bg-muted/50 p-3">
                        <div className="text-sm font-medium">Care Goals</div>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center text-xs">
                            <div className="mr-2 h-3 w-3 rounded-full bg-green-500" aria-hidden="true"></div>
                            <span>Improve mobility through physical therapy</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500" aria-hidden="true"></div>
                            <span>Medication management for chronic conditions</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" aria-hidden="true"></div>
                            <span>Regular monitoring of vital signs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <div className="text-sm font-medium">Assigned Tasks</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Weekly physical therapy session</span>
                          <span className="text-muted-foreground">Dr. Williams</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Medication review</span>
                          <span className="text-muted-foreground">Nurse Johnson</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Blood pressure check</span>
                          <span className="text-muted-foreground">Nurse Thompson</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 order-1 lg:order-2">
              <div className="inline-block rounded-lg bg-muted p-2">
                <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h2 id="care-planning-heading" className="text-3xl font-bold tracking-tighter">
                Task Assignment & Care Planning
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Create comprehensive care plans and assign tasks to your team with our intuitive tools designed
                specifically for UK healthcare providers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Customizable care plan templates</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Task assignment with due dates and priorities</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span>Progress tracking and outcome measurement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* More Features Section */}
      <section className="py-16 md:py-20" id="more-features" aria-labelledby="more-features-heading">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 id="more-features-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl">
                More Powerful Features
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                ComplexCare CRM offers a comprehensive suite of tools to manage every aspect of complex care in the UK
                healthcare system.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Calendar className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Patient Portal</CardTitle>
                <CardDescription>Empower patients with access to their care information</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Appointment scheduling and reminders</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Secure messaging with care team</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Access to care plans and progress</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CreditCard className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Billing & Invoicing</CardTitle>
                <CardDescription>Streamline financial operations with integrated tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Automated invoice generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Payment tracking and reconciliation</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Financial reporting and analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Compliance Monitoring</CardTitle>
                <CardDescription>Stay compliant with UK healthcare regulations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Certification and credential tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Audit trails and documentation</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Regulatory requirement alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Lock className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Security Features</CardTitle>
                <CardDescription>Protect sensitive patient information</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Role-based access controls</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Audit logging and monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BarChart className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Gain insights with comprehensive reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Customizable dashboards and reports</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Outcome tracking and analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Data export and integration capabilities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>Streamline scheduling and reduce no-shows</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Calendar integration and scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Automated reminders and notifications</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Resource allocation and optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16 md:py-20" id="get-started" aria-labelledby="get-started-heading">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 id="get-started-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Transform Your Care Management?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Start your free trial today and see how ComplexCare CRM can improve your healthcare operations.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  Contact Sales <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
            "@type": "SoftwareApplication",
            name: "ComplexCare CRM",
            applicationCategory: "HealthcareApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "25.00",
              priceCurrency: "GBP",
            },
            description:
              "ComplexCare CRM offers powerful features for complex care management including role-based dashboards, care planning tools, appointment management, and more.",
            featureList: [
              "Role-based dashboards",
              "Care planning tools",
              "Appointment management",
              "Billing and invoicing",
              "Compliance monitoring",
              "Advanced analytics",
            ],
          }),
        }}
      />
    </div>
  )
}

