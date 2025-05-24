import { Suspense } from "react"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { AvailabilityCalendar } from "@/components/providers/availability-calendar"
import { TimeOffRequestsList } from "@/components/providers/time-off-requests-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function getProviders() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const providers = await sql`
      SELECT id, first_name, last_name
      FROM users
      WHERE tenant_id = ${DEFAULT_TENANT_ID}
      AND role IN ('doctor', 'nurse', 'therapist', 'admin')
      ORDER BY last_name, first_name
    `

    return providers
  } catch (error) {
    console.error("Error fetching providers:", error)
    return []
  }
}

export default async function ProviderAvailabilityPage() {
  const providers = await getProviders()

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Provider Availability</h1>
        <p className="text-muted-foreground">Manage provider availability and time off requests</p>
      </div>

      <Tabs defaultValue="availability" className="space-y-6">
        <TabsList>
          <TabsTrigger value="availability">Availability Calendar</TabsTrigger>
          <TabsTrigger value="time-off">Time Off Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <Suspense fallback={<div>Loading calendar...</div>}>
            <AvailabilityCalendar providers={providers} />
          </Suspense>
        </TabsContent>

        <TabsContent value="time-off">
          <Suspense fallback={<div>Loading time off requests...</div>}>
            <TimeOffRequestsList providers={providers} isAdmin={true} currentUserId="admin-user-id" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
