import { useTenant } from "@/contexts"

const TasksPage = () => {
  const { tenantId } = useTenant()

  return (
    <div>
      <h1>Tasks for Tenant: {tenantId}</h1>
      {/* Add your task management UI here */}
    </div>
  )
}

export default TasksPage
