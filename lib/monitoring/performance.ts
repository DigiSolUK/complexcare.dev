// Simple performance monitoring utility

// Store performance metrics
const performanceMetrics: Record<
  string,
  {
    count: number
    totalTime: number
    min: number
    max: number
    lastTimestamp: number
  }
> = {}

// Measure execution time of a function
export async function measurePerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const startTime = performance.now()

  try {
    return await fn()
  } finally {
    const endTime = performance.now()
    const executionTime = endTime - startTime

    // Update metrics
    if (!performanceMetrics[name]) {
      performanceMetrics[name] = {
        count: 0,
        totalTime: 0,
        min: executionTime,
        max: executionTime,
        lastTimestamp: Date.now(),
      }
    }

    const metrics = performanceMetrics[name]
    metrics.count++
    metrics.totalTime += executionTime
    metrics.min = Math.min(metrics.min, executionTime)
    metrics.max = Math.max(metrics.max, executionTime)
    metrics.lastTimestamp = Date.now()
  }
}

// Get performance metrics
export function getPerformanceMetrics(): Record<
  string,
  {
    count: number
    avgTime: number
    min: number
    max: number
    lastTimestamp: number
  }
> {
  const result: Record<string, any> = {}

  for (const [name, metrics] of Object.entries(performanceMetrics)) {
    result[name] = {
      count: metrics.count,
      avgTime: metrics.totalTime / metrics.count,
      min: metrics.min,
      max: metrics.max,
      lastTimestamp: metrics.lastTimestamp,
    }
  }

  return result
}

// Reset performance metrics
export function resetPerformanceMetrics(): void {
  for (const key in performanceMetrics) {
    delete performanceMetrics[key]
  }
}

// Performance middleware for API routes
export function withPerformanceMonitoring(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const url = new URL(req.url)
    const routeName = `${req.method} ${url.pathname}`

    return measurePerformance(routeName, () => handler(req, ...args))
  }
}

