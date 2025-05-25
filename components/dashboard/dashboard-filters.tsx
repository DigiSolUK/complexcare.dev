"use client"
import { X, ChevronDown } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export type FilterOption = {
  id: string
  label: string
  options: {
    value: string
    label: string
  }[]
}

export type FilterState = {
  dateRange: DateRange | undefined
  filters: Record<string, string[]>
}

export type DashboardFiltersProps = {
  filterOptions: FilterOption[]
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function DashboardFilters({ filterOptions, filters, onChange }: DashboardFiltersProps) {
  // Handle date range change
  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    onChange({
      ...filters,
      dateRange,
    })
  }

  // Handle filter change
  const handleFilterChange = (filterId: string, value: string, checked: boolean) => {
    const currentValues = filters.filters[filterId] || []
    const newValues = checked ? [...currentValues, value] : currentValues.filter((v) => v !== value)

    onChange({
      ...filters,
      filters: {
        ...filters.filters,
        [filterId]: newValues,
      },
    })
  }

  // Clear all filters
  const clearAllFilters = () => {
    onChange({
      dateRange: undefined,
      filters: {},
    })
  }

  // Clear specific filter
  const clearFilter = (filterId: string) => {
    const newFilters = { ...filters.filters }
    delete newFilters[filterId]

    onChange({
      ...filters,
      filters: newFilters,
    })
  }

  // Clear date range
  const clearDateRange = () => {
    onChange({
      ...filters,
      dateRange: undefined,
    })
  }

  // Count active filters
  const activeFilterCount = Object.values(filters.filters).reduce((count, values) => count + values.length, 0)

  // Get filter label by value
  const getFilterLabel = (filterId: string, value: string) => {
    const filter = filterOptions.find((f) => f.id === filterId)
    const option = filter?.options.find((o) => o.value === value)
    return option?.label || value
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <DateRangePicker value={filters.dateRange} onChange={handleDateRangeChange} />

          {filterOptions.map((filter) => (
            <DropdownMenu key={filter.id}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  {filter.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filter.options.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={(filters.filters[filter.id] || []).includes(option.value)}
                    onCheckedChange={(checked) => handleFilterChange(filter.id, option.value, checked)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          {(activeFilterCount > 0 || filters.dateRange) && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9 px-2 lg:px-3">
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active filters */}
      {(activeFilterCount > 0 || filters.dateRange) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.dateRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>
                {format(filters.dateRange.from!, "MMM d, yyyy")} -
                {filters.dateRange.to ? format(filters.dateRange.to, " MMM d, yyyy") : " Present"}
              </span>
              <button onClick={clearDateRange} className="ml-1 rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {Object.entries(filters.filters).map(([filterId, values]) =>
            values.map((value) => (
              <Badge key={`${filterId}-${value}`} variant="secondary" className="flex items-center gap-1">
                <span>{getFilterLabel(filterId, value)}</span>
                <button onClick={() => handleFilterChange(filterId, value, false)} className="ml-1 rounded-full">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )),
          )}
        </div>
      )}
    </div>
  )
}
