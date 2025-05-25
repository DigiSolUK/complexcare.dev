import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatString = "PPP"): string {
  if (!date) return "N/A"

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return format(dateObj, formatString)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

export function formatCurrency(amount: number, currency = "GBP", locale = "en-GB"): string {
  if (amount === undefined || amount === null) return "N/A"

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${amount}`
  }
}
