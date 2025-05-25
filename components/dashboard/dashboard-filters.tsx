"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FilterState } from "./dashboard-context"

export interface FilterOption {
  id: string
  label: string
  options: {
    value: string
    label: string
  }[]
}

interface DashboardFiltersProps {
  filterOptions: FilterOption[]
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function DashboardFilters({ filterOptions, filters, onChange }: DashboardFiltersProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    onChange({
      ...filters,
      dateRange: range || { from: undefined, to: undefined },
    })
  }

  // Handle filter selection
  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId)
    setSelectedValue(null)
  }

  // Handle filter value selection
  const handleValueSelect = (value: string) => {
    if (selectedFilter) {
      setSelectedValue(value)
    }
  }

  // Add filter
  const handleAddFilter = () => {
    if (selectedFilter && selectedValue) {
      const currentFilters = { ...filters.filters }

      if (!currentFilters[selectedFilter]) {
        currentFilters[selectedFilter] = []
      }

      if (!currentFilters[selectedFilter].includes(selectedValue)) {
        currentFilters[selectedFilter] = [...currentFilters[selectedFilter], selectedValue]
      }

      onChange({
        ...filters,
        filters: currentFilters,
      })

      setSelectedFilter(null)
      setSelectedValue(null)
    }
  }

  // Remove filter
  const handleRemoveFilter = (filterId: string, value: string) => {
    const currentFilters = { ...filters.filters }

    if (currentFilters[filterId]) {
      currentFilters[filterId] = currentFilters[filterId].filter((v) => v !== value)

      if (currentFilters[filterId].length === 0) {
        delete currentFilters[filterId]
      }

      onChange({
        ...filters,
        filters: currentFilters,
      })
    }
  }

  // Get filter label by ID
  const getFilterLabel = (filterId: string) => {
    const filter = filterOptions.find((f) => f.id === filterId)
    return filter ? filter.label : filterId
  }

  // Get value label by filter ID and value
  const getValueLabel = (filterId: string, value: string) => {
    const filter = filterOptions.find((f) => f.id === filterId)
    if (filter) {
      const option = filter.options.find((o) => o.value === value)
      return option ? option.label : value
    }
    return value
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <DateRangePicker value={filters.dateRange} onChange={handleDateRangeChange} className="w-full md:w-auto" />

        <div className="flex flex-1 gap-2">
          <Select value={selectedFilter || ""} onValueChange={handleFilterSelect}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filters</SelectLabel>
                {filterOptions.map((filter) => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedFilter && (
            <Select value={selectedValue || ""} onValueChange={handleValueSelect} disabled={!selectedFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Values</SelectLabel>
                  {filterOptions
                    .find((f) => f.id === selectedFilter)
                    ?.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Button
            variant="outline"
            onClick={handleAddFilter}
            disabled={!selectedFilter || !selectedValue}
            className="whitespace-nowrap"
          >
            Add Filter
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {Object.keys(filters.filters).length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(filters.filters).map(([filterId, values]) =>
            values.map((value) => (
              <Badge key={`${filterId}-${value}`} variant="outline" className="flex items-center gap-1">
                <span className="font-medium">{getFilterLabel(filterId)}:</span> {getValueLabel(filterId, value)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => handleRemoveFilter(filterId, value)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              </Badge>
            )),
          )}

          {Object.keys(filters.filters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => onChange({ ...filters, filters: {} })}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
