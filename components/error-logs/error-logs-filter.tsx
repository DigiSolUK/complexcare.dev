"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X, Calendar } from "lucide-react"
import type { ErrorLogFilters } from "@/lib/services/error-logs-service"
import { ErrorSeverity, ErrorCategory } from "@/lib/services/error-logging-service"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

interface ErrorLogsFilterProps {
  filters: ErrorLogFilters
  onFilterChange: (filters: ErrorLogFilters) => void
}

export function ErrorLogsFilter({ filters, onFilterChange }: ErrorLogsFilterProps) {
  const [localFilters, setLocalFilters] = useState<ErrorLogFilters>(filters)
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate ? new Date(filters.endDate) : undefined)

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
    setStartDate(filters.startDate ? new Date(filters.startDate) : undefined)
    setEndDate(filters.endDate ? new Date(filters.endDate) : undefined)
  }, [filters])

  const handleFilterChange = (key: keyof ErrorLogFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    if (date) {
      handleFilterChange("startDate", format(date, "yyyy-MM-dd"))
    } else {
      handleFilterChange("startDate", undefined)
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    if (date) {
      handleFilterChange("endDate", format(date, "yyyy-MM-dd"))
    } else {
      handleFilterChange("endDate", undefined)
    }
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }

  const handleResetFilters = () => {
    const resetFilters: ErrorLogFilters = {
      limit: filters.limit,
      offset: filters.offset,
    }
    setLocalFilters(resetFilters)
    setStartDate(undefined)
    setEndDate(undefined)
    onFilterChange(resetFilters)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-1 flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search error messages..."
                className="pl-8"
                value={localFilters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <Select
              value={localFilters.severity || ""}
              onValueChange={(value) => handleFilterChange("severity", value || undefined)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value={ErrorSeverity.CRITICAL}>Critical</SelectItem>
                <SelectItem value={ErrorSeverity.HIGH}>High</SelectItem>
                <SelectItem value={ErrorSeverity.MEDIUM}>Medium</SelectItem>
                <SelectItem value={ErrorSeverity.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={localFilters.category || ""}
              onValueChange={(value) => handleFilterChange("category", value || undefined)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={ErrorCategory.AUTHENTICATION}>Authentication</SelectItem>
                <SelectItem value={ErrorCategory.DATABASE}>Database</SelectItem>
                <SelectItem value={ErrorCategory.API}>API</SelectItem>
                <SelectItem value={ErrorCategory.UI}>UI</SelectItem>
                <SelectItem value={ErrorCategory.INTEGRATION}>Integration</SelectItem>
                <SelectItem value={ErrorCategory.VALIDATION}>Validation</SelectItem>
                <SelectItem value={ErrorCategory.SYSTEM}>System</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={localFilters.resolved !== undefined ? String(localFilters.resolved) : ""}
              onValueChange={(value) => {
                if (value === "") {
                  handleFilterChange("resolved", undefined)
                } else {
                  handleFilterChange("resolved", value === "true")
                }
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="false">Open</SelectItem>
                <SelectItem value="true">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Calendar className="h-4 w-4 mr-2" />
                    {startDate ? format(startDate, "PP") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={startDate} onSelect={handleStartDateChange} initialFocus />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Calendar className="h-4 w-4 mr-2" />
                    {endDate ? format(endDate, "PP") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={endDate} onSelect={handleEndDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={handleApplyFilters} className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              Apply
            </Button>

            <Button variant="outline" onClick={handleResetFilters} className="h-10">
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
