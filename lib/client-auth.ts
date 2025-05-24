"use client"

// Client-side authentication utilities
export function getAuthCallbackUrl(): string {
  if (typeof window !== "undefined") {
    return encodeURIComponent(window.location.href)
  }
  return ""
}

export function redirectToSignIn(callbackUrl?: string) {
  if (typeof window !== "undefined") {
    const url = callbackUrl || getAuthCallbackUrl()
    window.location.href = `/auth/signin?callbackUrl=${url}`
  }
}

export function redirectToUnauthorized() {
  if (typeof window !== "undefined") {
    window.location.href = "/unauthorized"
  }
}
