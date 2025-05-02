"use client"

import { useState, useEffect } from "react"
import { SectionErrorBoundary, DataFetchErrorBoundary, FormErrorBoundary } from "@/components/error-boundaries"
import { getPatientById } from "@/lib/services/patient-service"
import { withErrorHandling } from "@/lib/error-utils"

// Wrap the API call with error handling
const getPatientWithErrorHandling = withErrorHandling(getPatientById, {
  section: "Patient Detail",
  operation: "Fetch Patient Data",
})

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadPatient = async () => {
    setLoading(true)
    try {
      const data = await getPatientWithErrorHandling(patientId)
      setPatient(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatient()
  }, [patientId])

  if (loading) {
    return <div>Loading patient details...</div>
  }

  return (
    <div className="space-y-6">
      <SectionErrorBoundary section="Patient Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
            {/* Patient information content */}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Medical Summary</h2>
            {/* Medical summary content */}
          </div>
        </div>
      </SectionErrorBoundary>

      <DataFetchErrorBoundary
        resourceName="Patient Medications"
        onRetry={() => {
          /* Fetch medications */
        }}
      >
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Medications</h2>
          {/* Medications content */}
        </div>
      </DataFetchErrorBoundary>

      <FormErrorBoundary formName="Add Clinical Note">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Add Clinical Note</h2>
          {/* Form content */}
        </div>
      </FormErrorBoundary>
    </div>
  )
}
