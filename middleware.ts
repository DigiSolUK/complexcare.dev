import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "@/lib/auth/stack-auth-server"

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/api/auth/stack/signin",
  "/api/auth/stack/signup",
  "/api/auth/stack/session",
  "/",
  "/features",
  "/pricing",
  "/about",
  "/contact",
  "/legal",
  "/hipaa",
  "/roadmap",
  "/blog",
  "/api/public",
  "/api/health",
]

const AUTH_REDIRECT_PATH = "/login"
const DASHBOARD_PATH = "/dashboard"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/_next/") || pathname.startsWith("/static/") || pathname.includes(".")) {
    return NextResponse.next()
  }

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || (path.endsWith("/") && pathname.startsWith(path)) || pathname.startsWith(`${path}/`),
  )

  const session = await getServerSession(request)

  if (isPublicPath) {
    if (session?.user && (pathname === AUTH_REDIRECT_PATH || pathname === "/signup")) {
      return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
    }
    return NextResponse.next()
  }

  if (!session?.user) {
    const loginUrl = new URL(AUTH_REDIRECT_PATH, request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const requestHeaders = new Headers(request.headers)
  const tenantId = session.user.tenantId || process.env.DEFAULT_TENANT_ID

  if (tenantId) {
    requestHeaders.set("x-tenant-id", tenantId)
  } else {
    console.warn(
      `User ${session.user.userId} authenticated but missing tenantId in session and no default. Path: ${pathname}`,
    )
  }

  // --- RBAC Enforcement Example in Middleware ---
  // This is a basic example. For complex RBAC, use `hasPermission` in API routes/Server Actions.
  if (pathname.startsWith("/superadmin") && session.user.role !== "superadmin") {
    console.warn(
      `Access denied: User ${session.user.userId} with role '${session.user.role}' tried to access superadmin path.`,
    )
    return NextResponse.redirect(new URL("/unauthorized", request.url)) // Redirect to an unauthorized page
  }
  // Add more role-based checks as needed for other sensitive routes
  // Example: if (pathname.startsWith("/admin") && !["admin", "superadmin"].includes(session.user.role)) { ... }
  // --- End RBAC Enforcement Example ---

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!api/auth/stack/signout|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
