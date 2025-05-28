"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays, isBefore, isAfter } from "date-fns"
import { Calendar, Clock, Filter, Plus, Search, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import type { TaskPriority, TaskStatus, TaskRecurrence, Task } from "@/lib/services/enhanced-task-service"

// Mock data for initial development - will be replaced with API calls
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    tenant_id: "default",
    title: "Review patient medication plan",
    description: "Review and update medication plan for patient John Doe",
    status: "pending",
    priority: "high",
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    completion_date: null,
    assigned_to: "current-user",
    assigned_by: "admin",
    patient_id: "patient-123",
    care_professional_id: null,
    category: "medication",
    recurrence: "weekly",
    reminder_sent: false,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    tags: ["medication", "review"],
  },
  {
    id: "2",
    tenant_id: "default",
    title: "Schedule follow-up appointment",
    description: "Schedule a follow-up appointment for patient Sarah Smith",
    status: "in_progress",
    priority: "medium",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    completion_date: null,
    assigned_to: "current-user",
    assigned_by: "admin",
    patient_id: "patient-456",
    care_professional_id: null,
    category: "appointment",
    recurrence: "none",
    reminder_sent: false,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    tags: ["appointment", "follow-up"],
  },
  {
    id: "3",
    tenant_id: "default",
    title: "Complete care plan assessment",
    description: "Complete the quarterly care plan assessment for patient Michael Johnson",
    status: "completed",
    priority: "high",
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    completion_date: new Date(),
    assigned_to: "current-user",
    assigned_by: "admin",
    patient_id: "patient-789",
    care_professional_id: null,
    category: "assessment",
    recurrence: "none",
    reminder_sent: true,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    tags: ["assessment", "care-plan"],
  },
  {
    id: "4",
    tenant_id: "default",
    title: "Update patient contact information",
    description: "Verify and update contact information for patient Emily Wilson",
    status: "overdue",
    priority: "low",
    due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    completion_date: null,
    assigned_to: "current-user",
    assigned_by: "admin",
    patient_id: "patient-101",
    care_professional_id: null,
    category: "administrative",
    recurrence: "none",
    reminder_sent: true,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    tags: ["administrative", "contact-info"],
  },
  {
    id: "5",
    tenant_id: "default",
    title: "Review lab results",
    description: "Review latest lab results for patient Robert Brown",
    status: "pending",
    priority: "urgent",
    due_date: new Date(Date.now() + 1 * 60 * 60 * 1000),
    completion_date: null,
    assigned_to: "current-user",
    assigned_by: "admin",
    patient_id: "patient-202",
    care_professional_id: null,
    category: "clinical",
    recurrence: "none",
    reminder_sent: false,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    tags: ["clinical", "lab-results"],
  },
]

// Mock categories
const TASK_CATEGORIES = [
  { name: "medication", count: 12 },
  { name: "appointment", count: 8 },
  { name: "assessment", count: 5 },
  { name: "administrative", count: 7 },
  { name: "clinical", count: 10 },
]

// Mock statistics
const TASK_STATISTICS = {
  total: 42,
  pending: 15,
  completed: 20,
  overdue: 7,
  highPriority: 12,
  dueToday: 5,
  completionRate: 48,
}

interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  due_date: Date | null
  category: string
  recurrence: TaskRecurrence
  reminder_time: Date | null
  patient_id?: string
  care_professional_id?: string
  tags: string[]
}

export function EnhancedTaskManagement() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for tasks
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(MOCK_TASKS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [statistics, setStatistics] = useState(TASK_STATISTICS)
  const [categories, setCategories] = useState(TASK_CATEGORIES)

  // State for UI
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showFilterDialog, setShowFilterDialog] = useState(false)

  // State for filters
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([])
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [dateRangeFilter, setDateRangeFilter] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [tagFilter, setTagFilter] = useState<string[]>([])

  // State for form
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    due_date: null,
    category: "",
    recurrence: "none",
    reminder_time: null,
    tags: [],
  })
  const [newTag, setNewTag] = useState("")

  // Load tasks on component mount
  useEffect(() => {
    loadTasks()
  }, [])

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters()
  }, [tasks, activeTab, searchQuery, statusFilter, priorityFilter, categoryFilter, dateRangeFilter, tagFilter])

  // Load tasks from API
  const loadTasks = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would fetch from the API
      // const response = await fetch('/api/tasks')
      // const data = await response.json()
      // setTasks(data.tasks)
      // setStatistics(data.statistics)
      // setCategories(data.categories)

      // For now, we'll use mock data
      setTasks(MOCK_TASKS)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Apply filters to tasks
  const applyFilters = () => {
    let filtered = [...tasks]

    // Apply tab filter
    if (activeTab === "today") {
      filtered = filtered.filter((task) => {
        if (!task.due_date) return false
        const dueDate = new Date(task.due_date)
        const today = new Date()
        return (
          dueDate.getDate() === today.getDate() &&
          dueDate.getMonth() === today.getMonth() &&
          dueDate.getFullYear() === today.getFullYear()
        )
      })
    } else if (activeTab === "upcoming") {
      filtered = filtered.filter((task) => {
        if (!task.due_date) return false
        const dueDate = new Date(task.due_date)
        const today = new Date()
        const nextWeek = addDays(today, 7)
        return isAfter(dueDate, today) && isBefore(dueDate, nextWeek)
      })
    } else if (activeTab === "overdue") {
      filtered = filtered.filter(
        (task) =>
          task.status === "overdue" ||
          (task.due_date && isBefore(new Date(task.due_date), new Date()) && task.status !== "completed"),
      )
    } else if (activeTab === "completed") {
      filtered = filtered.filter((task) => task.status === "completed")
    } else if (activeTab === "high-priority") {
      filtered = filtered.filter((task) => task.priority === "high" || task.priority === "urgent")
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((task) => statusFilter.includes(task.status))
    }

    // Apply priority filter
    if (priorityFilter.length > 0) {
      filtered = filtered.filter((task) => priorityFilter.includes(task.priority))
    }

    // Apply category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter((task) => categoryFilter.includes(task.category))
    }

    // Apply date range filter
    if (dateRangeFilter.start || dateRangeFilter.end) {
      filtered = filtered.filter((task) => {
        if (!task.due_date) return false
        const dueDate = new Date(task.due_date)

        if (dateRangeFilter.start && dateRangeFilter.end) {
          return isAfter(dueDate, dateRangeFilter.start) && isBefore(dueDate, dateRangeFilter.end)
        } else if (dateRangeFilter.start) {
          return isAfter(dueDate, dateRangeFilter.start)
        } else if (dateRangeFilter.end) {
          return isBefore(dueDate, dateRangeFilter.end)
        }

        return true
      })
    }

    // Apply tag filter
    if (tagFilter.length > 0) {
      filtered = filtered.filter((task) => task.tags && task.tags.some((tag) => tagFilter.includes(tag)))
    }

    setFilteredTasks(filtered)
  }

  // Handle creating a new task
  const handleCreateTask = async () => {
    if (!formData.title || !formData.due_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real implementation, this would send to the API
      // const response = await fetch('/api/tasks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // const data = await response.json()

      // For now, we'll simulate adding to the local state
      const newTask: Task = {
        id: `new-${Date.now()}`,
        tenant_id: "default",
        title: formData.title,
        description: formData.description,
        status: "pending",
        priority: formData.priority,
        due_date: formData.due_date,
        completion_date: null,
        assigned_to: "current-user",
        assigned_by: "current-user",
        patient_id: formData.patient_id || null,
        care_professional_id: formData.care_professional_id || null,
        category: formData.category,
        recurrence: formData.recurrence,
        reminder_time: formData.reminder_time,
        reminder_sent: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        tags: formData.tags,
      }

      setTasks((prev) => [newTask, ...prev])

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: null,
        category: "",
        recurrence: "none",
        reminder_time: null,
        tags: [],
      })
      setShowCreateDialog(false)

      toast({
        title: "Success",
        description: "Task created successfully.",
      })
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle updating a task
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // In a real implementation, this would send to the API
      // const response = await fetch(`/api/tasks/${taskId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // })
      // const data = await response.json()

      // For now, we'll update the local state
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, ...updates, updated_at: new Date() } : task)),
      )

      toast({
        title: "Success",
        description: "Task updated successfully.",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle completing a task
  const handleCompleteTask = async (taskId: string) => {
    try {
      // In a real implementation, this would send to the API
      // const response = await fetch(`/api/tasks/${taskId}/complete`, {
      //   method: 'POST'
      // })
      // const data = await response.json()

      // For now, we'll update the local state
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: "completed",
                completion_date: new Date(),
                updated_at: new Date(),
              }
            : task,
        ),
      )

      toast({
        title: "Success",
        description: "Task marked as completed.",
      })
    } catch (error) {
      console.error("Error completing task:", error)
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      // In a real implementation, this would send to the API
      // const response = await fetch(`/api/tasks/${taskId}`, {
      //   method: 'DELETE'
      // })

      // For now, we'll update the local state
      setTasks((prev) => prev.filter((task) => task.id !== taskId))

      toast({
        title: "Success",
        description: "Task deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle adding a tag to the form
  const handleAddTag = () => {
    if (!newTag.trim()) return

    if (!formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
    }

    setNewTag("")
  }

  // Handle removing a tag from the form
  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter([])
    setPriorityFilter([])
    setCategoryFilter([])
    setDateRangeFilter({ start: null, end: null })
    setTagFilter([])
    setSearchQuery("")
    setShowFilterDialog(false)
  }

  // Get all unique tags from tasks
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    tasks.forEach((task) => {
      if (task.tags) {
        task.tags.forEach((tag) => tagSet.add(tag))
      }
    })
    return Array.from(tagSet)
  }, [tasks])

  // Get priority badge color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-green-100 text-green-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status badge color
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
          <p className="text-muted-foreground">Manage and track all your tasks and reminders in one place.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="outline" size="icon" onClick={() => setShowFilterDialog(true)}>
            <Filter className="h-4 w-4" />
          </Button>

          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Task Statistics */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Task Overview</CardTitle>
              <CardDescription>Summary of your tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tasks</span>
                  <span className="font-medium">{statistics.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium">{statistics.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">{statistics.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overdue</span>
                  <span className="font-medium text-red-600">{statistics.overdue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High Priority</span>
                  <span className="font-medium text-orange-600">{statistics.highPriority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Today</span>
                  <span className="font-medium text-blue-600">{statistics.dueToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">{statistics.completionRate}%</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Categories</h4>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category.name} className="flex justify-between text-sm">
                      <span className="capitalize">{category.name}</span>
                      <span className="text-muted-foreground">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="p-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  <TabsTrigger value="high-priority">Priority</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg">No tasks found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery ||
                    statusFilter.length ||
                    priorityFilter.length ||
                    categoryFilter.length ||
                    dateRangeFilter.start ||
                    dateRangeFilter.end ||
                    tagFilter.length
                      ? "Try adjusting your filters to see more tasks."
                      : "Create a new task to get started."}
                  </p>
                  {(searchQuery ||
                    statusFilter.length ||
                    priorityFilter.length ||
                    categoryFilter.length ||
                    dateRangeFilter.start ||
                    dateRangeFilter.end ||
                    tagFilter.length) && (
                    <Button variant="outline" className="mt-4" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedTask(task)
                        setShowViewDialog(true)
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={task.status === "completed"}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleCompleteTask(task.id)
                              } else {
                                handleUpdateTask(task.id, { status: "pending", completion_date: null })
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                          <div>
                            <h4
                              className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className={getStatusColor(task.status)}>
                                {task.status.replace("_", " ")}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              {task.category && <Badge variant="outline">{task.category}</Badge>}
                              {task.tags &&
                                task.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              {task.tags && task.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{task.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {task.due_date && (
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span
                                className={`${
                                  task.status !== "completed" &&
                                  task.due_date &&
                                  isBefore(new Date(task.due_date), new Date())
                                    ? "text-red-600 font-medium"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {format(new Date(task.due_date), "MMM d, yyyy")}
                              </span>
                            </div>
                          )}
                          {task.recurrence && task.recurrence !== "none" && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Repeats {task.recurrence}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task or reminder to your list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="clinical">Clinical</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.due_date ? format(formData.due_date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.due_date || undefined}
                      onSelect={(date) => setFormData({ ...formData, due_date: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="recurrence">Recurrence</Label>
                <Select
                  value={formData.recurrence}
                  onValueChange={(value) => setFormData({ ...formData, recurrence: value as TaskRecurrence })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Task Dialog */}
      {selectedTask && (
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <Badge variant="outline" className={getStatusColor(selectedTask.status)}>
                  {selectedTask.status.replace("_", " ")}
                </Badge>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
                {selectedTask.category && <Badge variant="outline">{selectedTask.category}</Badge>}
                {selectedTask.recurrence && selectedTask.recurrence !== "none" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Repeats {selectedTask.recurrence}
                  </Badge>
                )}
              </div>

              {selectedTask.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedTask.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedTask.due_date && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Due Date</h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(selectedTask.due_date), "PPP")}
                    </p>
                  </div>
                )}

                {selectedTask.completion_date && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Completed On</h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {format(new Date(selectedTask.completion_date), "PPP")}
                    </p>
                  </div>
                )}
              </div>

              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p>Created: {format(new Date(selectedTask.created_at), "PPP")}</p>
                </div>
                <div>
                  <p>Updated: {format(new Date(selectedTask.updated_at), "PPP")}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteTask(selectedTask.id)
                    setShowViewDialog(false)
                  }}
                >
                  Delete
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                {selectedTask.status !== "completed" ? (
                  <Button
                    onClick={() => {
                      handleCompleteTask(selectedTask.id)
                      setShowViewDialog(false)
                    }}
                  >
                    Mark Complete
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleUpdateTask(selectedTask.id, { status: "pending", completion_date: null })
                      setShowViewDialog(false)
                    }}
                  >
                    Reopen Task
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
            <DialogDescription>Apply filters to narrow down your task list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-2">
                {(["pending", "in_progress", "completed", "cancelled", "overdue"] as TaskStatus[]).map((status) => (
                  <Badge
                    key={status}
                    variant={statusFilter.includes(status) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (statusFilter.includes(status)) {
                        setStatusFilter(statusFilter.filter((s) => s !== status))
                      } else {
                        setStatusFilter([...statusFilter, status])
                      }
                    }}
                  >
                    {status.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {(["low", "medium", "high", "urgent"] as TaskPriority[]).map((priority) => (
                  <Badge
                    key={priority}
                    variant={priorityFilter.includes(priority) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (priorityFilter.includes(priority)) {
                        setPriorityFilter(priorityFilter.filter((p) => p !== priority))
                      } else {
                        setPriorityFilter([...priorityFilter, priority])
                      }
                    }}
                  >
                    {priority}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.name}
                    variant={categoryFilter.includes(category.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (categoryFilter.includes(category.name)) {
                        setCategoryFilter(categoryFilter.filter((c) => c !== category.name))
                      } else {
                        setCategoryFilter([...categoryFilter, category.name])
                      }
                    }}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal flex-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRangeFilter.start ? format(dateRangeFilter.start, "PPP") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateRangeFilter.start || undefined}
                      onSelect={(date) => setDateRangeFilter({ ...dateRangeFilter, start: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal flex-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRangeFilter.end ? format(dateRangeFilter.end, "PPP") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateRangeFilter.end || undefined}
                      onSelect={(date) => setDateRangeFilter({ ...dateRangeFilter, end: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={tagFilter.includes(tag) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (tagFilter.includes(tag)) {
                        setTagFilter(tagFilter.filter((t) => t !== tag))
                      } else {
                        setTagFilter([...tagFilter, tag])
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button onClick={() => setShowFilterDialog(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
