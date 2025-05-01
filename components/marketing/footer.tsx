import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">ComplexCare</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              A comprehensive healthcare CRM for complex care management, designed to improve patient outcomes and
              streamline healthcare operations.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Product</h3>
            <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/security" className="text-sm text-muted-foreground hover:text-foreground">
              Security
            </Link>
            <Link href="/roadmap" className="text-sm text-muted-foreground hover:text-foreground">
              Roadmap
            </Link>
            <Link href="/integrations" className="text-sm text-muted-foreground hover:text-foreground">
              Integrations
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Support</h3>
            <Link href="/documentation" className="text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
            <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">
              Guides
            </Link>
            <Link href="/api-status" className="text-sm text-muted-foreground hover:text-foreground">
              API Status
            </Link>
            <Link href="/help-center" className="text-sm text-muted-foreground hover:text-foreground">
              Help Center
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
              Careers
            </Link>
            <Link href="/partnerships" className="text-sm text-muted-foreground hover:text-foreground">
              Partnerships
            </Link>
            <Link href="/csr" className="text-sm text-muted-foreground hover:text-foreground">
              CSR
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ComplexCare.dev. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/gdpr" className="text-xs text-muted-foreground hover:text-foreground">
              GDPR
            </Link>
            <Link href="/accessibility" className="text-xs text-muted-foreground hover:text-foreground">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
