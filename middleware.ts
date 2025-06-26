import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@/lib/auth" // Assuming getSession is correctly implemented for NextAuth

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow access to public API endpoints without authentication
  if (pathname.startsWith("/api/public/")) {
    return NextResponse.next()
  }

  // Allow marketing pages to be accessible without authentication
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon.ico") || pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/patients",
    "/care-professionals",
    "/medications",
    "/documents",
    "/finances",
    "/recruitment",
    "/content",
    "/analytics",
    "/reports",
    "/settings",
    "/appointments",
    "/tasks",
    "/invoicing",
    "/payroll",
    "/timesheets",
    "/compliance",
    "/clinical-decision-support",
    "/medication-interactions",
    "/admin",
    "/ai-analytics",
    "/ai-tools",
    "/care-plans",
    "/profile",
    "/api/", // All API routes are protected by default, except /api/public
    "/superadmin", // Superadmin routes are also protected
  ]

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const session = await getSession()

    if (!session) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(loginUrl)
    }

    // If authenticated, proceed
    return NextResponse.next()
  }

  // For all other routes (e.g., marketing pages), allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files and internal Next.js paths
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
