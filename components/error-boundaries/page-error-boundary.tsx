"use client"

import type React from "react"

import { ErrorBoundary } from "../error-boundary"

export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
