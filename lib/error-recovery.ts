import { toast } from "@/components/ui/use-toast"

interface RecoveryStrategy {
  error: RegExp | string
  action: () => void | Promise<void>
  message?: string
}

const recoveryStrategies: RecoveryStrategy[] = [
  {
    error: /network|fetch|connection/i,
    action: () => {
      toast({
        title: "Connection Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
    },
  },
  {
    error: /unauthorized|401/i,
    action: () => {
      toast({
        title: "Session Expired",
        description: "Please log in again to continue.",
        variant: "destructive",
      })
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    },
  },
  {
    error: /forbidden|403/i,
    action: () => {
      toast({
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
        variant: "destructive",
      })
    },
  },
  {
    error: /not found|404/i,
    action: () => {
      toast({
        title: "Not Found",
        description: "The requested resource could not be found.",
        variant: "destructive",
      })
    },
  },
  {
    error: /timeout/i,
    action: () => {
      toast({
        title: "Request Timeout",
        description: "The request took too long. Please try again.",
        variant: "destructive",
      })
    },
  },
  {
    error: /database|sql/i,
    action: () => {
      toast({
        title: "Database Error",
        description: "We're experiencing technical difficulties. Please try again later.",
        variant: "destructive",
      })
    },
  },
]

export function handleErrorRecovery(error: Error | unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error)

  // Find matching recovery strategy
  const strategy = recoveryStrategies.find((s) => {
    if (typeof s.error === "string") {
      return errorMessage.includes(s.error)
    }
    return s.error.test(errorMessage)
  })

  if (strategy) {
    strategy.action()
  } else {
    // Default error handling
    toast({
      title: "An error occurred",
      description: "Please try again or contact support if the problem persists.",
      variant: "destructive",
    })
  }

  // Always log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error)
  }
}

// Retry mechanism for failed requests
export async function retryRequest<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error | unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.match(/4\d{2}/)) {
        throw error
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError
}
