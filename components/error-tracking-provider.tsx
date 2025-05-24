"use client"

import { createContext, useContext, type ReactNode } from "react"

interface ErrorTrackingContextType {
  logError: (error: Error, context?: Record<string, any>) => void
}

const ErrorTrackingContext = createContext<ErrorTrackingContextType>({
  logError: () => {},
})

export function ErrorTrackingProvider({ children }: { children: ReactNode }) {
  const logError = (error: Error, context?: Record<string, any>) => {
    console.error("Error logged:", error, context)
    // In production, you would send this to your error tracking service
  }

  return <ErrorTrackingContext.Provider value={{ logError }}>{children}</ErrorTrackingContext.Provider>
}

export function useErrorTracking() {
  return useContext(ErrorTrackingContext)
}
