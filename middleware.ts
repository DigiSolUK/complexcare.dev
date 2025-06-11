import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getServerSession } from "@/lib/auth/stack-auth-server" // Correct import

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Define public paths that do not require authentication
  const publicPaths = [
    "/login",
    "/register",
    "/live-login",
    "/unauthorized",
    "/api/auth/stack/signin",
    "/api/auth/stack/signout",
    "/api/auth/stack/session",
    "/api/public/", // All public API routes
    "/", // Marketing landing page
    "/features",
    "/security",
    "/about",
    "/contact",
    "/legal",
    "/blog",
    "/roadmap",
    "/pricing",
    "/hipaa",
    "/error", // Error page
    "/loading", // Loading page
    "/not-found", // Not found page
    "/diagnostics", // System diagnostics
    "/diagnostics/database",
    "/diagnostics/schema",
    "/diagnostics/system-health",
    "/api/diagnostics/", // All diagnostics API routes
    "/api/health/", // All health check API routes
  ]

  // Check if the current path is a public path
  // IMPORTANT: Allow access to public paths immediately without session checks
  const isPublicPath = publicPaths.some((path) => (path.endsWith("/") ? pathname.startsWith(path) : pathname === path))
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Get the session using the server-side utility
  const session = await getServerSession(request)
  const isAuthenticated = session?.user ? true : false
  const userRole = session?.user?.role // Assuming role is part of the session user object

  // Redirect authenticated users from auth pages to dashboard
  if (isAuthenticated && (pathname === "/login" || pathname === "/register" || pathname === "/live-login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect dashboard and superadmin routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/superadmin")) {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url))
    }

    // Role-based access control for superadmin routes
    if (pathname.startsWith("/superadmin") && userRole !== "superadmin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Allow access to public paths without authentication
  // if (isPublicPath) {
  //   return NextResponse.next()
  // }

  // For any other path not explicitly handled, require authentication
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api/public/ (public API routes)
     * - /api/health/ (health check API routes)
     * - /api/diagnostics/ (diagnostics API routes)
     * - /api/auth/stack/ (Stack Auth API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/public/|api/health/|api/diagnostics/|api/auth/stack/).*)",
  ],
}
