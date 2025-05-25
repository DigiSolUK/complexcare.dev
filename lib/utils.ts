import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add the missing exports
export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions = {}): string {
  if (!date) return "N/A"

  try {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...options,
    }

    return new Date(date).toLocaleDateString("en-GB", defaultOptions)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

export function formatCurrency(amount: number, currency = "GBP", locale = "en-GB"): string {
  if (amount === null || amount === undefined) return "N/A"

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${amount}`
  }
}
