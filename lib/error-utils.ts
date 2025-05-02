import { captureException } from "@/lib/services/error-logging-service"

/**
 * Wraps an async function with error handling
 * @param fn The async function to wrap
 * @param errorContext Additional context for error logging
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  errorContext?: Record<string, any>,
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    try {
      return await fn(...args)
    } catch (error) {
      captureException(error, {
        ...errorContext,
        functionName: fn.name,
        arguments: args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))),
      })
      throw error // Re-throw to allow component error boundaries to catch it
    }
  }
}

/**
 * Safely executes a function that might throw and returns a result object
 * @param fn The function to execute
 * @param fallbackValue A fallback value to return if the function throws
 */
export function tryCatch<T, F = null>(
  fn: () => T,
  fallbackValue: F = null as unknown as F,
): { success: true; data: T } | { success: false; error: unknown; data: F } {
  try {
    const data = fn()
    return { success: true, data }
  } catch (error) {
    captureException(error)
    return { success: false, error, data: fallbackValue }
  }
}

/**
 * Safely executes an async function and returns a result object
 * @param fn The async function to execute
 * @param fallbackValue A fallback value to return if the function throws
 */
export async function tryCatchAsync<T, F = null>(
  fn: () => Promise<T>,
  fallbackValue: F = null as unknown as F,
): Promise<{ success: true; data: T } | { success: false; error: unknown; data: F }> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    captureException(error)
    return { success: false, error, data: fallbackValue }
  }
}
