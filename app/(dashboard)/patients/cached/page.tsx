import PatientListCached from "@/components/patients/patient-list-cached"

export const metadata = {
  title: "Patients with Redis Caching",
  description: "View patients with Redis caching for improved performance",
}

export default function PatientsCachedPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Patients with Redis Caching</h1>
      <PatientListCached />
    </div>
  )
}
