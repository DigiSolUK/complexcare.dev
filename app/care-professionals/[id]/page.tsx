import { getCareProfessionalById } from "@/lib/services/care-professional-service"
import { DEFAULT_TENANT_ID } from "@/lib/tenant"

export default async function CareProfessionalDetailPage({ params }: { params: { id: string } }) {
  const careProfessional = await getCareProfessionalById(params.id, DEFAULT_TENANT_ID)

  if (!careProfessional) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Care Professional Not Found</h1>
          <p className="text-gray-500">The care professional you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4">
          {careProfessional.avatar_url && (
            <img
              src={careProfessional.avatar_url || "/placeholder.svg"}
              alt={`${careProfessional.first_name} ${careProfessional.last_name}`}
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {careProfessional.first_name} {careProfessional.last_name}
            </h1>
            <p className="text-gray-600">{careProfessional.role}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Email:</span> {careProfessional.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {careProfessional.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {careProfessional.address}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Professional Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Specialization:</span> {careProfessional.specialization}
              </p>
              <p>
                <span className="font-medium">Qualification:</span> {careProfessional.qualification}
              </p>
              <p>
                <span className="font-medium">License Number:</span> {careProfessional.license_number}
              </p>
              <p>
                <span className="font-medium">Employment Status:</span> {careProfessional.employment_status}
              </p>
              <p>
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(careProfessional.start_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-gray-700">{careProfessional.notes}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Emergency Contact</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {careProfessional.emergency_contact_name}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {careProfessional.emergency_contact_phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
