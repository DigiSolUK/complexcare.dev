import { Suspense } from "react"
import { neon } from "@neondatabase/serverless"
import { DEFAULT_TENANT_ID } from "@/lib/constants"
import { AvailabilityCalendar } from "@/components/providers/availability-calendar"
import { TimeOffRequestsList } from "@/components/providers/time-off-requests-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

async function getProvider(id: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT id, first_name, last_name
      FROM users
      WHERE id = ${id}
      AND tenant_id = ${DEFAULT_TENANT_ID}
    `

    if (result.length === 0) {
      return null
    }

    return result[0]
  } catch (error) {
    console.error(`Error fetching provider with ID ${id}:`, error)
    return null
  }
}

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

export default async function ProviderAvailabilityPage({ params }: PageProps) {
  const [provider, providers] = await Promise.all([getProvider(params.id), getProviders()])

  if (!provider) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {provider.first_name} {provider.last_name}'s Availability
        </h1>
        <p className="text-muted-foreground">Manage availability and time off requests</p>
      </div>

      <Tabs defaultValue="availability" className="space-y-6">
        <TabsList>
          <TabsTrigger value="availability">Availability Calendar</TabsTrigger>
          <TabsTrigger value="time-off">Time Off Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <Suspense fallback={<div>Loading calendar...</div>}>
            <AvailabilityCalendar providers={providers} providerId={params.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="time-off">
          <Suspense fallback={<div>Loading time off requests...</div>}>
            <TimeOffRequestsList providers={providers} providerId={params.id} currentUserId="admin-user-id" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
