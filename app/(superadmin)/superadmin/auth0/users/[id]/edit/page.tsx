import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getAuth0User } from "@/lib/actions/auth0-actions"
import { EditAuth0UserForm } from "@/components/superadmin/edit-auth0-user-form"

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  try {
    const user = await getAuth0User(params.id)

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/superadmin/auth0/users/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground">Update information for {user.email}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Edit user details and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <EditAuth0UserForm user={user} onSuccess={() => {}} />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error fetching user:", error)
    return notFound()
  }
}
