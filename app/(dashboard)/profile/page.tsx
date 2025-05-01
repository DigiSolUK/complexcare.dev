import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  // Demo user data
  const demoUser = {
    name: "Demo User",
    email: "demo@complexcare.dev",
    picture: "/placeholder.svg?height=200&width=200",
    role: "Demo Admin",
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-800">
        <p className="font-medium">Demo Mode</p>
        <p className="text-sm">This is a demo site with no authentication required.</p>
      </div>
      <UserProfile user={demoUser} />
    </div>
  )
}
