import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This middleware currently does nothing but pass the request through.
  // It can be extended later for custom authentication, tenant routing, etc.
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth routes)
     * - api/public (public API routes)
     * - /((?!api|_next/static|_next/image|favicon.ico).*)
     */
    "/((?!api/auth|api/public|_next/static|_next/image|favicon.ico).*)",
  ],
}
