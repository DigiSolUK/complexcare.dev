"use client"

import { useState, useEffect } from "react"
import { PatientTable } from "./patient-table"
import { getPatients } from "@/lib/actions/patient-actions"

// Sample data for development
const samplePatients = [
  {
    id: "1",
    name: "John Smith",
    dateOfBirth: "1975-05-15",
    gender: "Male",
    status: "active",
    primaryCondition: "Diabetes Type 2",
    nhsNumber: "123-456-7890",
    riskLevel: "medium",
    lastAppointment: "2023-05-01",
    nextAppointment: "2023-06-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    dateOfBirth: "1982-11-23",
    gender: "Female",
    status: "stable",
    primaryCondition: "Hypertension",
    nhsNumber: "234-567-8901",
    riskLevel: "low",
    lastAppointment: "2023-05-10",
    nextAppointment: "2023-07-10",
  },
  {
    id: "3",
    name: "Robert Williams",
    dateOfBirth: "1968-03-12",
    gender: "Male",
    status: "critical",
    primaryCondition: "COPD",
    nhsNumber: "345-678-9012",
    riskLevel: "high",
    lastAppointment: "2023-05-18",
    nextAppointment: "2023-05-25",
  },
  {
    id: "4",
    name: "Emily Davis",
    dateOfBirth: "1990-07-30",
    gender: "Female",
    status: "active",
    primaryCondition: "Asthma",
    nhsNumber: "456-789-0123",
    riskLevel: "low",
    lastAppointment: "2023-04-22",
    nextAppointment: "2023-07-22",
  },
  {
    id: "5",
    name: "Michael Brown",
    dateOfBirth: "1955-09-08",
    gender: "Male",
    status: "inactive",
    primaryCondition: "Arthritis",
    nhsNumber: "567-890-1234",
    riskLevel: "medium",
    lastAppointment: "2023-03-15",
    nextAppointment: null,
  },
]

export function PatientManagement() {
  const [patients, setPatients] = useState(samplePatients)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPatients() {
      try {
        setIsLoading(true)
        const result = await getPatients(100, 0)

        if (result.success && result.data) {
          // Transform the data to match the expected format
          const formattedPatients = result.data.map((patient: any) => ({
            id: patient.id,
            name: `${patient.first_name} ${patient.last_name}`,
            dateOfBirth: patient.date_of_birth,
            gender: patient.gender,
            status: patient.status,
            primaryCondition: patient.primary_condition,
            nhsNumber: patient.nhs_number,
            riskLevel: patient.risk_level || "medium", // Default to medium if not set
            lastAppointment: null, // We would need to fetch this separately
            nextAppointment: null, // We would need to fetch this separately
          }))

          setPatients(formattedPatients)
        } else {
          // If there's an error or no data, use sample data in development
          console.warn("Using sample patient data")
          setPatients(samplePatients)
        }
      } catch (error) {
        console.error("Error loading patients:", error)
        // Fallback to sample data
        setPatients(samplePatients)
      } finally {
        setIsLoading(false)
      }
    }

    loadPatients()
  }, [])

  return <PatientTable patients={patients} isLoading={isLoading} />
}
