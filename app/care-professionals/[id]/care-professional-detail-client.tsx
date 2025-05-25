"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

import {
  fetchCareProfessionalById,
  fetchAppointmentsForCareProfessional,
  fetchCredentialsForCareProfessional,
  fetchTasksForCareProfessional,
  fetchPatientsForCareProfessional,
} from "@/lib/data"
import type { CareProfessional, Appointment, Credential, Task, Patient } from "@/lib/definitions"

export default function CareProfessionalDetailClient() {
  const [careProfessional, setCareProfessional] = useState<CareProfessional | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { id } = useParams()
  const router = useRouter()

  const fetchCareProfessional = async () => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID provided")
      return null
    }
    return fetchCareProfessionalById(id)
  }

  const fetchAppointments = async () => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID provided")
      return []
    }
    return fetchAppointmentsForCareProfessional(id)
  }

  const fetchCredentials = async () => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID provided")
      return []
    }
    return fetchCredentialsForCareProfessional(id)
  }

  const fetchTasks = async () => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID provided")
      return []
    }
    return fetchTasksForCareProfessional(id)
  }

  const fetchPatients = async () => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID provided")
      return []
    }
    return fetchPatientsForCareProfessional(id)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [professionalData, appointmentsData, credentialsData, tasksData, patientsData] = await Promise.allSettled(
          [fetchCareProfessional(), fetchAppointments(), fetchCredentials(), fetchTasks(), fetchPatients()],
        )

        if (professionalData.status === "fulfilled") {
          setCareProfessional(professionalData.value)
        } else {
          console.error("Failed to fetch care professional:", professionalData.reason)
          setError(new Error("Failed to load care professional data"))
        }

        if (appointmentsData.status === "fulfilled") {
          setAppointments(appointmentsData.value)
        }

        if (credentialsData.status === "fulfilled") {
          setCredentials(credentialsData.value)
        }

        if (tasksData.status === "fulfilled") {
          setTasks(tasksData.value)
        }

        if (patientsData.status === "fulfilled") {
          setPatients(patientsData.value)
        }
      } catch (err) {
        console.error("Error loading data:", err)
        setError(err instanceof Error ? err : new Error("Failed to load data"))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-4xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
              <p className="text-gray-600 mb-6">{error.message}</p>
              <div className="flex gap-4">
                <Button onClick={() => window.location.reload()}>Try Again</Button>
                <Button variant="outline" onClick={() => router.push("/care-professionals")}>
                  Return to List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!careProfessional) {
    return <div>Care Professional not found</div>
  }

  return (
    <div>
      <h1>Care Professional Detail</h1>
      <p>ID: {id}</p>
      <p>Name: {careProfessional.name}</p>
      <h2>Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>{appointment.title}</li>
        ))}
      </ul>
      <h2>Credentials</h2>
      <ul>
        {credentials.map((credential) => (
          <li key={credential.id}>{credential.name}</li>
        ))}
      </ul>
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.description}</li>
        ))}
      </ul>
      <h2>Patients</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  )
}
