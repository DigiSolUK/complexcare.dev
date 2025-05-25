"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface DatabaseContextType {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  checkConnection: () => Promise<void>
}

const DatabaseContext = createContext<DatabaseContextType>({
  isConnected: false,
  isLoading: true,
  error: null,
  checkConnection: async () => {},
})

export function useDatabaseConnection() {
  return useContext(DatabaseContext)
}

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/health/database")

      if (response.ok) {
        setIsConnected(true)
      } else {
        const errorData = await response.json()
        setIsConnected(false)
        setError(errorData.message || "Database connection failed")
      }
    } catch (error) {
      setIsConnected(false)
      setError("Failed to check database connection")
      console.error("Database connection check error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <DatabaseContext.Provider value={{ isConnected, isLoading, error, checkConnection }}>
      {children}
    </DatabaseContext.Provider>
  )
}
