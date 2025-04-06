import { getCareProfessionals } from "@/lib/services/care-professional-service"
import { CareProfessionalTable } from "@/components/care-professionals/care-professional-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CareProfessionalsPage() {
  const professionals = await getCareProfessionals()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Care Professionals</h1>
          <p className="text-muted-foreground">Manage your care professionals, their credentials, and assignments</p>
        </div>
        <Button asChild>
          <Link href="/care-professionals/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Professional
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Care Professionals</h2>
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        <CareProfessionalTable professionals={professionals} />
      </div>
    </div>
  )
}

