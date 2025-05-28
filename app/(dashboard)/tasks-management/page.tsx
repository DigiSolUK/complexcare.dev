import type { Metadata } from "next"
import { EnhancedTaskManagement } from "@/components/tasks/enhanced-task-management"

export const metadata: Metadata = {
  title: "Task Management | ComplexCare CRM",
  description: "Manage and track all your tasks and reminders in one place.",
}

export default function TaskManagementPage() {
  return (
    <div className="container mx-auto py-6">
      <EnhancedTaskManagement />
    </div>
  )
}
