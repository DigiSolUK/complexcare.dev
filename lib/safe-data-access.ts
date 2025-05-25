// Safe data access utilities

export interface SafeAccessOptions {
  logErrors?: boolean
  component?: string
  fallbackValue?: any
}

/**
 * Safely access nested properties in objects
 * @example
 * const userType = safe(() => user.profile.type, 'guest');
 */
export function safe<T>(accessor: () => T, fallback: T, options?: SafeAccessOptions): T {
  try {
    const result = accessor()
    if (result === null || result === undefined) {
      if (options?.logErrors && process.env.NODE_ENV === "development") {
        console.warn(`Null/undefined value accessed${options.component ? ` in ${options.component}` : ""}`)
      }
      return fallback
    }
    return result
  } catch (error) {
    if (options?.logErrors && process.env.NODE_ENV === "development") {
      console.error(`Error accessing value${options.component ? ` in ${options.component}` : ""}:`, error)
    }
    return fallback
  }
}

/**
 * Type-safe property checker
 */
export function hasType<T extends { type?: string }>(obj: T | null | undefined): obj is T & { type: string } {
  return obj != null && typeof obj.type === "string"
}

/**
 * Get type from various objects safely
 */
export function getTypeSafe(obj: any, fallback = "unknown"): string {
  // Handle null/undefined
  if (obj == null) return fallback

  // Try common type properties
  const typeValue = obj.type ?? obj._type ?? obj.__typename ?? obj.kind

  if (typeof typeValue === "string") {
    return typeValue
  }

  // Try to get constructor name
  if (obj.constructor?.name && obj.constructor.name !== "Object") {
    return obj.constructor.name
  }

  return fallback
}
