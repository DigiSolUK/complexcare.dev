import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCareProfessionalById } from "@/lib/services/care-professional-service"
import { CareProfessionalDetails } from "@/components/care-professionals/care-professional-details"
import { CareProfessionalCredentials } from "@/components/care-professionals/care-professional-credentials"
import { CareProfessionalAppointments } from "@/components/care-professionals/care-professional-appointments"
import { CareProfessionalTasks } from "@/components/care-professionals/care-professional-tasks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentUser } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

interface CareProfessionalPageProps {
  params: {
    id: string
  }
}

export default async function CareProfessionalPage({ params }: CareProfessionalPageProps) {
  // Try to get the current user, but don't fail if it's not available
  let user
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error("Error getting current user:", error)
    // Continue without user - we'll use demo data
  }

  const tenantId = user?.tenant_id || "demo-tenant"

  let professional
  try {
    professional = await getCareProfessionalById(tenantId, params.id)
  } catch (error) {
    console.error("Error fetching care professional:", error)
    // We'll handle this below
  }

  // If we couldn't get the professional, check if we're in demo mode
  if (!professional) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Get demo data
      const demoProfessionals = [
        {
          id: "cp-001",
          tenant_id: "demo-tenant",
          first_name: "Sarah",
          last_name: "Johnson",
          title: "Ms",
          email: "sarah.johnson@example.com",
          phone_number: "07700 900123",
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
          title: "Mr",
          email: "james.williams@example.com",
          phone_number: "07700 900234",
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
          title: "Ms",
          email: "emily.brown@example.com",
          phone_number: "07700 900345",
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
          title: "Dr",
          email: "robert.smith@example.com",
          phone_number: "07700 900456",
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
          title: "Mrs",
          email: "olivia.taylor@example.com",
          phone_number: "07700 900567",
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

      professional = demoProfessionals.find((p) => p.id === params.id)
    }

    // If still not found, return 404
    if (!professional) {
      return notFound()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {professional.title ? `${professional.title} ` : ""}
          {professional.first_name} {professional.last_name}
        </h1>
        <p className="text-muted-foreground">
          {professional.role} {professional.specialization ? `- ${professional.specialization}` : ""}
        </p>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CareProfessionalDetails professional={professional} />
          </Suspense>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CareProfessionalCredentials professionalId={params.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CareProfessionalAppointments professionalId={params.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CareProfessionalTasks professionalId={params.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

