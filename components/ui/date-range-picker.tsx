"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DateRangePickerProps = {
  className?: string
  value: DateRange | undefined
  onChange: (date: DateRange | undefined) => void
}

export function DateRangePicker({ className, value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Predefined date ranges
  const predefinedRanges = {
    today: {
      label: "Today",
      range: {
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      },
    },
    yesterday: {
      label: "Yesterday",
      range: {
        from: startOfDay(addDays(new Date(), -1)),
        to: endOfDay(addDays(new Date(), -1)),
      },
    },
    last7Days: {
      label: "Last 7 Days",
      range: {
        from: startOfDay(addDays(new Date(), -6)),
        to: endOfDay(new Date()),
      },
    },
    last30Days: {
      label: "Last 30 Days",
      range: {
        from: startOfDay(addDays(new Date(), -29)),
        to: endOfDay(new Date()),
      },
    },
    thisWeek: {
      label: "This Week",
      range: {
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      },
    },
    thisMonth: {
      label: "This Month",
      range: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      },
    },
  }

  const handleRangeChange = (range: string) => {
    if (range === "custom") {
      return
    }

    const selectedRange = predefinedRanges[range as keyof typeof predefinedRanges]
    if (selectedRange) {
      onChange(selectedRange.range)
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Select onValueChange={handleRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7Days">Last 7 Days</SelectItem>
                <SelectItem value="last30Days">Last 30 Days</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
