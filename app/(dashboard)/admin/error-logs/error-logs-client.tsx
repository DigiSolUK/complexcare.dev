"use client"

import { useState, useEffect } from "react"
import { ErrorLogsTable } from "@/components/error-logs/error-logs-table"
import { ErrorLogsFilter } from "@/components/error-logs/error-logs-filter"
import { ErrorLogsPagination } from "@/components/error-logs/error-logs-pagination"
import { ErrorStats } from "@/components/error-logs/error-stats"
import type { ErrorLog, ErrorLogFilters } from "@/lib/services/error-logs-service"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCw } from "lucide-react"
import { SectionErrorBoundary } from "@/components/error-boundaries/section-error-boundary"

export function ErrorLogsClient() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<ErrorLog[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState<ErrorLogFilters>({
    limit: 25,
    offset: 0,
  })

  const currentPage = Math.floor(filters.offset! / filters.limit!) + 1
  const totalPages = Math.ceil(totalLogs / filters.limit!)

  const fetchLogs = async () => {
    try {
      setLoading(true)

      // Build query string from filters
      const queryParams = new URLSearchParams()

      if (filters.severity) queryParams.set("severity", filters.severity)
      if (filters.category) queryParams.set("category", filters.category)
      if (filters.resolved !== undefined) queryParams.set("resolved", String(filters.resolved))
      if (filters.search) queryParams.set("search", filters.search)
      if (filters.startDate) queryParams.set("startDate", filters.startDate)
      if (filters.endDate) queryParams.set("endDate", filters.endDate)
      if (filters.limit) queryParams.set("limit", String(filters.limit))
      if (filters.offset) queryParams.set("offset", String(filters.offset))

      const response = await fetch(`/api/admin/error-logs?${queryParams.toString()}`)

      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
        setTotalLogs(data.total)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch error logs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching logs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filters])

  const handleFilterChange = (newFilters: ErrorLogFilters) => {
    // Reset pagination when filters change
    setFilters({
      ...newFilters,
      offset: 0,
    })
  }

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      offset: (page - 1) * filters.limit!,
    })
  }

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({
      ...filters,
      limit: pageSize,
      offset: 0, // Reset to first page when changing page size
    })
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchLogs()
  }

  const handleResolveError = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/error-logs/${id}/resolve`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Error marked as resolved",
        })

        // Update the local state
        setLogs(logs.map((log) => (log.id === id ? { ...log, resolved: true } : log)))
      } else {
        toast({
          title: "Error",
          description: "Failed to resolve error",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resolving log:", error)
      toast({
        title: "Error",
        description: "An error occurred while resolving the error",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error Logs</h1>
          <p className="text-muted-foreground">Monitor and manage system errors</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <SectionErrorBoundary>
        <ErrorStats />
      </SectionErrorBoundary>

      <ErrorLogsFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="rounded-md border bg-white">
        <ErrorLogsTable logs={logs} onResolve={handleResolveError} />

        <div className="p-4 border-t">
          <ErrorLogsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={filters.limit!}
            totalItems={totalLogs}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  )
}
