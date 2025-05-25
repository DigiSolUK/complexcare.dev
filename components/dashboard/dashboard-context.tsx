"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the filter types
export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface Filters {
  dateRange: DateRange
  patientStatus: string[]
  appointmentType: string[]
  taskPriority: string[]
  [key: string]: any
}

// Define the context type
interface DashboardContextType {
  filters: Filters
  setFilters: (filters: Filters) => void
  isLoading: boolean
  refreshData: () => void
}

// Create the context with default values
const DashboardContext = createContext<DashboardContextType>({
  filters: {
    dateRange: { from: undefined, to: undefined },
    patientStatus: [],
    appointmentType: [],
    taskPriority: [],
  },
  setFilters: () => {},
  isLoading: false,
  refreshData: () => {},
})

// Provider component
export function DashboardProvider({ children }: { children: ReactNode }) {
  // Default date range: last 30 days
  const defaultFrom = new Date()
  defaultFrom.setDate(defaultFrom.getDate() - 30)

  const [filters, setFilters] = useState<Filters>({
    dateRange: { from: defaultFrom, to: new Date() },
    patientStatus: [],
    appointmentType: [],
    taskPriority: [],
  })

  const [isLoading, setIsLoading] = useState(false)

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true)
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Initial load
  useEffect(() => {
    setIsLoading(true)
    // Simulate initial data loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // When filters change, reload data
  useEffect(() => {
    setIsLoading(true)
    // Simulate data loading when filters change
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
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
