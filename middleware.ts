import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { DEFAULT_TENANT_ID } from "@/lib/tenant-utils"
import { isValidUUID } from "@/lib/db-utils"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token

    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Ensure tenantId is a valid UUID, falling back if necessary
    const tenantId =
      token.tenantId && isValidUUID(token.tenantId as string) ? (token.tenantId as string) : DEFAULT_TENANT_ID

    // Attach tenantId to the request headers for API routes
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set("x-tenant-id", tenantId)

    // Allow access to API routes if authenticated
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    // Allow access to dashboard routes if authenticated
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    // Allow access to superadmin routes if authenticated and role is superadmin
    if (req.nextUrl.pathname.startsWith("/superadmin")) {
      if (token.role !== "superadmin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    // Allow access to specific public routes
    if (
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/unauthorized") ||
      req.nextUrl.pathname.startsWith("/error") ||
      req.nextUrl.pathname.startsWith("/api/public") ||
      req.nextUrl.pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next()
    }

    // For all other routes, if authenticated, proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If there's a token, the user is authorized
        return !!token
      },
    },
    pages: {
      signIn: "/login",
    },
  },
)

export const config = {
  matcher: ["/((?!api/public|api/auth|_next/static|_next/image|favicon.ico|login|unauthorized|error).*)"],
}
