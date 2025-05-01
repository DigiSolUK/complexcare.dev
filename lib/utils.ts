import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function isValidUUID(uuid: string): boolean {
  // Regular expression to check if string is a valid UUID
  const regexExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return regexExp.test(uuid)
}

export function generateDemoId(): string {
  return crypto.randomUUID()
}

export function handleApiError(error: any): { message: string; status: number } {
  console.error("API Error:", error)

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      message: error.response.data?.message || "Server error",
      status: error.response.status,
    }
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: "No response from server",
      status: 503,
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || "Unknown error",
      status: 500,
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
