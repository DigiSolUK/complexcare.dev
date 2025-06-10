import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "@/lib/auth/stack-auth-server" // Updated import

const PUBLIC_PATHS = [
  "/login",
  "/api/auth/stack/signin",
  "/api/auth/stack/session",
  // Add other public paths like /register, /forgot-password, marketing pages
  "/", // Assuming marketing homepage is public
  "/features",
  "/pricing",
  "/about",
  "/contact",
  "/legal",
  "/hipaa",
  "/roadmap",
  "/blog",
  "/api/public", // Any public API endpoints
  "/api/health", // Health checks should be public
  "/api/diagnostics/database", // Diagnostics might be public or admin-only
]

const AUTH_REDIRECT_PATH = "/login"
const DASHBOARD_PATH = "/dashboard"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || (path.endsWith("/") && pathname.startsWith(path)) || pathname.startsWith(`${path}/`),
  )

  if (pathname.startsWith("/_next/") || pathname.startsWith("/static/") || pathname.includes(".")) {
    // Allow static assets and framework files
    return NextResponse.next()
  }

  const session = await getServerSession(request) // Pass request for header/cookie access

  if (isPublicPath) {
    // If user is authenticated and tries to access login page, redirect to dashboard
    if (session?.user && pathname === AUTH_REDIRECT_PATH) {
      return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
    }
    return NextResponse.next() // Allow access to public paths
  }

  // Path is not public, requires authentication
  if (!session?.user) {
    // Redirect to login, preserving the intended URL
    const loginUrl = new URL(AUTH_REDIRECT_PATH, request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // User is authenticated, allow access
  // You might add role/permission checks here for specific protected routes
  // For example: if (pathname.startsWith('/admin') && session.user.role !== 'admin') { ... }

  // Add tenant ID header if available from session (or default)
  const requestHeaders = new Headers(request.headers)
  const tenantId = session.tenantId || process.env.DEFAULT_TENANT_ID || "ba367cfe-6de0-4180-9566-1002b75cf82c"
  requestHeaders.set("x-tenant-id", tenantId)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Match all request paths except for API routes that should always be processed by their handlers
    // and internal Next.js paths.
    "/((?!api/auth/stack/signout|_next/static|_next/image|favicon.ico).*)",
  ],
}
