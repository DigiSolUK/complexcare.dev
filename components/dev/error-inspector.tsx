"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react"

interface ErrorInfo {
  id: string
  timestamp: Date
  message: string
  stack?: string
  component?: string
  type: "error" | "rejection"
}

export function ErrorInspector() {
  const [errors, setErrors] = useState<ErrorInfo[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return
    }

    const handleError = (event: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        id: `error-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        message: event.message,
        stack: event.error?.stack,
        type: "error",
      }

      setErrors((prev) => [...prev.slice(-9), errorInfo])
      setIsOpen(true)
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorInfo: ErrorInfo = {
        id: `rejection-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        type: "rejection",
      }

      setErrors((prev) => [...prev.slice(-9), errorInfo])
      setIsOpen(true)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  if (process.env.NODE_ENV !== "development" || errors.length === 0) {
    return null
  }

  const toggleError = (id: string) => {
    setExpandedErrors((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const clearErrors = () => {
    setErrors([])
    setExpandedErrors(new Set())
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {isOpen ? (
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Development Error Inspector
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={clearErrors} className="h-6 px-2 text-xs">
                  Clear
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <CardDescription className="text-xs">
              {errors.length} error{errors.length !== 1 ? "s" : ""} detected
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto pb-3">
            <div className="space-y-2">
              {errors.map((error) => (
                <div key={error.id} className="border rounded p-2 text-xs bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-red-700 dark:text-red-400">
                        {error.type === "rejection" ? "Promise Rejection" : "Error"}
                      </div>
                      <div className="text-red-600 dark:text-red-300 break-words">{error.message}</div>
                      <div className="text-gray-500 text-[10px] mt-1">{error.timestamp.toLocaleTimeString()}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toggleError(error.id)} className="h-6 w-6 ml-2">
                      {expandedErrors.has(error.id) ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  {expandedErrors.has(error.id) && error.stack && (
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-[10px] overflow-x-auto">
                      {error.stack}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="shadow-lg">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
          {errors.length} Error{errors.length !== 1 ? "s" : ""}
        </Button>
      )}
    </div>
  )
}
