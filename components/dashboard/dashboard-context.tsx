"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the filter types
export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface FilterState {
  dateRange: DateRange
  filters: Record<string, string[]>
}

// Define the context type
interface DashboardContextType {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  isLoading: boolean
  refreshData: () => Promise<void>
}

// Create the context with default values
const DashboardContext = createContext<DashboardContextType>({
  filters: {
    dateRange: { from: undefined, to: undefined },
    filters: {},
  },
  setFilters: () => {},
  isLoading: false,
  refreshData: async () => {},
})

// Provider component
export function DashboardProvider({ children }: { children: ReactNode }) {
  // Default date range: last 30 days
  const defaultFrom = new Date()
  defaultFrom.setDate(defaultFrom.getDate() - 30)

  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: defaultFrom, to: new Date() },
    filters: {},
  })

  const [isLoading, setIsLoading] = useState(false)

  // Function to refresh data
  const refreshData = async () => {
    setIsLoading(true)
    try {
      // Simulate data loading
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      try {
        // Simulate initial data loading
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // When filters change, reload data
  useEffect(() => {
    const loadFilteredData = async () => {
      setIsLoading(true)
      try {
        // Simulate data loading when filters change
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error("Error loading filtered data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFilteredData()
  }, [filters])

  return (
    <DashboardContext.Provider value={{ filters, setFilters, isLoading, refreshData }}>
      {children}
    </DashboardContext.Provider>
  )
}

// Hook for using the dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
