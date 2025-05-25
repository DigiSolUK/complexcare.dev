"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { AlertCircle, AlertTriangle, Info, RefreshCw, Trash2 } from "lucide-react"

export default function ErrorLogsPage() {
  const [errors, setErrors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  })
  const [filters, setFilters] = useState({
    level: "",
    component: "",
    route: "",
    startDate: "",
    endDate: "",
  })

  // Fetch error logs
  const fetchErrors = async () => {
    setLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      })

      if (filters.level) params.append("level", filters.level)
      if (filters.component) params.append("component", filters.component)
      if (filters.route) params.append("route", filters.route)
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)

      const response = await fetch(`/api/diagnostics/error-report?${params.toString()}`)
      const data = await response.json()

      setErrors(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Failed to fetch error logs:", error)
    } finally {
      setLoading(false)
    }
  }

  // Clear error logs
  const clearErrors = async () => {
    if (!confirm("Are you sure you want to clear all error logs?")) return

    try {
      await fetch("/api/diagnostics/error-report", {
        method: "DELETE",
      })
      fetchErrors()
    } catch (error) {
      console.error("Failed to clear error logs:", error)
    }
  }

  // Delete a specific error
  const deleteError = async (id: string) => {
    try {
      await fetch(`/api/diagnostics/error-report?id=${id}`, {
        method: "DELETE",
      })
      fetchErrors()
    } catch (error) {
      console.error("Failed to delete error:", error)
    }
  }

  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    setPagination((prev) => ({
      ...prev,
      offset: newOffset,
    }))
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setPagination((prev) => ({
      ...prev,
      offset: 0,
    }))
  }

  // Apply filters
  const applyFilters = () => {
    fetchErrors()
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      level: "",
      component: "",
      route: "",
      startDate: "",
      endDate: "",
    })
    setPagination((prev) => ({
      ...prev,
      offset: 0,
    }))
  }

  // Initial fetch
  useEffect(() => {
    fetchErrors()
  }, [pagination.offset, pagination.limit])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Get level icon
  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Error Logs</h1>
        <div className="flex gap-2">
          <Button onClick={fetchErrors} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={clearErrors} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Level</label>
              <Select value={filters.level} onValueChange={(value) => handleFilterChange("level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Component</label>
              <Input
                placeholder="Component name"
                value={filters.component}
                onChange={(e) => handleFilterChange("component", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Route</label>
              <Input
                placeholder="Route path"
                value={filters.route}
                onChange={(e) => handleFilterChange("route", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={resetFilters} variant="outline">
              Reset
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : errors.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No errors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Level</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getLevelIcon(error.level)}
                          <span className="capitalize">{error.level}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{error.message}</TableCell>
                      <TableCell>{error.component || "-"}</TableCell>
                      <TableCell>{error.route || "-"}</TableCell>
                      <TableCell>{formatDate(error.timestamp)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => deleteError(error.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && errors.length > 0 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                  disabled={pagination.offset === 0}
                />
              </PaginationItem>

              {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, i) => {
                const pageOffset = i * pagination.limit
                const isCurrent = pageOffset === pagination.offset

                // Only show a few pages around the current page
                if (
                  i === 0 ||
                  i === Math.ceil(pagination.total / pagination.limit) - 1 ||
                  (i >= pagination.offset / pagination.limit - 1 && i <= pagination.offset / pagination.limit + 1)
                ) {
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink isActive={isCurrent} onClick={() => handlePageChange(pageOffset)}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (
                  (i === 1 && pagination.offset / pagination.limit > 2) ||
                  (i === Math.ceil(pagination.total / pagination.limit) - 2 &&
                    pagination.offset / pagination.limit < Math.ceil(pagination.total / pagination.limit) - 3)
                ) {
                  return <PaginationItem key={i}>...</PaginationItem>
                }

                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                  disabled={!pagination.hasMore}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
