"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { type Task, getTasksByAssignee } from "@/lib/services/task-service"

interface TasksListProps {
  tenantId?: string
  userId?: string
}

export function TasksList({ tenantId, userId }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTasks() {
      if (tenantId && userId) {
        try {
          const data = await getTasksByAssignee(tenantId, userId, 4)
          setTasks(data)
        } catch (error) {
          console.error("Error loading tasks:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Fallback to static data
        setTasks([
          {
            id: "1",
            tenant_id: "",
            title: "Review patient lab results",
            description: "Review latest blood work for John Doe",
            status: "completed",
            priority: "high",
            due_date: new Date().toISOString(),
            assigned_to: "",
            created_by: "",
            related_to_type: "patient",
            related_to_id: "P001",
            created_at: "",
            updated_at: "",
            completed_at: new Date().toISOString(),
            deleted_at: null,
          },
          {
            id: "2",
            tenant_id: "",
            title: "Schedule follow-up appointment",
            description: "Schedule follow-up for Jane Smith",
            status: "in_progress",
            priority: "medium",
            due_date: new Date().toISOString(),
            assigned_to: "",
            created_by: "",
            related_to_type: "patient",
            related_to_id: "P002",
            created_at: "",
            updated_at: "",
            completed_at: null,
            deleted_at: null,
          },
          {
            id: "3",
            tenant_id: "",
            title: "Update medication records",
            description: "Update medication list for Robert Johnson",
            status: "pending",
            priority: "high",
            due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            assigned_to: "",
            created_by: "",
            related_to_type: "patient",
            related_to_id: "P003",
            created_at: "",
            updated_at: "",
            completed_at: null,
            deleted_at: null,
          },
          {
            id: "4",
            tenant_id: "",
            title: "Complete patient assessment form",
            description: "Fill out assessment for new patient William Davis",
            status: "pending",
            priority: "low",
            due_date: new Date(Date.now() + 7 * 86400000).toISOString(), // Next week
            assigned_to: "",
            created_by: "",
            related_to_type: "patient",
            related_to_id: "P004",
            created_at: "",
            updated_at: "",
            completed_at: null,
            deleted_at: null,
          },
        ])
        setLoading(false)
      }
    }

    loadTasks()
  }, [tenantId, userId])

  if (loading) {
    return <div className="flex justify-center p-4">Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`
            flex items-center gap-4 rounded-lg border p-3 transition-all hover:bg-accent
            ${task.priority === "high" ? "border-l-4 border-l-red-500" : ""}
            ${task.priority === "medium" ? "border-l-4 border-l-yellow-500" : ""}
            ${task.priority === "low" ? "border-l-4 border-l-green-500" : ""}
          `}
        >
          <div>
            {task.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {task.status === "in_progress" && <Clock className="h-5 w-5 text-blue-500" />}
            {task.status === "pending" && <Circle className="h-5 w-5 text-gray-400" />}
          </div>
          <div className="flex-1 space-y-1">
            <p
              className={`font-medium leading-none ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </p>
            <div className="flex items-center text-xs">
              <span
                className={`
                rounded-full px-2 py-0.5 text-xs font-medium
                ${task.priority === "high" ? "bg-red-100 text-red-700" : ""}
                ${task.priority === "medium" ? "bg-yellow-100 text-yellow-700" : ""}
                ${task.priority === "low" ? "bg-green-100 text-green-700" : ""}
              `}
              >
                {task.priority}
              </span>
              <span className="ml-2 text-muted-foreground">Due: {new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

