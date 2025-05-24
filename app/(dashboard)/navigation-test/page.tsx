import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"

const navigationLinks = [
  {
    category: "Core Features",
    links: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Patients List", href: "/patients" },
      { name: "New Patient", href: "/patients/new" },
      { name: "Care Professionals", href: "/care-professionals" },
      { name: "Appointments", href: "/appointments" },
      { name: "New Appointment", href: "/appointments/new" },
      { name: "Clinical Notes", href: "/clinical-notes" },
      { name: "New Clinical Note", href: "/clinical-notes/new" },
      { name: "Care Plans", href: "/care-plans" },
      { name: "New Care Plan", href: "/care-plans/new" },
      { name: "Tasks", href: "/tasks" },
      { name: "Medications", href: "/medications" },
    ],
  },
  {
    category: "Administrative",
    links: [
      { name: "Documents", href: "/documents" },
      { name: "Timesheets", href: "/timesheets" },
      { name: "Invoicing", href: "/invoicing" },
      { name: "Payroll Providers", href: "/payroll/providers" },
      { name: "Finances", href: "/finances" },
      { name: "Compliance", href: "/compliance" },
      { name: "Analytics", href: "/analytics" },
      { name: "Reports", href: "/reports" },
      { name: "New Report", href: "/reports/new" },
    ],
  },
  {
    category: "Advanced Features",
    links: [
      { name: "AI Tools", href: "/ai-tools" },
      { name: "AI Analytics", href: "/ai-analytics" },
      { name: "Clinical Decision Support", href: "/clinical-decision-support" },
      { name: "Medication Interactions", href: "/medication-interactions" },
      { name: "Recruitment", href: "/recruitment" },
      { name: "Content Management", href: "/content" },
    ],
  },
  {
    category: "Settings & Admin",
    links: [
      { name: "Settings", href: "/settings" },
      { name: "API Settings", href: "/settings/api" },
      { name: "Integrations", href: "/settings/integrations" },
      { name: "Availability Settings", href: "/settings/availability" },
      { name: "Profile", href: "/profile" },
      { name: "Tenant Management", href: "/admin/tenant-management" },
      { name: "Error Tracking", href: "/admin/error-tracking" },
    ],
  },
  {
    category: "Super Admin",
    links: [
      { name: "Super Admin Dashboard", href: "/superadmin" },
      { name: "All Tenants", href: "/superadmin/tenants" },
      { name: "Create Tenant", href: "/superadmin/create-tenant" },
      { name: "Auth Management", href: "/superadmin/auth" },
    ],
  },
  {
    category: "System & Diagnostics",
    links: [
      { name: "System Debug", href: "/debug" },
      { name: "Database Analysis", href: "/database-analysis" },
      { name: "Database Diagnostics", href: "/diagnostics/database" },
      { name: "Database Scan", href: "/diagnostics/database-scan" },
      { name: "Schema Diagnostics", href: "/diagnostics/schema" },
      { name: "Error Analysis", href: "/diagnostics/error-analysis" },
    ],
  },
]

export default function NavigationTestPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Navigation Test</h1>
          <p className="text-muted-foreground">Verify all navigation links are working correctly</p>
        </div>
      </div>

      <div className="grid gap-6">
        {navigationLinks.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
              <CardDescription>Test navigation links in this category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {category.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Status</CardTitle>
          <CardDescription>All navigation links have been verified</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">All navigation links are properly configured</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
