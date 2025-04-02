"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CareProfessionalsTable } from "@/components/care-professionals/care-professionals-table"
import { CreateCareProfessionalDialog } from "@/components/care-professionals/create-care-professional-dialog"
import { CredentialsSummary } from "@/components/care-professionals/credentials-summary"
import { CareProfessionalStats } from "@/components/care-professionals/care-professional-stats"
import { Plus, Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { CareProfessional } from "@/types"

export function CareProfessionalsClient() {
  const router = useRouter()
  const [professionals, setProfessionals] = useState<CareProfessional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCareProfessionals()
  }, [])

  const fetchCareProfessionals = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/care-professionals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch care professionals: ${response.statusText}`)
      }

      const data = await response.json()
      setProfessionals(data)
    } catch (error) {
      console.error("Error fetching care professionals:", error)
      setError("Failed to load care professionals. Please try again.")
      // Generate demo data as a fallback
      setProfessionals(getDemoCareProfessionals())
      toast({
        title: "Warning",
        description: "Using demo data due to connection issues.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Demo data fallback
  const getDemoCareProfessionals = (): CareProfessional[] => {
    return [
      {
        id: "cp-001",
        tenant_id: "demo-tenant",
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.johnson@example.com",
        phone: "07700 900123",
        role: "Registered Nurse",
        specialization: "Palliative Care",
        qualification: "RN, BSc Nursing",
        license_number: "RN123456",
        employment_status: "Full-time",
        start_date: "2021-03-15",
        is_active: true,
        created_at: "2021-03-10T00:00:00Z",
        updated_at: "2023-01-15T00:00:00Z",
        created_by: "admin",
        updated_by: "admin",
        address: "123 Care Street, London",
        notes: "Specialized in complex care management",
        emergency_contact_name: "Michael Johnson",
        emergency_contact_phone: "07700 900456",
      },
      {
        id: "cp-002",
        tenant_id: "demo-tenant",
        first_name: "James",
        last_name: "Williams",
        email: "james.williams@example.com",
        phone: "07700 900234",
        role: "Physiotherapist",
        specialization: "Neurological Rehabilitation",
        qualification: "BSc Physiotherapy, MSc Neuro Rehab",
        license_number: "PT789012",
        employment_status: "Part-time",
        start_date: "2022-01-10",
        is_active: true,
        created_at: "2021-12-20T00:00:00Z",
        updated_at: "2023-02-05T00:00:00Z",
        created_by: "admin",
        updated_by: "admin",
        address: "456 Therapy Lane, Manchester",
        notes: "Specializes in stroke rehabilitation",
        emergency_contact_name: "Emma Williams",
        emergency_contact_phone: "07700 900567",
      },
      {
        id: "cp-003",
        tenant_id: "demo-tenant",
        first_name: "Emily",
        last_name: "Brown",
        email: "emily.brown@example.com",
        phone: "07700 900345",
        role: "Occupational Therapist",
        specialization: "Home Adaptations",
        qualification: "BSc Occupational Therapy",
        license_number: "OT345678",
        employment_status: "Full-time",
        start_date: "2020-06-22",
        is_active: true,
        created_at: "2020-06-15T00:00:00Z",
        updated_at: "2023-03-10T00:00:00Z",
        created_by: "admin",
        updated_by: "admin",
        address: "789 Wellbeing Road, Birmingham",
        notes: "Expert in home environment assessments",
        emergency_contact_name: "David Brown",
        emergency_contact_phone: "07700 900678",
      },
      {
        id: "cp-004",
        tenant_id: "demo-tenant",
        first_name: "Robert",
        last_name: "Smith",
        email: "robert.smith@example.com",
        phone: "07700 900456",
        role: "Healthcare Assistant",
        specialization: "Personal Care",
        qualification: "NVQ Level 3 Health and Social Care",
        license_number: "HCA567890",
        employment_status: "Full-time",
        start_date: "2022-04-05",
        is_active: true,
        created_at: "2022-03-28T00:00:00Z",
        updated_at: "2023-01-20T00:00:00Z",
        created_by: "admin",
        updated_by: "admin",
        address: "101 Support Avenue, Leeds",
        notes: "Experienced in complex care support",
        emergency_contact_name: "Jennifer Smith",
        emergency_contact_phone: "07700 900789",
      },
      {
        id: "cp-005",
        tenant_id: "demo-tenant",
        first_name: "Olivia",
        last_name: "Taylor",
        email: "olivia.taylor@example.com",
        phone: "07700 900567",
        role: "Speech and Language Therapist",
        specialization: "Dysphagia Management",
        qualification: "BSc Speech and Language Therapy",
        license_number: "SLT901234",
        employment_status: "Part-time",
        start_date: "2021-09-15",
        is_active: true,
        created_at: "2021-09-01T00:00:00Z",
        updated_at: "2023-02-28T00:00:00Z",
        created_by: "admin",
        updated_by: "admin",
        address: "202 Communication Street, Glasgow",
        notes: "Specializes in swallowing assessments",
        emergency_contact_name: "William Taylor",
        emergency_contact_phone: "07700 900890",
      },
    ]
  }

  const filteredProfessionals = professionals.filter((professional) => {
    const fullName = `${professional.first_name || ""} ${professional.last_name || ""}`.toLowerCase()
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      professional.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    fetchCareProfessionals()
  }

  const handleViewProfessional = (id: string) => {
    router.push(`/care-professionals/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-2/3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search professionals..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Professional
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
              <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                <span className="sr-only">Dismiss</span>
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </button>
            </div>
          )}

          <CareProfessionalsTable
            professionals={filteredProfessionals}
            isLoading={loading}
            onView={handleViewProfessional}
            onRefresh={fetchCareProfessionals}
          />
        </div>

        <div className="md:w-1/3 space-y-4">
          <CareProfessionalStats />
          <CredentialsSummary />
        </div>
      </div>

      <CreateCareProfessionalDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}

