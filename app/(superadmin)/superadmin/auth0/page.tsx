import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Auth0UserTable } from "@/components/superadmin/auth0-user-table"
import { Auth0Logs } from "@/components/superadmin/auth0-logs"
import { getAuth0Users, getAuth0Roles, getAuth0Logs } from "@/lib/actions/auth0-actions"

export const metadata: Metadata = {
  title: "Auth0 Management",
  description: "Manage Auth0 users, roles, and logs",
}

interface Auth0PageProps {
  searchParams: {
    page?: string
    query?: string
    tab?: string
  }
}

export default async function Auth0ManagementPage({ searchParams }: Auth0PageProps) {
  const page = Number.parseInt(searchParams.page || "1", 10)
  const query = searchParams.query || ""
  const tab = searchParams.tab || "users"
  const perPage = 10

  // Fetch users
  const usersResponse = await getAuth0Users(page - 1, perPage, query)
  const users = usersResponse.users || []
  const totalUsers = usersResponse.total || 0

  // Fetch roles
  const roles = await getAuth0Roles()

  // Create a map of user roles
  const userRoles: Record<string, string[]> = {}
  for (const user of users) {
    // In a real implementation, you would fetch roles for each user
    // This is a placeholder
    userRoles[user.user_id] = []
  }

  // Fetch logs if on logs tab
  const logsResponse = tab === "logs" ? await getAuth0Logs(page - 1, perPage) : { logs: [], total: 0 }

  const logs = logsResponse.logs || []
  const totalLogs = logsResponse.total || 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auth0 Management</h1>
          <p className="text-muted-foreground">Manage Auth0 users, roles, and logs</p>
        </div>
      </div>

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Auth0UserTable
            initialUsers={users}
            totalUsers={totalUsers}
            roles={roles}
            userRoles={userRoles}
            page={page}
            perPage={perPage}
          />
        </TabsContent>
        <TabsContent value="logs">
          <Auth0Logs initialLogs={logs} totalLogs={totalLogs} page={page} perPage={perPage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
