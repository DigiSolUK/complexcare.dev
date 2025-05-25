import type { Metadata } from "next"
import { CreateAuth0UserForm } from "@/components/superadmin/create-auth0-user-form"
import { getAuth0Connections } from "@/lib/actions/auth0-actions"

export const metadata: Metadata = {
  title: "Create Auth0 User",
  description: "Create a new Auth0 user",
}

export default async function CreateAuth0UserPage() {
  // Fetch Auth0 connections
  const connections = await getAuth0Connections()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Auth0 User</h1>
          <p className="text-muted-foreground">Create a new user in Auth0</p>
        </div>
      </div>

      <CreateAuth0UserForm connections={connections} />
    </div>
  )
}
