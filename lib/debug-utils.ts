// Debug utilities for development
export function safeAccess<T>(
  obj: T | null | undefined,
  accessor: (obj: T) => any,
  defaultValue: any = null,
  componentName?: string,
): any {
  try {
    if (obj === null || obj === undefined) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Attempted to access property on null/undefined object${componentName ? ` in ${componentName}` : ""}`,
        )
      }
      return defaultValue
    }
    return accessor(obj)
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error accessing property${componentName ? ` in ${componentName}` : ""}:`, error)
    }
    return defaultValue
  }
}

// Type guard to check if an object has a specific property
export function hasProperty<T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> {
  return key in obj
}

// Safe type access helper
export function getType(obj: any, defaultType = "unknown"): string {
  if (obj === null || obj === undefined) {
    return defaultType
  }

  // Check common type properties
  if (typeof obj.type === "string") {
    return obj.type
  }

  if (typeof obj._type === "string") {
    return obj._type
  }

  if (typeof obj.__typename === "string") {
    return obj.__typename
  }

  // Return constructor name as fallback
  if (obj.constructor && obj.constructor.name) {
    return obj.constructor.name
  }

  return defaultType
}
