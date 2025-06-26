import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // This middleware is intentionally minimal as per the instruction
  // that no authentication is configured.
  // It simply allows all requests to pass through.
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (e.g. /public/images)
     * - api/public (public API routes)
     * - api/auth (auth routes, if re-enabled later)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/public|api/auth).*)",
  ],
}
