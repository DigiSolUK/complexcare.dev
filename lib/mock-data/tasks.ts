export const mockTasks = [
  {
    id: "task-1",
    title: "Review patient medication",
    description: "Check for potential interactions and update records",
    status: "pending",
    priority: "high",
    due_date: new Date(Date.now() + 86400000).toISOString(),
    assigned_to: "user-1",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    tenant_id: "default",
  },
  {
    id: "task-2",
    title: "Schedule follow-up appointment",
    description: "Contact patient to arrange next visit",
    status: "in-progress",
    priority: "medium",
    due_date: new Date(Date.now() + 172800000).toISOString(),
    assigned_to: "user-2",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
    tenant_id: "default",
  },
  {
    id: "task-3",
    title: "Update care plan",
    description: "Incorporate new treatment recommendations",
    status: "completed",
    priority: "medium",
    due_date: new Date(Date.now() - 86400000).toISOString(),
    assigned_to: "user-1",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    tenant_id: "default",
  },
]

export function getMockTasks() {
  return [...mockTasks]
}

export function getMockTaskById(id: string) {
  return mockTasks.find((task) => task.id === id) || null
}
