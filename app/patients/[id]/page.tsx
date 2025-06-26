"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calendar,
  Clock,
  FileText,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  User,
  ArrowLeft,
  Edit,
  Pill,
  CalendarClock,
  ClipboardList,
  Activity,
  Target,
  ListChecks,
  Syringe,
  Stethoscope,
  BugIcon as Allergy,
  Bone,
  Users,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Patient, CarePlan, Appointment, PatientNote, Medication } from "@/types" // Import Medication type
import { useToast } from "@/hooks/use-toast"
import { CreateCarePlanDialog } from "@/components/care-plans/create-care-plan-dialog"
import { EditCarePlanDialog } from "@/components/care-plans/edit-care-plan-dialog"
import { Separator } from "@/components/ui/separator"
import { AddNoteDialog } from "@/components/patients/add-note-dialog"
import { PatientNotesList } from "@/components/patients/patient-notes-list"
import { GPConnectData } from "@/components/patients/gp-connect-data" // Import GPConnectData
import { PatientDailyLogs } from "@/components/patients/patient-daily-logs" // Import PatientDailyLogs
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea" // Import Textarea

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { toast } = useToast()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedPatientData, setEditedPatientData] = useState<Partial<Patient>>({})

  const [patientCarePlans, setPatientCarePlans] = useState<CarePlan[]>([])
  const [loadingCarePlans, setLoadingCarePlans] = useState(true)
  const [carePlanError, setCarePlanError] = useState<string | null>(null)
  const [selectedCarePlan, setSelectedCarePlan] = useState<CarePlan | null>(null)
  const [isEditCarePlanDialogOpen, setIsEditCarePlanDialogOpen] = useState(false)

  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [appointmentError, setAppointmentError] = useState<string | null>(null)

  const [patientNotes, setPatientNotes] = useState<PatientNote[]>([])
  const [loadingNotes, setLoadingNotes] = useState(true)
  const [notesError, setNotesError] = useState<string | null>(null)
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false)

  const [patientMedications, setPatientMedications] = useState<Medication[]>([])
  const [loadingMedications, setLoadingMedications] = useState(true)
  const [medicationError, setMedicationError] = useState<string | null>(null)

  const fetchPatient = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/patients/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch patient: ${response.status}`)
      }

      const data: Patient = await response.json()
      // Parse JSONB fields if they are strings
      const parsedData = {
        ...data,
        address: typeof data.address === "string" ? JSON.parse(data.address) : data.address,
        medical_history:
          typeof data.medical_history === "string" ? JSON.parse(data.medical_history) : data.medical_history,
        family_medical_history:
          typeof data.family_medical_history === "string"
            ? JSON.parse(data.family_medical_history)
            : data.family_medical_history,
        allergies: typeof data.allergies === "string" ? JSON.parse(data.allergies) : data.allergies,
        chronic_conditions:
          typeof data.chronic_conditions === "string" ? JSON.parse(data.chronic_conditions) : data.chronic_conditions,
        past_surgeries: typeof data.past_surgeries === "string" ? JSON.parse(data.past_surgeries) : data.past_surgeries,
        immunizations: typeof data.immunizations === "string" ? JSON.parse(data.immunizations) : data.immunizations,
      }
      setPatient(parsedData)
      // Prepare data for edit form, converting arrays to comma-separated strings for Textarea
      setEditedPatientData({
        ...parsedData,
        allergies: parsedData.allergies?.join(", ") || "",
        chronic_conditions: parsedData.chronic_conditions?.join(", ") || "",
        past_surgeries: parsedData.past_surgeries?.join(", ") || "",
        immunizations: parsedData.immunizations?.join(", ") || "",
        medical_history: parsedData.medical_history ? JSON.stringify(parsedData.medical_history, null, 2) : "",
        family_medical_history: parsedData.family_medical_history
          ? JSON.stringify(parsedData.family_medical_history, null, 2)
          : "",
      })
    } catch (err: any) {
      console.error("Error fetching patient:", err)
      setError(err.message || "Failed to load patient details. Please try again later.")
      toast({
        title: "Error",
        description: `Failed to load patient details: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  const fetchPatientCarePlans = useCallback(async () => {
    setLoadingCarePlans(true)
    setCarePlanError(null)
    try {
      const response = await fetch(`/api/patients/${id}/care-plans`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient care plans")
      }
      const data: CarePlan[] = await response.json()
      setPatientCarePlans(data)
    } catch (err: any) {
      setCarePlanError(err.message || "An unknown error occurred")
      toast({
        title: "Error",
        description: `Failed to load patient care plans: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoadingCarePlans(false)
    }
  }, [id, toast])

  const fetchPatientAppointments = useCallback(async () => {
    setLoadingAppointments(true)
    setAppointmentError(null)
    try {
      const response = await fetch(`/api/patients/${id}/appointments`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient appointments")
      }
      const data: Appointment[] = await response.json()
      setPatientAppointments(data)
    } catch (err: any) {
      setAppointmentError(err.message || "An unknown error occurred")
      toast({
        title: "Error",
        description: `Failed to load patient appointments: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoadingAppointments(false)
    }
  }, [id, toast])

  const fetchPatientNotes = useCallback(async () => {
    setLoadingNotes(true)
    setNotesError(null)
    try {
      const response = await fetch(`/api/patients/${id}/notes`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient notes")
      }
      const data: PatientNote[] = await response.json()
      setPatientNotes(data)
    } catch (err: any) {
      setNotesError(err.message || "An unknown error occurred")
      toast({
        title: "Error",
        description: `Failed to load patient notes: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoadingNotes(false)
    }
  }, [id, toast])

  const fetchPatientMedications = useCallback(async () => {
    setLoadingMedications(true)
    setMedicationError(null)
    try {
      const response = await fetch(`/api/patients/${id}/medications`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient medications")
      }
      const data: Medication[] = await response.json()
      setPatientMedications(data)
    } catch (err: any) {
      setMedicationError(err.message || "An unknown error occurred")
      toast({
        title: "Error",
        description: `Failed to load patient medications: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoadingMedications(false)
    }
  }, [id, toast])

  useEffect(() => {
    if (id) {
      fetchPatient()
      fetchPatientCarePlans()
      fetchPatientAppointments()
      fetchPatientNotes()
      fetchPatientMedications()
    }
  }, [id, fetchPatient, fetchPatientCarePlans, fetchPatientAppointments, fetchPatientNotes, fetchPatientMedications])

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedPatientData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditedPatientData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditDateChange = (date: Date | undefined) => {
    setEditedPatientData((prev) => ({ ...prev, date_of_birth: date ? format(date, "yyyy-MM-dd") : "" }))
  }

  const handleUpdatePatient = async () => {
    try {
      const dataToSend: Partial<Patient> = { ...editedPatientData }

      // Convert comma-separated strings back to arrays
      if (typeof dataToSend.allergies === "string") {
        dataToSend.allergies = dataToSend.allergies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }
      if (typeof dataToSend.chronic_conditions === "string") {
        dataToSend.chronic_conditions = dataToSend.chronic_conditions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }
      if (typeof dataToSend.past_surgeries === "string") {
        dataToSend.past_surgeries = dataToSend.past_surgeries
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }
      if (typeof dataToSend.immunizations === "string") {
        dataToSend.immunizations = dataToSend.immunizations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }

      // Parse JSON strings back to objects
      if (typeof dataToSend.medical_history === "string" && dataToSend.medical_history.trim() !== "") {
        try {
          dataToSend.medical_history = JSON.parse(dataToSend.medical_history)
        } catch (e) {
          toast({
            title: "Input Error",
            description: "Medical History must be valid JSON.",
            variant: "destructive",
          })
          return
        }
      } else if (typeof dataToSend.medical_history === "string" && dataToSend.medical_history.trim() === "") {
        dataToSend.medical_history = null
      }

      if (typeof dataToSend.family_medical_history === "string" && dataToSend.family_medical_history.trim() !== "") {
        try {
          dataToSend.family_medical_history = JSON.parse(dataToSend.family_medical_history)
        } catch (e) {
          toast({
            title: "Input Error",
            description: "Family Medical History must be valid JSON.",
            variant: "destructive",
          })
          return
        }
      } else if (
        typeof dataToSend.family_medical_history === "string" &&
        dataToSend.family_medical_history.trim() === ""
      ) {
        dataToSend.family_medical_history = null
      }

      const response = await fetch(`/api/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to update patient: ${response.status}`)
      }

      await fetchPatient() // Re-fetch patient data to update UI
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Patient details updated successfully.",
      })
    } catch (err: any) {
      console.error("Error updating patient:", err)
      setError(err.message || "Failed to update patient.")
      toast({
        title: "Error",
        description: `Failed to update patient: ${err.message}`,
        variant: "destructive",
      })
    }
  }

  const handleEditCarePlan = (plan: CarePlan) => {
    setSelectedCarePlan(plan)
    setIsEditCarePlanDialogOpen(true)
  }

  if (loading) {
    return <PatientDetailSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Patient not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Placeholder for progress calculation (if not stored directly in DB)
  const calculateProgress = (plan: CarePlan) => {
    if (plan.status === "completed") return 100
    if (plan.status === "cancelled") return 0
    const startDate = new Date(plan.start_date)
    const endDate = plan.end_date ? new Date(plan.end_date) : null
    if (!endDate || new Date() < startDate) return 0
    if (new Date() > endDate) return 99 // Almost complete if past end date but not marked completed

    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedDuration = new Date().getTime() - startDate.getTime()
    return Math.min(100, Math.round((elapsedDuration / totalDuration) * 100))
  }

  const upcomingAppointments = patientAppointments
    .filter((appt) => new Date(appt.appointment_date) >= new Date())
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
          <CreateCarePlanDialog
            trigger={
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Care Plan
              </Button>
            }
            onSuccess={fetchPatientCarePlans}
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  patient.avatar_url ||
                  `/placeholder.svg?height=80&width=80&query=${patient.first_name.charAt(0) || ""}${patient.last_name.charAt(0)}`
                }
                alt={`${patient.first_name} ${patient.last_name}`}
              />
              <AvatarFallback>{`${patient.first_name.charAt(0)}${patient.last_name.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">
                    {patient.first_name} {patient.last_name}
                  </CardTitle>
                  <CardDescription>
                    NHS Number: {patient.medical_record_number} | DOB: {format(new Date(patient.date_of_birth), "PPP")}{" "}
                    ({calculateAge(patient.date_of_birth)} years)
                  </CardDescription>
                </div>
                <Badge variant={patient.status === "active" ? "default" : "secondary"} className="h-6">
                  {patient.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          {patient.medical_record_number && <TabsTrigger value="gp-connect">GP Connect</TabsTrigger>}
          <TabsTrigger value="daily-logs">Daily Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                    <dd>{patient.gender || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <Home className="mr-2 h-4 w-4" /> Address
                    </dt>
                    <dd>
                      {patient.address?.street || "N/A"}
                      <br />
                      {patient.address?.city || "N/A"}, {patient.address?.postcode || "N/A"}
                      <br />
                      {patient.address?.country || "N/A"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <Phone className="mr-2 h-4 w-4" /> Phone
                    </dt>
                    <dd>{patient.contact_number || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground flex items-center">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </dt>
                    <dd>{patient.email || "N/A"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Medical Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Primary Care Provider</dt>
                  <dd>{patient.primary_care_provider || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center">
                    <Stethoscope className="mr-2 h-4 w-4" /> Medical History
                  </dt>
                  <dd className="text-sm text-muted-foreground">
                    {patient.medical_history ? (
                      <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-md">
                        {JSON.stringify(patient.medical_history, null, 2)}
                      </pre>
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center">
                    <Allergy className="mr-2 h-4 w-4" /> Allergies
                  </dt>
                  <dd>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "None reported"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center">
                    <Heart className="mr-2 h-4 w-4" /> Chronic Conditions
                  </dt>
                  <dd>
                    {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {patient.chronic_conditions.map((condition, index) => (
                          <Badge key={index} variant="outline">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "None reported"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center">
                    <Bone className="mr-2 h-4 w-4" /> Past Surgeries
                  </dt>
                  <dd>
                    {patient.past_surgeries && patient.past_surgeries.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {patient.past_surgeries.map((surgery, index) => (
                          <li key={index} className="text-sm">
                            {surgery}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "None reported"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center">
                    <Users className="mr-2 h-4 w-4" /> Family Medical History
                  </dt>
                  <dd className="text-sm text-muted-foreground">
                    {patient.family_medical_history ? (
                      <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-md">
                        {JSON.stringify(patient.family_medical_history, null, 2)}
                      </pre>
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center">
                    <Syringe className="mr-2 h-4 w-4" /> Immunizations
                  </dt>
                  <dd>
                    {patient.immunizations && patient.immunizations.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {patient.immunizations.map((immunization, index) => (
                          <Badge key={index} variant="outline">
                            {immunization}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "None reported"
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Pill className="mr-2 h-5 w-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMedications ? (
                  <div className="text-center py-4">Loading medications...</div>
                ) : medicationError ? (
                  <div className="text-center py-4 text-red-500">{medicationError}</div>
                ) : patientMedications.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patientMedications.slice(0, 3).map((med) => (
                      <li key={med.id} className="text-sm">
                        {med.name} - {med.dosage} ({med.frequency})
                      </li>
                    ))}
                    {patientMedications.length > 3 && (
                      <li className="text-sm text-muted-foreground">...and {patientMedications.length - 3} more</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No current medications recorded.</p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAppointments ? (
                  <div className="text-center py-4">Loading appointments...</div>
                ) : appointmentError ? (
                  <div className="text-center py-4 text-red-500">{appointmentError}</div>
                ) : upcomingAppointments.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {upcomingAppointments.slice(0, 3).map((appt) => (
                      <li key={appt.id} className="text-sm">
                        {format(new Date(appt.appointment_date), "MMM d, p")} - {appt.appointment_type}
                      </li>
                    ))}
                    {upcomingAppointments.length > 3 && (
                      <li className="text-sm text-muted-foreground">...and {upcomingAppointments.length - 3} more</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No upcoming appointments.</p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Height</div>
                  <div className="text-2xl font-bold">N/A cm</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Weight</div>
                  <div className="text-2xl font-bold">N/A kg</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">BMI</div>
                  <div className="text-2xl font-bold">N/A</div>
                  <div className="text-xs text-muted-foreground">N/A</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Blood Type</div>
                  <div className="font-medium">N/A</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Smoking Status</div>
                  <div className="font-medium">N/A</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Alcohol Consumption</div>
                  <div className="font-medium">N/A</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="mr-2 h-5 w-5" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMedications ? (
                <div className="text-center py-8">Loading medications...</div>
              ) : medicationError ? (
                <div className="text-center py-8 text-red-500">{medicationError}</div>
              ) : patientMedications.length === 0 ? (
                <div className="text-center py-8">No medications recorded</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Prescribing Doctor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientMedications.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell>{med.name}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.frequency}</TableCell>
                        <TableCell>{format(new Date(med.start_date), "PPP")}</TableCell>
                        <TableCell>{med.prescribed_by_name || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Medication
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="mr-2 h-5 w-5" />
                Detailed Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Stethoscope className="mr-2 h-4 w-4" /> General Medical History
                </h3>
                <p className="text-sm text-muted-foreground">
                  {patient.medical_history ? (
                    <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-md">
                      {JSON.stringify(patient.medical_history, null, 2)}
                    </pre>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Allergy className="mr-2 h-4 w-4" /> Allergies
                </h3>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None reported</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Heart className="mr-2 h-4 w-4" /> Chronic Conditions
                </h3>
                {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {patient.chronic_conditions.map((condition, index) => (
                      <Badge key={index} variant="outline">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None reported</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Bone className="mr-2 h-4 w-4" /> Past Surgeries
                </h3>
                {patient.past_surgeries && patient.past_surgeries.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.past_surgeries.map((surgery, index) => (
                      <li key={index} className="text-sm">
                        {surgery}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">None reported</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Users className="mr-2 h-4 w-4" /> Family Medical History
                </h3>
                <p className="text-sm text-muted-foreground">
                  {patient.family_medical_history ? (
                    <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-md">
                      {JSON.stringify(patient.family_medical_history, null, 2)}
                    </pre>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Syringe className="mr-2 h-4 w-4" /> Immunizations
                </h3>
                {patient.immunizations && patient.immunizations.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {patient.immunizations.map((immunization, index) => (
                      <Badge key={index} variant="outline">
                        {immunization}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None reported</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care-plan" className="space-y-4">
          {loadingCarePlans ? (
            <div className="text-center py-8">Loading care plans...</div>
          ) : carePlanError ? (
            <div className="text-center py-8 text-red-500">{carePlanError}</div>
          ) : patientCarePlans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                No care plans found for this patient.
              </CardContent>
            </Card>
          ) : (
            patientCarePlans.map((carePlan) => (
              <Card key={carePlan.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <CardTitle className="flex items-center">
                      <ClipboardList className="mr-2 h-5 w-5" />
                      {carePlan.title}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {format(new Date(carePlan.updated_at), "PPP")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Overall Progress</h3>
                        <span className="text-sm font-medium">{calculateProgress(carePlan)}%</span>
                      </div>
                      <Progress value={calculateProgress(carePlan)} className="h-2" />
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <FileText className="mr-2 h-4 w-4" /> Description
                      </h3>
                      <p className="text-sm text-muted-foreground">{carePlan.description || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium flex items-center">
                          <Calendar className="mr-2 h-4 w-4" /> Start Date
                        </h3>
                        <p className="text-sm">{format(new Date(carePlan.start_date), "PPP")}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium flex items-center">
                          <Calendar className="mr-2 h-4 w-4" /> End Date
                        </h3>
                        <p className="text-sm">
                          {carePlan.end_date ? format(new Date(carePlan.end_date), "PPP") : "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium flex items-center">
                          <Calendar className="mr-2 h-4 w-4" /> Next Review
                        </h3>
                        <p className="text-sm">
                          {carePlan.review_date ? format(new Date(carePlan.review_date), "PPP") : "N/A"}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Target className="mr-2 h-4 w-4" /> Goals
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {carePlan.goals && carePlan.goals.split(",").filter(Boolean).length > 0 ? (
                          carePlan.goals.split(",").map((goal, index) => (
                            <li key={index} className="text-sm">
                              {goal.trim()}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground">No goals defined.</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <ListChecks className="mr-2 h-4 w-4" /> Interventions
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {carePlan.interventions && carePlan.interventions.split(",").filter(Boolean).length > 0 ? (
                          carePlan.interventions.split(",").map((intervention, index) => (
                            <li key={index} className="text-sm">
                              {intervention.trim()}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground">No interventions defined.</li>
                        )}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <User className="mr-2 h-4 w-4" /> Assigned To
                      </h3>
                      <p className="text-sm">{carePlan.assigned_to_name || "Not assigned"}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => handleEditCarePlan(carePlan)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Care Plan
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Export Care Plan
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Appointments
                </CardTitle>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <div className="text-center py-8">Loading appointments...</div>
              ) : appointmentError ? (
                <div className="text-center py-8 text-red-500">{appointmentError}</div>
              ) : patientAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p>No appointments found</p>
                </div>
              ) : (
                <AppointmentsList appointments={patientAppointments} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Clinical Notes
                </CardTitle>
                <Button size="sm" onClick={() => setIsAddNoteDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingNotes ? (
                <div className="text-center py-8">Loading notes...</div>
              ) : notesError ? (
                <div className="text-center py-8 text-red-500">{notesError}</div>
              ) : (
                <PatientNotesList
                  notes={patientNotes}
                  onNoteAdded={fetchPatientNotes}
                  onNoteUpdated={fetchPatientNotes}
                  onNoteDeleted={fetchPatientNotes}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {patient.medical_record_number && (
          <TabsContent value="gp-connect" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  GP Connect Data
                </CardTitle>
                <CardDescription>Real-time data from NHS GP systems.</CardDescription>
              </CardHeader>
              <CardContent>
                <GPConnectData
                  nhsNumber={patient.medical_record_number}
                  patientName={`${patient.first_name} ${patient.last_name}`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="daily-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5" />
                Daily Logs
              </CardTitle>
              <CardDescription>Daily observations and progress notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <PatientDailyLogs patientId={patient.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Update the details for {patient.first_name} {patient.last_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="edit_first_name"
                name="first_name"
                value={editedPatientData.first_name || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="edit_last_name"
                name="last_name"
                value={editedPatientData.last_name || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_date_of_birth" className="text-right">
                Date of Birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !editedPatientData.date_of_birth && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedPatientData.date_of_birth ? (
                      format(new Date(editedPatientData.date_of_birth), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editedPatientData.date_of_birth ? new Date(editedPatientData.date_of_birth) : undefined}
                    onSelect={handleEditDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_gender" className="text-right">
                Gender
              </Label>
              <Select
                onValueChange={(value) => handleEditSelectChange("gender", value)}
                value={editedPatientData.gender || ""}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_contact_number" className="text-right">
                Phone
              </Label>
              <Input
                id="edit_contact_number"
                name="contact_number"
                value={editedPatientData.contact_number || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_email" className="text-right">
                Email
              </Label>
              <Input
                id="edit_email"
                name="email"
                type="email"
                value={editedPatientData.email || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_medical_record_number" className="text-right">
                NHS Number
              </Label>
              <Input
                id="edit_medical_record_number"
                name="medical_record_number"
                value={editedPatientData.medical_record_number || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_primary_care_provider" className="text-right">
                Primary Care Provider
              </Label>
              <Input
                id="edit_primary_care_provider"
                name="primary_care_provider"
                value={editedPatientData.primary_care_provider || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_avatar_url" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="edit_avatar_url"
                name="avatar_url"
                value={editedPatientData.avatar_url || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            {/* New Medical History Fields */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit_medical_history" className="text-right pt-2">
                Medical History (JSON)
              </Label>
              <Textarea
                id="edit_medical_history"
                name="medical_history"
                value={editedPatientData.medical_history || ""}
                onChange={handleEditInputChange}
                className="col-span-3 min-h-[80px]"
                placeholder='e.g., {"conditions": ["Hypertension"], "surgeries": ["Appendectomy"]}'
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_allergies" className="text-right">
                Allergies (comma-separated)
              </Label>
              <Input
                id="edit_allergies"
                name="allergies"
                value={editedPatientData.allergies || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="e.g., Penicillin, Peanuts"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_chronic_conditions" className="text-right">
                Chronic Conditions (comma-separated)
              </Label>
              <Input
                id="edit_chronic_conditions"
                name="chronic_conditions"
                value={editedPatientData.chronic_conditions || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="e.g., Diabetes, Asthma"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_past_surgeries" className="text-right">
                Past Surgeries (comma-separated)
              </Label>
              <Input
                id="edit_past_surgeries"
                name="past_surgeries"
                value={editedPatientData.past_surgeries || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="e.g., Tonsillectomy (2010), Cholecystectomy (2015)"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit_family_medical_history" className="text-right pt-2">
                Family Medical History (JSON)
              </Label>
              <Textarea
                id="edit_family_medical_history"
                name="family_medical_history"
                value={editedPatientData.family_medical_history || ""}
                onChange={handleEditInputChange}
                className="col-span-3 min-h-[80px]"
                placeholder='e.g., {"father": "Hypertension", "mother": "Diabetes"}'
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_immunizations" className="text-right">
                Immunizations (comma-separated)
              </Label>
              <Input
                id="edit_immunizations"
                name="immunizations"
                value={editedPatientData.immunizations || ""}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="e.g., Flu (2023), Tetanus (2020)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePatient}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Care Plan Dialog */}
      <EditCarePlanDialog
        open={isEditCarePlanDialogOpen}
        onOpenChange={setIsEditCarePlanDialogOpen}
        carePlan={selectedCarePlan}
        onSuccess={fetchPatientCarePlans}
      />

      {/* Add Note Dialog */}
      {patient && (
        <AddNoteDialog
          open={isAddNoteDialogOpen}
          onOpenChange={setIsAddNoteDialogOpen}
          patientId={patient.id}
          onNoteAdded={fetchPatientNotes}
        />
      )}
    </div>
  )
}

function AppointmentsList({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No appointments found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments
        .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
        .map((appointment, index) => (
          <div key={index} className="border rounded-md p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
              <div className="font-medium">{appointment.appointment_type}</div>
              <Badge variant={appointment.status === "scheduled" ? "outline" : "secondary"}>{appointment.status}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(new Date(appointment.appointment_date), "PPP")}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {appointment.appointment_time}
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                {appointment.care_professional_name || "N/A"}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                {appointment.location || "N/A"}
              </div>
            </div>
            {appointment.notes && (
              <div className="mt-2 text-sm">
                <div className="font-medium">Notes:</div>
                <p className="text-muted-foreground">{appointment.notes}</p>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

function PatientDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      <Skeleton className="h-40 w-full mb-6" />

      <div className="mb-4">
        <Skeleton className="h-10 w-96" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}
