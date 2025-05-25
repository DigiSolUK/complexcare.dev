"use client"

import { useState } from "react"
import { Search, Filter, Calendar, User, FolderOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { ClinicalNoteCategory } from "@/lib/services/clinical-notes-service"

interface ClinicalNotesSearchProps {
  categories: ClinicalNoteCategory[]
  careProfessionals: any[]
  onSearch: (filters: any) => void
}

export default function ClinicalNotesSearch({ categories, careProfessionals, onSearch }: ClinicalNotesSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [careProfessionalId, setCareProfessionalId] = useState<string>("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch({
      searchTerm,
      categoryId: categoryId || undefined,
      careProfessionalId: careProfessionalId || undefined,
      startDate: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      endDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    })
  }

  const handleReset = () => {
    setSearchTerm("")
    setCategoryId("")
    setCareProfessionalId("")
    setDateRange({ from: undefined, to: undefined })
    onSearch({})
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clinical notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(showFilters && "bg-accent")}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Category
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        {category.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Care Professional
              </label>
              <Select value={careProfessionalId} onValueChange={setCareProfessionalId}>
                <SelectTrigger>
                  <SelectValue placeholder="All professionals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All professionals</SelectItem>
                  {careProfessionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.first_name} {professional.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span className="text-muted-foreground">Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
            <Button onClick={handleSearch}>Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  )
}
