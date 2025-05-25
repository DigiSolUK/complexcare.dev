"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { startOfDay, endOfDay, subDays } from "date-fns"
import type { FilterState } from "./dashboard-filters"

// Define the dashboard context type
type DashboardContextType = {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  isLoading: boolean
  refreshData: () => Promise<void>
}

// Create the context with a default value
const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

// Default date range (last 30 days)
const defaultDateRange: DateRange = {
  from: startOfDay(subDays(new Date(), 29)),
  to: endOfDay(new Date()),
}

// Provider component
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    dateRange: defaultDateRange,
    filters: {},
  })

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Function to refresh data
  const refreshData = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch data based on the current filters
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error refreshing dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh data when filters change
  useEffect(() => {
    refreshData()
  }, [filters])

  return (
    <DashboardContext.Provider value={{ filters, setFilters, isLoading, refreshData }}>
      {children}
    </DashboardContext.Provider>
  )
}

// Hook to use the dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
