import { Shield, Lock, FileCheck, Server } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SecurityPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Security & Compliance</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We take the security and privacy of your data seriously. Learn about our comprehensive security measures
                and compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Overview Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted p-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">Our Security Commitment</h2>
              <p className="text-muted-foreground md:text-lg">
                At ComplexCare.app, we understand that healthcare data is among the most sensitive information entrusted
                to any organization. Our security approach is built on multiple layers of protection to ensure your data
                remains safe, private, and compliant with all relevant regulations.
              </p>
              <p className="text-muted-foreground md:text-lg">
                Our team of security experts continuously monitors, tests, and enhances our security measures to stay
                ahead of emerging threats and vulnerabilities.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <Lock className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Data Encryption</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All data is encrypted at rest and in transit using industry-standard AES-256 encryption.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Server className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Secure Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Hosted in ISO 27001 certified data centers with 24/7 monitoring and physical security.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileCheck className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Regular Audits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive security audits and penetration testing conducted quarterly.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Access Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Granular role-based access controls and multi-factor authentication.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Compliance Standards</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                ComplexCare.app is designed to meet the highest standards of regulatory compliance.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>GDPR Compliance</CardTitle>
                <CardDescription>European Union General Data Protection Regulation</CardDescription>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Data processing agreements</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Data subject access rights</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Privacy by design principles</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Data breach notification procedures</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>NHS Data Security & Protection</CardTitle>
                <CardDescription>UK National Health Service Standards</CardDescription>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>NHS Data Security & Protection Toolkit compliant</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Caldicott Principles adherence</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Information Governance compliance</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Regular NHS Digital audits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>HIPAA Compliance</CardTitle>
                <CardDescription>US Health Insurance Portability and Accountability Act</CardDescription>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Business Associate Agreements (BAAs)</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Protected Health Information (PHI) safeguards</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Security Rule compliance</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Audit controls and logging</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>ISO 27001</CardTitle>
                <CardDescription>International Information Security Standard</CardDescription>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Certified information security management system</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Risk assessment and management</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Security incident management</span>
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
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Annual independent audits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Protection Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Data Protection Measures</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                We implement multiple layers of protection to safeguard your data.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Encryption</h3>
              <p className="mt-2 text-muted-foreground">
                All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. Database backups
                are also encrypted to ensure data remains protected throughout its lifecycle.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Access Controls</h3>
              <p className="mt-2 text-muted-foreground">
                We implement strict role-based access controls, multi-factor authentication, and least privilege
                principles to ensure only authorized personnel can access sensitive information.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Data Retention</h3>
              <p className="mt-2 text-muted-foreground">
                Our data retention policies ensure that data is only kept for as long as necessary for the purposes for
                which it was collected, in compliance with relevant regulations.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Backup & Recovery</h3>
              <p className="mt-2 text-muted-foreground">
                We perform regular automated backups with point-in-time recovery capabilities. Backups are stored in
                geographically separate locations to ensure data resilience.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Vulnerability Management</h3>
              <p className="mt-2 text-muted-foreground">
                Our security team conducts regular vulnerability scans, penetration testing, and code reviews to
                identify and remediate potential security issues before they can be exploited.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-semibold">Incident Response</h3>
              <p className="mt-2 text-muted-foreground">
                We maintain a comprehensive incident response plan with defined procedures for identifying, containing,
                eradicating, and recovering from security incidents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Certifications Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Security Certifications</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Our platform has been independently verified to meet the highest security standards.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 py-8">
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <span className="mt-2 font-medium">ISO 27001</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="h-10 w-10 text-primary" />
                </div>
                <span className="mt-2 font-medium">GDPR Certified</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <FileCheck className="h-10 w-10 text-primary" />
                </div>
                <span className="mt-2 font-medium">NHS DSP Toolkit</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <Server className="h-10 w-10 text-primary" />
                </div>
                <span className="mt-2 font-medium">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
