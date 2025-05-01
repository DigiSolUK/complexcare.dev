import type React from "react"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/mode-toggle"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-6 md:gap-10">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  ComplexCare.dev
                </span>
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-base">Product</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/features"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Features</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Explore the powerful features of ComplexCare.dev
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/pricing"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Pricing</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Transparent pricing plans for organizations of all sizes
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/security"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Security</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Learn about our robust security measures and compliance
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/roadmap"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Roadmap</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                See what's coming next in our product development
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-base">Support</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/documentation"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Documentation</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Comprehensive guides for administrators and users
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/guides"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Guides</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Step-by-step tutorials for common tasks
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/api-status"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">API Status</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Check our system status and service uptime
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/help-center"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Help Center</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                FAQs and support resources to help you succeed
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-base">Company</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/about"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">About</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Learn about our mission and team
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/blog"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Blog</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Industry insights and product updates
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/careers"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Careers</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Join our team and make an impact
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/contact"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent"
                            >
                              <div className="text-sm font-medium leading-none">Contact</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Get in touch with our team
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/legal" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Legal</NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent/10">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent-700">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-muted/40">
          <div className="container py-8 md:py-12">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
              <div className="col-span-2 lg:col-span-2">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    ComplexCare.dev
                  </span>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                  Empowering healthcare professionals with comprehensive care management solutions.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Product</h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/features" className="text-sm text-muted-foreground hover:text-accent">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-muted-foreground hover:text-accent">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="text-sm text-muted-foreground hover:text-accent">
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link href="/roadmap" className="text-sm text-muted-foreground hover:text-accent">
                      Roadmap
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium">Support</h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/documentation" className="text-sm text-muted-foreground hover:text-accent">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="text-sm text-muted-foreground hover:text-accent">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/api-status" className="text-sm text-muted-foreground hover:text-accent">
                      API Status
                    </Link>
                  </li>
                  <li>
                    <Link href="/help-center" className="text-sm text-muted-foreground hover:text-accent">
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium">Legal</h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-accent">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-accent">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/hipaa" className="text-sm text-muted-foreground hover:text-accent">
                      HIPAA
                    </Link>
                  </li>
                  <li>
                    <Link href="/gdpr" className="text-sm text-muted-foreground hover:text-accent">
                      GDPR
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} ComplexCare.dev. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Link href="#" className="text-sm text-muted-foreground hover:text-accent">
                  Twitter
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-accent">
                  LinkedIn
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-accent">
                  Facebook
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
