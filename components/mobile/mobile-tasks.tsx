"use client"

import { useState } from "react"
import { Check, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MobileTasks() {
  const [activeTab, setActiveTab] = useState("today")

  // Sample task data
  const tasks = {
    today: [
      { id: "1", task: "Review medication changes for John Smith", priority: "high", completed: false },
      { id: "2", task: "Complete assessment form for Sarah Johnson", priority: "medium", completed: false },
      { id: "3", task: "Follow up on test results for Michael Brown", priority: "high", completed: false },
      { id: "4", task: "Update care plan for Emma Wilson", priority: "low", completed: true },
    ],
    upcoming: [
      { id: "5", task: "Prepare for team meeting", priority: "medium", completed: false },
      { id: "6", task: "Review new referrals", priority: "medium", completed: false },
      { id: "7", task: "Complete monthly reports", priority: "high", completed: false },
    ],
    completed: [
      { id: "8", task: "Call pharmacy about prescription", priority: "medium", completed: true },
      { id: "9", task: "Schedule follow-up appointment for David Lee", priority: "low", completed: true },
      { id: "10", task: "Submit timesheet", priority: "medium", completed: true },
    ],
  }

  const [taskState, setTaskState] = useState(tasks)

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = { ...taskState }

    // Find which list contains the task
    let foundIn: "today" | "upcoming" | "completed" | null = null

    for (const list of ["today", "upcoming", "completed"] as const) {
      const taskIndex = updatedTasks[list].findIndex((t) => t.id === taskId)
      if (taskIndex !== -1) {
        foundIn = list
        updatedTasks[list][taskIndex].completed = !updatedTasks[list][taskIndex].completed
        break
      }
    }

    setTaskState(updatedTasks)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today" onClick={() => setActiveTab("today")}>
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" onClick={() => setActiveTab("upcoming")}>
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setActiveTab("completed")}>
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-3">
          {taskState.today
            .sort((a, b) => {
              if (a.completed === b.completed) {
                const priorityOrder = { high: 0, medium: 1, low: 2 }
                return (
                  priorityOrder[a.priority as keyof typeof priorityOrder] -
                  priorityOrder[b.priority as keyof typeof priorityOrder]
                )
              }
              return a.completed ? 1 : -1
            })
            .map((task) => (
              <TaskCard key={task.id} task={task} onToggleComplete={() => toggleTaskCompletion(task.id)} />
            ))}

          {taskState.today.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No tasks for today</div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3">
          {taskState.upcoming.map((task) => (
            <TaskCard key={task.id} task={task} onToggleComplete={() => toggleTaskCompletion(task.id)} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {taskState.completed.map((task) => (
            <TaskCard key={task.id} task={task} onToggleComplete={() => toggleTaskCompletion(task.id)} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TaskCardProps {
  task: {
    id: string
    task: string
    priority: string
    completed: boolean
  }
  onToggleComplete: () => void
}

function TaskCard({ task, onToggleComplete }: TaskCardProps) {
  const priorityColors = {
    high: "bg-destructive",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
  }

  return (
    <Card className={task.completed ? "opacity-60" : ""}>
      <CardContent className="p-3 flex items-start space-x-3">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full flex-shrink-0 mt-0.5"
          onClick={onToggleComplete}
        >
          {task.completed && <Check className="h-3 w-3" />}
        </Button>

        <div className="flex-1">
          <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.task}</div>

          <div className="flex items-center mt-1">
            <div
              className={`h-2 w-2 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]} mr-1.5`}
            />
            <span className="text-xs text-muted-foreground capitalize">{task.priority} priority</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
