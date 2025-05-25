"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Plus,
  Search,
  Filter,
  CalendarIcon,
  Edit,
  Trash2,
  FileText,
  Activity,
  Scissors,
  Hospital,
  Syringe,
  Users,
  Coffee,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Hourglass,
} from "lucide-react"
import type {
  MedicalHistoryEntry,
  MedicalHistoryCategory,
  MedicalHistoryStatus,
  MedicalHistorySeverity,
  MedicalHistoryFilter,
} from "@/types/medical-history"

interface ComprehensiveMedicalHistoryProps {
  patientId: string
  tenantId: string
}

// Helper function to get icon for category
const getCategoryIcon = (category: MedicalHistoryCategory) => {
  switch (category) {
    case "CONDITION":
      return <Activity className="h-4 w-4" />
    case "SURGERY":
      return <Scissors className="h-4 w-4" />
    case "HOSPITALIZATION":
      return <Hospital className="h-4 w-4" />
    case "PROCEDURE":
      return <FileText className="h-4 w-4" />
    case "IMMUNIZATION":
      return <Syringe className="h-4 w-4" />
    case "FAMILY_HISTORY":
      return <Users className="h-4 w-4" />
    case "SOCIAL_HISTORY":
      return <Coffee className="h-4 w-4" />
    case "OTHER":
      return <HelpCircle className="h-4 w-4" />
    default:
      return <HelpCircle className="h-4 w-4" />
  }
}

// Helper function to get icon for status
const getStatusIcon = (status: MedicalHistoryStatus) => {
  switch (status) {
    case "ACTIVE":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "RESOLVED":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "RECURRING":
      return <RefreshCw className="h-4 w-4 text-blue-500" />
    case "IN_REMISSION":
      return <Hourglass className="h-4 w-4 text-purple-500" />
    case "CHRONIC":
      return <Clock className="h-4 w-4 text-red-500" />
    default:
      return <HelpCircle className="h-4 w-4" />
  }
}

// Helper function to get color for severity
const getSeverityColor = (severity?: MedicalHistorySeverity) => {
  switch (severity) {
    case "MILD":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "MODERATE":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "SEVERE":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
    case "LIFE_THREATENING":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export function ComprehensiveMedicalHistory({ patientId, tenantId }: ComprehensiveMedicalHistoryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for medical history entries
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  // State for filtering and view options
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "timeline" | "cards">("table")
  const [sortBy, setSortBy] = useState<"date" | "category" | "status" | "severity">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // State for filters
  const [filters, setFilters] = useState<MedicalHistoryFilter>({})

  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<MedicalHistoryEntry | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<MedicalHistoryEntry>>({
    category: "CONDITION",
    title: "",
    description: "",
    onsetDate: new Date(),
    status: "ACTIVE",
  })

  // Fetch medical history on component mount and when filters change
  useEffect(() => {
    fetchMedicalHistory()
    fetchMedicalHistoryStats()
  }, [patientId, filters])

  // Fetch medical history entries
  const fetchMedicalHistory = async () => {
    setLoading(true)
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()

      if (filters.category) queryParams.append("category", filters.category)
      if (filters.status) queryParams.append("status", filters.status)
      if (filters.severity) queryParams.append("severity", filters.severity)
      if (filters.startDate) queryParams.append("startDate", filters.startDate.toISOString())
      if (filters.endDate) queryParams.append("endDate", filters.endDate.toISOString())
      if (filters.searchTerm) queryParams.append("searchTerm", filters.searchTerm)

      const response = await fetch(`/api/patients/${patientId}/medical-history?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch medical history")
      }

      const data = await response.json()

      // Convert date strings to Date objects
      const formattedData = data.map((entry: any) => ({
        ...entry,
        onsetDate: new Date(entry.onset_date),
        endDate: entry.end_date ? new Date(entry.end_date) : undefined,
        createdAt: new Date(entry.created_at),
        updatedAt: new Date(entry.updated_at),
      }))

      setMedicalHistory(formattedData)
      setError(null)
    } catch (err) {
      console.error("Error fetching medical history:", err)
      setError("Failed to load medical history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch medical history statistics
  const fetchMedicalHistoryStats = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history/stats`)

      if (!response.ok) {
        throw new Error("Failed to fetch medical history statistics")
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Error fetching medical history statistics:", err)
    }
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle filter changes
  const handleFilterChange = (name: keyof MedicalHistoryFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    setSearchTerm("")
  }

  // Apply search term
  const applySearch = () => {
    setFilters((prev) => ({ ...prev, searchTerm }))
  }

  // Handle add form submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          patientId,
          tenantId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add medical history entry")
      }

      toast({
        title: "Success",
        description: "Medical history entry added successfully",
      })

      setIsAddDialogOpen(false)
      setFormData({
        category: "CONDITION",
        title: "",
        description: "",
        onsetDate: new Date(),
        status: "ACTIVE",
      })

      // Refresh data
      fetchMedicalHistory()
      fetchMedicalHistoryStats()
    } catch (error) {
      console.error("Error adding medical history entry:", error)
      toast({
        title: "Error",
        description: "Failed to add medical history entry",
        variant: "destructive",
      })
    }
  }

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentEntry) return

    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history/${currentEntry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update medical history entry")
      }

      toast({
        title: "Success",
        description: "Medical history entry updated successfully",
      })

      setIsEditDialogOpen(false)
      setCurrentEntry(null)

      // Refresh data
      fetchMedicalHistory()
      fetchMedicalHistoryStats()
    } catch (error) {
      console.error("Error updating medical history entry:", error)
      toast({
        title: "Error",
        description: "Failed to update medical history entry",
        variant: "destructive",
      })
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!currentEntry) return

    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history/${currentEntry.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete medical history entry")
      }

      toast({
        title: "Success",
        description: "Medical history entry deleted successfully",
      })

      setIsDeleteDialogOpen(false)
      setCurrentEntry(null)

      // Refresh data
      fetchMedicalHistory()
      fetchMedicalHistoryStats()
    } catch (error) {
      console.error("Error deleting medical history entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete medical history entry",
        variant: "destructive",
      })
    }
  }

  // Open edit dialog
  const openEditDialog = (entry: MedicalHistoryEntry) => {
    setCurrentEntry(entry)
    setFormData({
      category: entry.category,
      title: entry.title,
      description: entry.description,
      onsetDate: entry.onsetDate,
      endDate: entry.endDate,
      status: entry.status,
      severity: entry.severity,
      provider: entry.provider,
      location: entry.location,
      notes: entry.notes,
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (entry: MedicalHistoryEntry) => {
    setCurrentEntry(entry)
    setIsDeleteDialogOpen(true)
  }

  // Open view dialog
  const openViewDialog = (entry: MedicalHistoryEntry) => {
    setCurrentEntry(entry)
    setIsViewDialogOpen(true)
  }

  // Filter and sort medical history entries
  const filteredAndSortedEntries = useMemo(() => {
    let result = [...medicalHistory]

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter((entry) => entry.category === activeTab)
    }

    // Sort entries
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortDirection === "asc"
          ? a.onsetDate.getTime() - b.onsetDate.getTime()
          : b.onsetDate.getTime() - a.onsetDate.getTime()
      } else if (sortBy === "category") {
        return sortDirection === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
      } else if (sortBy === "status") {
        return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
      } else if (sortBy === "severity") {
        // Handle null severity values
        if (!a.severity && !b.severity) return 0
        if (!a.severity) return sortDirection === "asc" ? -1 : 1
        if (!b.severity) return sortDirection === "asc" ? 1 : -1

        return sortDirection === "asc" ? a.severity.localeCompare(b.severity) : b.severity.localeCompare(a.severity)
      }

      return 0
    })

    return result
  }, [medicalHistory, activeTab, sortBy, sortDirection])

  // Group entries by year for timeline view
  const entriesByYear = useMemo(() => {
    const grouped: Record<string, MedicalHistoryEntry[]> = {}

    filteredAndSortedEntries.forEach((entry) => {
      const year = entry.onsetDate.getFullYear().toString()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(entry)
    })

    // Sort years in descending order
    return Object.keys(grouped)
      .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
      .map((year) => ({
        year,
        entries: grouped[year],
      }))
  }, [filteredAndSortedEntries])

  // Render category badge
  const renderCategoryBadge = (category: MedicalHistoryCategory) => {
    let bgColor = "bg-gray-100"
    let textColor = "text-gray-800"

    switch (category) {
      case "CONDITION":
        bgColor = "bg-blue-100"
        textColor = "text-blue-800"
        break
      case "SURGERY":
        bgColor = "bg-purple-100"
        textColor = "text-purple-800"
        break
      case "HOSPITALIZATION":
        bgColor = "bg-red-100"
        textColor = "text-red-800"
        break
      case "PROCEDURE":
        bgColor = "bg-green-100"
        textColor = "text-green-800"
        break
      case "IMMUNIZATION":
        bgColor = "bg-teal-100"
        textColor = "text-teal-800"
        break
      case "FAMILY_HISTORY":
        bgColor = "bg-orange-100"
        textColor = "text-orange-800"
        break
      case "SOCIAL_HISTORY":
        bgColor = "bg-yellow-100"
        textColor = "text-yellow-800"
        break
    }

    return (
      <div
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {getCategoryIcon(category)}
        <span className="ml-1">{category.replace("_", " ")}</span>
      </div>
    )
  }

  // Render status badge
  const renderStatusBadge = (status: MedicalHistoryStatus) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default"

    switch (status) {
      case "ACTIVE":
        variant = "default"
        break
      case "RESOLVED":
        variant = "outline"
        break
      case "RECURRING":
        variant = "secondary"
        break
      case "IN_REMISSION":
        variant = "outline"
        break
      case "CHRONIC":
        variant = "destructive"
        break
    }

    return (
      <Badge variant={variant} className="ml-2">
        {getStatusIcon(status)}
        <span className="ml-1">{status.replace("_", " ")}</span>
      </Badge>
    )
  }

  // Render severity badge
  const renderSeverityBadge = (severity?: MedicalHistorySeverity) => {
    if (!severity) return null

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(severity)}`}
      >
        {severity}
      </span>
    )
  }

  // Render table view
  const renderTableView = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">
              <Button
                variant="ghost"
                className="p-0 h-auto font-medium"
                onClick={() => {
                  if (sortBy === "category") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  } else {
                    setSortBy("category")
                    setSortDirection("asc")
                  }
                }}
              >
                Category
                {sortBy === "category" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 h-auto font-medium text-left">
                Title
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-medium"
                onClick={() => {
                  if (sortBy === "date") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  } else {
                    setSortBy("date")
                    setSortDirection("desc")
                  }
                }}
              >
                Date
                {sortBy === "date" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-medium"
                onClick={() => {
                  if (sortBy === "status") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  } else {
                    setSortBy("status")
                    setSortDirection("asc")
                  }
                }}
              >
                Status
                {sortBy === "status" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-auto font-medium"
                onClick={() => {
                  if (sortBy === "severity") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  } else {
                    setSortBy("severity")
                    setSortDirection("asc")
                  }
                }}
              >
                Severity
                {sortBy === "severity" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No medical history entries found
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{renderCategoryBadge(entry.category)}</TableCell>
                <TableCell className="font-medium">{entry.title}</TableCell>
                <TableCell>
                  {format(entry.onsetDate, "dd MMM yyyy")}
                  {entry.endDate && (
                    <span className="text-muted-foreground"> to {format(entry.endDate, "dd MMM yyyy")}</span>
                  )}
                </TableCell>
                <TableCell>{renderStatusBadge(entry.status)}</TableCell>
                <TableCell>{entry.severity ? renderSeverityBadge(entry.severity) : "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openViewDialog(entry)}>
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(entry)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(entry)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  }

  // Render timeline view
  const renderTimelineView = () => {
    if (filteredAndSortedEntries.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No medical history entries found</div>
    }

    return (
      <div className="space-y-8 mt-4">
        {entriesByYear.map(({ year, entries }) => (
          <div key={year} className="relative">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 py-2">
              <h3 className="text-lg font-semibold">{year}</h3>
            </div>
            <div className="ml-4 mt-2 border-l-2 border-gray-200 dark:border-gray-800 pl-6 space-y-6">
              {entries.map((entry) => (
                <div key={entry.id} className="relative">
                  <div className="absolute -left-[33px] mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground">
                            {format(entry.onsetDate, "dd MMM yyyy")}
                          </span>
                          {entry.endDate && (
                            <span className="text-sm text-muted-foreground ml-2">
                              to {format(entry.endDate, "dd MMM yyyy")}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-medium mt-1 flex items-center">
                          {entry.title}
                          {renderStatusBadge(entry.status)}
                          {entry.severity && <span className="ml-2">{renderSeverityBadge(entry.severity)}</span>}
                        </h4>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => openViewDialog(entry)}>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(entry)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(entry)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderCategoryBadge(entry.category)}
                      {entry.provider && (
                        <span className="text-sm text-muted-foreground">Provider: {entry.provider}</span>
                      )}
                      {entry.location && (
                        <span className="text-sm text-muted-foreground">Location: {entry.location}</span>
                      )}
                    </div>
                    {entry.description && <p className="text-sm text-muted-foreground">{entry.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Render cards view
  const renderCardsView = () => {
    if (filteredAndSortedEntries.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No medical history entries found</div>
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredAndSortedEntries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">{entry.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    {format(entry.onsetDate, "dd MMM yyyy")}
                    {entry.endDate && <span> to {format(entry.endDate, "dd MMM yyyy")}</span>}
                  </CardDescription>
                </div>
                <div className="flex">
                  {renderStatusBadge(entry.status)}
                  {entry.severity && <span className="ml-1">{renderSeverityBadge(entry.severity)}</span>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center mb-2">{renderCategoryBadge(entry.category)}</div>
              {entry.description && <p className="text-sm text-muted-foreground line-clamp-2">{entry.description}</p>}
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                {entry.provider && <span>Provider: {entry.provider}</span>}
                {entry.location && <span>Location: {entry.location}</span>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => openViewDialog(entry)}>
                  <FileText className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(entry)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(entry)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Render statistics
  const renderStats = () => {
    if (!stats) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus?.ACTIVE || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chronic Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus?.CHRONIC || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus?.RESOLVED || 0}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Loading medical history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/15 p-4 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-destructive">Error</h3>
              <p className="text-destructive/90 text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchMedicalHistory}>
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Medical History</CardTitle>
            <CardDescription>Comprehensive medical history for this patient</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                Table
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                Cards
              </Button>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Medical History Entry</DialogTitle>
                  <DialogDescription>Add a new entry to the patient's medical history record.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category as string}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CONDITION">Condition</SelectItem>
                          <SelectItem value="SURGERY">Surgery</SelectItem>
                          <SelectItem value="HOSPITALIZATION">Hospitalization</SelectItem>
                          <SelectItem value="PROCEDURE">Procedure</SelectItem>
                          <SelectItem value="IMMUNIZATION">Immunization</SelectItem>
                          <SelectItem value="FAMILY_HISTORY">Family History</SelectItem>
                          <SelectItem value="SOCIAL_HISTORY">Social History</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" value={formData.title || ""} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="onsetDate">Onset Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.onsetDate ? format(formData.onsetDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.onsetDate}
                            onSelect={(date) => handleDateChange("onsetDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? format(formData.endDate, "PPP") : "Select date (optional)"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => handleDateChange("endDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status as string}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="RECURRING">Recurring</SelectItem>
                          <SelectItem value="IN_REMISSION">In Remission</SelectItem>
                          <SelectItem value="CHRONIC">Chronic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity</Label>
                      <Select
                        value={(formData.severity as string) || ""}
                        onValueChange={(value) => handleSelectChange("severity", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">None</SelectItem>
                          <SelectItem value="MILD">Mild</SelectItem>
                          <SelectItem value="MODERATE">Moderate</SelectItem>
                          <SelectItem value="SEVERE">Severe</SelectItem>
                          <SelectItem value="LIFE_THREATENING">Life Threatening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider</Label>
                      <Input
                        id="provider"
                        name="provider"
                        value={formData.provider || ""}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Optional"
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Entry</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics */}
        {renderStats()}

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search medical history..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applySearch()
                }
              }}
            />
          </div>
          <Button variant="outline" onClick={applySearch}>
            Search
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {Object.keys(filters).length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
          {Object.keys(filters).length > 0 && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-category">Category</Label>
                  <Select
                    value={filters.category || ""}
                    onValueChange={(value) => handleFilterChange("category", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All categories</SelectItem>
                      <SelectItem value="CONDITION">Condition</SelectItem>
                      <SelectItem value="SURGERY">Surgery</SelectItem>
                      <SelectItem value="HOSPITALIZATION">Hospitalization</SelectItem>
                      <SelectItem value="PROCEDURE">Procedure</SelectItem>
                      <SelectItem value="IMMUNIZATION">Immunization</SelectItem>
                      <SelectItem value="FAMILY_HISTORY">Family History</SelectItem>
                      <SelectItem value="SOCIAL_HISTORY">Social History</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-status">Status</Label>
                  <Select
                    value={filters.status || ""}
                    onValueChange={(value) => handleFilterChange("status", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All statuses</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="RECURRING">Recurring</SelectItem>
                      <SelectItem value="IN_REMISSION">In Remission</SelectItem>
                      <SelectItem value="CHRONIC">Chronic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-severity">Severity</Label>
                  <Select
                    value={filters.severity || ""}
                    onValueChange={(value) => handleFilterChange("severity", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All severities</SelectItem>
                      <SelectItem value="MILD">Mild</SelectItem>
                      <SelectItem value="MODERATE">Moderate</SelectItem>
                      <SelectItem value="SEVERE">Severe</SelectItem>
                      <SelectItem value="LIFE_THREATENING">Life Threatening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate ? format(filters.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) => handleFilterChange("startDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate ? format(filters.endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) => handleFilterChange("endDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="all" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="CONDITION" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Conditions
            </TabsTrigger>
            <TabsTrigger value="SURGERY" className="flex items-center">
              <Scissors className="h-4 w-4 mr-2" />
              Surgeries
            </TabsTrigger>
            <TabsTrigger value="HOSPITALIZATION" className="flex items-center">
              <Hospital className="h-4 w-4 mr-2" />
              Hospitalizations
            </TabsTrigger>
            <TabsTrigger value="PROCEDURE" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Procedures
            </TabsTrigger>
            <TabsTrigger value="IMMUNIZATION" className="flex items-center">
              <Syringe className="h-4 w-4 mr-2" />
              Immunizations
            </TabsTrigger>
            <TabsTrigger value="FAMILY_HISTORY" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Family History
            </TabsTrigger>
            <TabsTrigger value="SOCIAL_HISTORY" className="flex items-center">
              <Coffee className="h-4 w-4 mr-2" />
              Social History
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {viewMode === "table" && renderTableView()}
            {viewMode === "timeline" && renderTimelineView()}
            {viewMode === "cards" && renderCardsView()}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Medical History Entry</DialogTitle>
            <DialogDescription>Update the details of this medical history entry.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category as string}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONDITION">Condition</SelectItem>
                    <SelectItem value="SURGERY">Surgery</SelectItem>
                    <SelectItem value="HOSPITALIZATION">Hospitalization</SelectItem>
                    <SelectItem value="PROCEDURE">Procedure</SelectItem>
                    <SelectItem value="IMMUNIZATION">Immunization</SelectItem>
                    <SelectItem value="FAMILY_HISTORY">Family History</SelectItem>
                    <SelectItem value="SOCIAL_HISTORY">Social History</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" name="title" value={formData.title || ""} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-onsetDate">Onset Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.onsetDate ? format(formData.onsetDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.onsetDate}
                      onSelect={(date) => handleDateChange("onsetDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Select date (optional)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleDateChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status as string}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="RECURRING">Recurring</SelectItem>
                    <SelectItem value="IN_REMISSION">In Remission</SelectItem>
                    <SelectItem value="CHRONIC">Chronic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-severity">Severity</Label>
                <Select
                  value={(formData.severity as string) || ""}
                  onValueChange={(value) => handleSelectChange("severity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="MILD">Mild</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="SEVERE">Severe</SelectItem>
                    <SelectItem value="LIFE_THREATENING">Life Threatening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-provider">Provider</Label>
                <Input
                  id="edit-provider"
                  name="provider"
                  value={formData.provider || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={2}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Optional"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentEntry?.title}
              {currentEntry?.status && renderStatusBadge(currentEntry.status)}
            </DialogTitle>
            <DialogDescription>
              {currentEntry?.category && renderCategoryBadge(currentEntry.category)}
              {currentEntry?.severity && <span className="ml-2">{renderSeverityBadge(currentEntry.severity)}</span>}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Onset Date</h4>
                <p>{currentEntry?.onsetDate ? format(currentEntry.onsetDate, "PPP") : "N/A"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">End Date</h4>
                <p>{currentEntry?.endDate ? format(currentEntry.endDate, "PPP") : "N/A"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Provider</h4>
                <p>{currentEntry?.provider || "N/A"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Location</h4>
                <p>{currentEntry?.location || "N/A"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm">{currentEntry?.description || "No description provided."}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Notes</h4>
              <p className="text-sm whitespace-pre-line">{currentEntry?.notes || "No notes provided."}</p>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <div>
                  Created: {currentEntry?.createdAt ? format(currentEntry.createdAt, "PPP") : "N/A"}
                  {currentEntry?.createdBy && ` by ${currentEntry.createdBy}`}
                </div>
                <div>
                  {currentEntry?.updatedAt &&
                    currentEntry?.updatedAt.getTime() !== currentEntry?.createdAt.getTime() && (
                      <>
                        Updated: {format(currentEntry.updatedAt, "PPP")}
                        {currentEntry?.updatedBy && ` by ${currentEntry.updatedBy}`}
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewDialogOpen(false)
                if (currentEntry) {
                  openEditDialog(currentEntry)
                }
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medical history entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            {currentEntry && (
              <div className="space-y-2">
                <p>
                  <strong>Title:</strong> {currentEntry.title}
                </p>
                <p>
                  <strong>Category:</strong> {currentEntry.category.replace("_", " ")}
                </p>
                <p>
                  <strong>Date:</strong> {format(currentEntry.onsetDate, "dd MMM yyyy")}
                </p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
