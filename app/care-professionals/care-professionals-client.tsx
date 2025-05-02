"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionErrorBoundary, DataFetchErrorBoundary } from "@/components/error-boundaries"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"

interface CareProfessionalsClientProps {
  professionals: any[]
}

export default function CareProfessionalsClient({ professionals }: CareProfessionalsClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProfessionals = professionals.filter(
    (professional) =>
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const retryFetchProfessionals = async () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Care Professionals</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Professional
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search professionals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataFetchErrorBoundary resourceName="Care Professionals" onRetry={retryFetchProfessionals}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <SectionErrorBoundary key={professional.id} section={`Professional Card - ${professional.name}`}>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/care-professionals/${professional.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{professional.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Role</span>
                      <span className="font-medium">{professional.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Specialty</span>
                      <span className="font-medium">{professional.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span
                        className={`font-medium ${
                          professional.status === "Active" ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {professional.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SectionErrorBoundary>
          ))}
        </div>
      </DataFetchErrorBoundary>
    </div>
  )
}
