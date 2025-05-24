"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

type FetchState<T> = {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for fetching data with tenant context
 * @param url The API endpoint to fetch data from
 * @param initialData Optional initial data
 * @returns Object containing data, loading state, error state, and refetch function
 */
export function useTenantData<T>(url: string, initialData: T | null = null): FetchState<T> {
  const [data, setData] = useState<T | null>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: err instanceof Error ? err.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  const refetch = async () => {
    await fetchData()
  }

  return { data, isLoading, error, refetch }
}

/**
 * Custom hook for creating data with tenant context
 * @param url The API endpoint to post data to
 * @returns Object containing create function, loading state, and error state
 */
export function useCreateTenantData<T, R>(url: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const createData = async (data: T): Promise<R | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: "Data created successfully",
      })

      return result
    } catch (err) {
      console.error("Error creating data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error creating data",
        description: err instanceof Error ? err.message : "An unknown error occurred",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { createData, isLoading, error }
}

/**
 * Custom hook for updating data with tenant context
 * @param baseUrl The base API endpoint to update data
 * @returns Object containing update function, loading state, and error state
 */
export function useUpdateTenantData<T, R>(baseUrl: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const updateData = async (id: string, data: Partial<T>): Promise<R | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const url = `${baseUrl}/${id}`
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: "Data updated successfully",
      })

      return result
    } catch (err) {
      console.error("Error updating data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error updating data",
        description: err instanceof Error ? err.message : "An unknown error occurred",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { updateData, isLoading, error }
}

/**
 * Custom hook for deleting data with tenant context
 * @param baseUrl The base API endpoint to delete data from
 * @returns Object containing delete function, loading state, and error state
 */
export function useDeleteTenantData(baseUrl: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const deleteData = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const url = `${baseUrl}/${id}`
      const response = await fetch(url, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      toast({
        title: "Success",
        description: "Data deleted successfully",
      })

      return true
    } catch (err) {
      console.error("Error deleting data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error deleting data",
        description: err instanceof Error ? err.message : "An unknown error occurred",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteData, isLoading, error }
}
