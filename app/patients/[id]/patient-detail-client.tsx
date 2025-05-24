"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Mail,
  Phone,
  PlusCircle,
  ArrowLeft,
  Edit,
  AlertTriangle,
  RefreshCcw,
  Calendar,
  FileText,
  Activity,
  User,
  Pill,
  AlertCircle,
  Heart,
  Clipboard,
  BarChart2,
} from "lucide-react"
import { PatientDailyLogs } from "@/components/patients/patient-daily-logs"
import { BodyMap } from "@/components/patients/body-map"
import { AddNoteDialog } from "@/components/patients/add-note-dialog"
import { GPConnectData } from "@/components/patients/gp-connect-data"
import { PatientRecommendationsCard } from "@/components/ai/patient-recommendations-card"
import { MedicalHistorySummary } from "@/components/ai/medical-history-summary"
import { ClinicalDecisionSupport } from "@/components/ai/clinical-decision-support"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface Patient {
  id: string
  tenant_id?: string
  title?: string
  first_name: string
  last_name: string
  nhs_number?: string
  date_of_birth: string
  gender?: string
  address?: string
  postcode?: string
  phone_number?: string
  email?: string
  status?: string
  is_active?: boolean
  medical_history?: string
  medications?: string
  allergies?: string
  care_needs?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  primary_care_provider?: string
  blood_type?: string
  height?: number
  weight?: number
  bmi?: number
  last_appointment_date?: string
  next_appointment_date?: string
  risk_level?: "low" | "medium" | "high"
  created_at: string
  updated_at: string
  avatar_url?: string
}

interface Appointment {
  id: string
  date: string
  time: string
  type: string
  care_professional_name: string
  status: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  start_date: string
  end_date?: string
  prescribed_by: string
}

interface ClinicalNote {
  id: string
  date: string
  title: string
  content: string
  created_by: string
  is_important: boolean
}

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: { systolic: 120, diastolic: 80, timestamp: new Date().toISOString() },
    heartRate: { value: 72, timestamp: new Date().toISOString() },
    temperature: { value: 36.8, timestamp: new Date().toISOString() },
    oxygenSaturation: { value: 98, timestamp: new Date().toISOString() },
    respiratoryRate: { value: 16, timestamp: new Date().toISOString() },
  })

  const fetchPatient = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log(`Fetching patient with ID: ${patientId}`)
      const response = await fetch(`/api/patients/${patientId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch patient: ${response.status}`)
      }

      const data = await response.json()
      console.log("Patient data received:", data)
      setPatient(data)

      // Fetch related data
      await Promise.all([fetchAppointments(), fetchMedications(), fetchClinicalNotes()])
    } catch (err: any) {
      console.error("Error fetching patient:", err)
      setError(err.message || "Failed to load patient data.")
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }

  const fetchAppointments = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch(`/api/patients/${patientId}/appointments`);
      // if (!response.ok) throw new Error('Failed to fetch appointments');
      // const data = await response.json();
      // setAppointments(data);

      // Mock data for now
      setAppointments([
        {
          id: "apt-1",
          date: "2025-05-30",
          time: "10:00",
          type: "Check-up",
          care_professional_name: "Dr. Sarah Johnson",
          status: "scheduled",
        },
        {
          id: "apt-2",
          date: "2025-05-15",
          time: "14:30",
          type: "Physiotherapy",
          care_professional_name: "James Williams",
          status: "completed",
        },
      ])
    } catch (err) {
      console.error("Error fetching appointments:", err)
    }
  }

  const fetchMedications = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch(`/api/patients/${patientId}/medications`);
      // if (!response.ok) throw new Error('Failed to fetch medications');
      // const data = await response.json();
      // setMedications(data);

      // Mock data for now
      setMedications([
        {
          id: "med-1",
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          start_date: "2024-01-15",
          prescribed_by: "Dr. Robert Brown",
        },
        {
          id: "med-2",
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          start_date: "2023-11-20",
          prescribed_by: "Dr. Robert Brown",
        },
      ])
    } catch (err) {
      console.error("Error fetching medications:", err)
    }
  }

  const fetchClinicalNotes = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch(`/api/patients/${patientId}/clinical-notes`);
      // if (!response.ok) throw new Error('Failed to fetch clinical notes');
      // const data = await response.json();
      // setClinicalNotes(data);

      // Mock data for now
      setClinicalNotes([
        {
          id: "note-1",
          date: "2025-05-20",
          title: "Initial Assessment",
          content:
            "Patient presents with mild hypertension and Type 2 diabetes. Currently well-controlled with medication. Advised on diet and exercise.",
          created_by: "Dr. Sarah Johnson",
          is_important: true,
        },
        {
          id: "note-2",
          date: "2025-04-10",
          title: "Follow-up",
          content:
            "Blood pressure readings improved. Continuing with current medication regimen. Patient reports improved mobility.",
          created_by: "Dr. Sarah Johnson",
          is_important: false,
        },
      ])
    } catch (err) {
      console.error("Error fetching clinical notes:", err)
    }
  }

  const handleRetry = () => {
    setRetrying(true)
    fetchPatient()
  }

  const handleAddNote = async (note: { notes: string; bodyMapAreas: string[]; bodyMapNotes: string }) => {
    // This would be replaced with an actual API call
    // const response = await fetch(`/api/patients/${patientId}/clinical-notes`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(note)
    // });
    // if (!response.ok) throw new Error('Failed to add note');
    // const newNote = await response.json();

    // Mock adding a note
    const newNote: ClinicalNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString(),
      title: "New Clinical Note",
      content: note.notes,
      created_by: "Current User",
      is_important: false,
    }

    setClinicalNotes((prev) => [newNote, ...prev])
    return newNote
  }

  useEffect(() => {
    fetchPatient()
  }, [patientId])

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-32" />
          <div className="flex-1" />
          <Skeleton className="h-10 w-32 mr-2" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-40 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-1" />
          <Skeleton className="h-64 col-span-2" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Patient</h2>
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={handleRetry} disabled={retrying}>
                {retrying ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retry
                  </>
                )}
              </Button>
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
              <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Patients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Function to safely format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "PPP")
    } catch (e) {
      console.error("Error formatting date:", e)
      return dateString
    }
  }

  // Function to safely get status
  const getStatus = () => {
    if (patient.status) return patient.status
    if (patient.is_active !== undefined) return patient.is_active ? "Active" : "Inactive"
    return "Unknown"
  }

  // Function to get status color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === "active") return "bg-green-100 text-green-800 hover:bg-green-200"
    if (statusLower === "inactive") return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    if (statusLower === "critical") return "bg-red-100 text-red-800 hover:bg-red-200"
    if (statusLower === "stable") return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  // Function to get risk level color
  const getRiskLevelColor = (level: string | undefined) => {
    if (!level) return "bg-gray-100 text-gray-800"
    const levelLower = level.toLowerCase()
    if (levelLower === "high") return "bg-red-100 text-red-800"
    if (levelLower === "medium") return "bg-yellow-100 text-yellow-800"
    if (levelLower === "low") return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Care Plan
          </Button>
        </div>
      </div>

      <Card className="mb-6 overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
                {patient.avatar_url ? (
                  <AvatarImage
                    src={patient.avatar_url || "/placeholder.svg"}
                    alt={`${patient.first_name} ${patient.last_name}`}
                  />
                ) : (
                  <AvatarImage
                    src={`https://avatars.dicebear.com/api/initials/${patient.first_name?.charAt(0)}${patient.last_name?.charAt(0)}.svg`}
                    alt={`${patient.first_name} ${patient.last_name}`}
                  />
                )}
                <AvatarFallback>{`${patient.first_name?.charAt(0) || ""}${patient.last_name?.charAt(0) || ""}`}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-2xl">
                      {patient.title ? `${patient.title} ` : ""}
                      {patient.first_name || "Unknown"} {patient.last_name || ""}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      {patient.nhs_number ? `NHS Number: ${patient.nhs_number} | ` : ""}
                      DOB: {formatDate(patient.date_of_birth)} (
                      {patient.date_of_birth ? calculateAge(patient.date_of_birth) : "N/A"} years)
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(getStatus())} capitalize px-3 py-1 text-xs font-medium rounded-full`}
                  >
                    {getStatus()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </div>
        <CardContent className="pt-4 pb-2 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium">{patient.gender || "Not specified"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Blood Type</p>
              <p className="font-medium">{patient.blood_type || "Unknown"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Risk Level</p>
              <div className="flex items-center gap-2">
                <Badge className={`${getRiskLevelColor(patient.risk_level)} capitalize`}>
                  {patient.risk_level || "Not assessed"}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Primary Care Provider</p>
              <p className="font-medium">{patient.primary_care_provider || "Not assigned"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full md:w-auto grid grid-cols-3 md:grid-cols-5 h-auto p-1">
          <TabsTrigger value="overview" className="py-2">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Overview</span>
            <span className="md:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="medical" className="py-2">
            <Heart className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Medical</span>
            <span className="md:hidden">Medical</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="py-2">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Notes</span>
            <span className="md:hidden">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="py-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Appointments</span>
            <span className="md:hidden">Appts</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="py-2">
            <BarChart2 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Analytics</span>
            <span className="md:hidden">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{patient.phone_number || "N/A"}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{patient.email || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>
                      {patient.address || "N/A"}
                      {patient.address && patient.postcode ? `, ${patient.postcode}` : patient.postcode || ""}
                    </span>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Emergency Contact</h4>
                    <div className="flex items-start space-x-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{patient.emergency_contact_name || "Not provided"}</span>
                    </div>
                    {patient.emergency_contact_phone && (
                      <div className="flex items-start space-x-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{patient.emergency_contact_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="h-5 w-5 mr-2 text-muted-foreground" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Blood Pressure</span>
                      <span className="text-sm text-muted-foreground">
                        {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic} mmHg
                      </span>
                    </div>
                    <Progress value={vitalSigns.bloodPressure.systolic / 2} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {format(new Date(vitalSigns.bloodPressure.timestamp), "PPp")}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Heart Rate</span>
                      <span className="text-sm text-muted-foreground">{vitalSigns.heartRate.value} bpm</span>
                    </div>
                    <Progress value={vitalSigns.heartRate.value} max={120} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {format(new Date(vitalSigns.heartRate.timestamp), "PPp")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Temperature</span>
                        <span className="text-sm text-muted-foreground">{vitalSigns.temperature.value}°C</span>
                      </div>
                      <Progress value={((vitalSigns.temperature.value - 35) * 100) / 5} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">O₂ Saturation</span>
                        <span className="text-sm text-muted-foreground">{vitalSigns.oxygenSaturation.value}%</span>
                      </div>
                      <Progress value={vitalSigns.oxygenSaturation.value} max={100} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Height</p>
                      <p>{patient.height ? `${patient.height} cm` : "Not recorded"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weight</p>
                      <p>{patient.weight ? `${patient.weight} kg` : "Not recorded"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">BMI</p>
                      <p>{patient.bmi ? patient.bmi.toFixed(1) : "Not calculated"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clipboard className="h-5 w-5 mr-2 text-muted-foreground" />
                Care Needs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{patient.care_needs || "No care needs recorded"}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.filter((apt) => new Date(apt.date) >= new Date()).length > 0 ? (
                  <div className="space-y-4">
                    {appointments
                      .filter((apt) => new Date(apt.date) >= new Date())
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-start gap-4">
                          <div className="bg-primary/10 text-primary rounded-md p-2 flex flex-col items-center justify-center min-w-[60px]">
                            <span className="text-xs font-medium">{format(new Date(appointment.date), "MMM")}</span>
                            <span className="text-lg font-bold">{format(new Date(appointment.date), "dd")}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{appointment.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(`${appointment.date}T${appointment.time}`), "p")} with{" "}
                              {appointment.care_professional_name}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming appointments scheduled</p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Pill className="h-5 w-5 mr-2 text-muted-foreground" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {medications.length > 0 ? (
                  <div className="space-y-3">
                    {medications.map((medication) => (
                      <div key={medication.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{medication.name}</h4>
                          <Badge variant="outline">{medication.dosage}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Started: {format(new Date(medication.start_date), "PP")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No medications recorded</p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{patient.medical_history || "No medical history recorded"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{patient.medications || "No medications recorded"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Allergies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{patient.allergies || "No allergies recorded"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Body Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyMap readOnly={true} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <MedicalHistorySummary patient={patient as any} />
              <PatientRecommendationsCard patient={patient as any} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clinical Notes</CardTitle>
              <Button size="sm" onClick={() => setAddNoteDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              {clinicalNotes.length > 0 ? (
                <div className="space-y-4">
                  {clinicalNotes.map((note) => (
                    <Card key={note.id} className={note.is_important ? "border-yellow-200 bg-yellow-50" : ""}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base flex items-center">
                              {note.is_important && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />}
                              {note.title}
                            </CardTitle>
                            <CardDescription>
                              {format(new Date(note.date), "PPp")} by {note.created_by}
                            </CardDescription>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-0">
                        <p className="whitespace-pre-line">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No clinical notes available. Add a new note to get started.
                </div>
              )}
            </CardContent>
          </Card>

          <PatientDailyLogs patientId={patientId} />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div
                        className={`rounded-md p-2 flex flex-col items-center justify-center min-w-[60px] ${
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <span className="text-xs font-medium">{format(new Date(appointment.date), "MMM")}</span>
                        <span className="text-lg font-bold">{format(new Date(appointment.date), "dd")}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{appointment.type}</h4>
                          <Badge
                            variant="outline"
                            className={
                              appointment.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(`${appointment.date}T${appointment.time}`), "p")} with{" "}
                          {appointment.care_professional_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No appointment history available.</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ClinicalDecisionSupport
            patient={patient as any}
            tenantId={patient.tenant_id || "ba367cfe-6de0-4180-9566-1002b75cf82c"}
          />

          <Card>
            <CardHeader>
              <CardTitle>GP Connect Data</CardTitle>
              <CardDescription>View data from the patient's GP records</CardDescription>
            </CardHeader>
            <CardContent>
              {patient.nhs_number ? (
                <GPConnectData
                  nhsNumber={patient.nhs_number}
                  patientName={`${patient.first_name} ${patient.last_name}`}
                />
              ) : (
                <div className="text-center py-6">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">NHS Number Required</h3>
                  <p className="text-muted-foreground mb-4">
                    An NHS number is required to connect to GP records. Please update the patient profile.
                  </p>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Patient Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddNoteDialog open={addNoteDialogOpen} onOpenChange={setAddNoteDialogOpen} onNoteAdded={handleAddNote} />
    </div>
  )
}
