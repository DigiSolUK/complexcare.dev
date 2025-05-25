"use client"

import { createContext, useContext, type ReactNode } from "react"

// Define the shape of our database context
interface DbContextType {
  isConnected: boolean
  isLoading: boolean
  error: Error | null
}

// Create the context with default values
const DbContext = createContext<DbContextType>({
  isConnected: false,
  isLoading: true,
  error: null,
})

// Provider component
export function DbProvider({ children }: { children: ReactNode }) {
  // In the client component, we always use mock data
  // The real database connection happens only on the server
  const contextValue = {
    isConnected: true, // Pretend we're connected in the client
    isLoading: false,
    error: null,
  }

  return <DbContext.Provider value={contextValue}>{children}</DbContext.Provider>
}

// Hook to use the database context
export function useDb() {
  return useContext(DbContext)
}
