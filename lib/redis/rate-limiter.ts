import { redis } from "./client"
import { type NextRequest, NextResponse } from "next/server"

const RATE_LIMIT_PREFIX = "ratelimit:"
const DEFAULT_LIMIT = 100 // requests
const DEFAULT_WINDOW = 60 * 60 // 1 hour in seconds

/**
 * Rate limiter middleware for API routes
 */
export async function rateLimiter(
  req: NextRequest,
  identifier = "ip", // 'ip', 'user', or custom identifier
  limit: number = DEFAULT_LIMIT,
  window: number = DEFAULT_WINDOW,
) {
  // Get identifier value
  let id: string

  if (identifier === "ip") {
    id = req.ip || "127.0.0.1"
  } else if (identifier === "user") {
    // Get user ID from session or token
    const authHeader = req.headers.get("authorization")
    id = authHeader?.split(" ")[1] || "anonymous"
  } else {
    id = identifier
  }

  const key = `${RATE_LIMIT_PREFIX}${id}`

  // Get current count
  const count = await redis.incr(key)

  // Set expiry on first request
  if (count === 1) {
    await redis.expire(key, window)
  }

  // Set headers
  const headers = new Headers()
  headers.set("X-RateLimit-Limit", limit.toString())
  headers.set("X-RateLimit-Remaining", Math.max(0, limit - count).toString())

  // If over limit, return 429
  if (count > limit) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers })
  }

  return headers
}
