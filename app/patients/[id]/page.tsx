"use client"

import { notFound } from "next/navigation"
import { getPatientById } from "@/lib/services/patient-service"
import { getTasksByPatientAction } from "@/lib/actions/task-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClinicalNotesList } from "@/components/clinical-notes/clinical-notes-list" // Named export
import { getClinicalNotesByPatientAction, getClinicalNoteCategories } from "@/lib/actions/clinical-notes-actions"
import { CreateClinicalNoteDialog } from "@/components/clinical-notes/create-clinical-note-dialog" // Named export
import { TaskTable } from "@/components/tasks/task-table" // Named export
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react" // Import useState for dialog control
import { revalidatePath } from "next/cache"
import type { ClinicalNoteCategory } from "@/lib/db/types"

interface PatientDetailPageProps {
  params: { id: string }
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const patientId = params.id
  const patient = await getPatientById(patientId)

  if (!patient) {
    notFound()
  }

  // Fetch clinical notes for the patient
  const clinicalNotesResult = await getClinicalNotesByPatientAction(patientId)
  const clinicalNotes = clinicalNotesResult.success ? clinicalNotesResult.data : []
  const clinicalNotesError = clinicalNotesResult.success ? null : clinicalNotesResult.error

  // Fetch categories for the clinical note creation dialog
  const categoriesResult = await getClinicalNoteCategories()
  const categories = categoriesResult.success ? categoriesResult.data || [] : []

  // Fetch tasks for the patient
  const tasksResult = await getTasksByPatientAction(patientId)
  const tasks = tasksResult.success ? tasksResult.data || [] : []
  const tasksError = tasksResult.success ? null : tasksResult.error

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>{patient.fullName}</CardTitle>
          <CardDescription>Details and related information for {patient.fullName}.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <h3 className="font-semibold">Personal Information</h3>
            <p>Date of Birth: {patient.dateOfBirth ? patient.dateOfBirth.toDateString() : "N/A"}</p>
            <p>Gender: {patient.gender || "N/A"}</p>
            <p>Address: {patient.address || "N/A"}</p>
            <p>Phone: {patient.phone || "N/A"}</p>
            <p>Email: {patient.email || "N/A"}</p>
            <p>NHS Number: {patient.nhsNumber || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="clinical-notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="clinical-notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clinical Notes</CardTitle>
              {/* Client component for dialog */}
              <CreateClinicalNoteButton patientId={patient.id} patientName={patient.fullName} categories={categories} />
            </CardHeader>
            <CardContent>
              {clinicalNotesError ? (
                <div className="text-red-500 text-center">{clinicalNotesError}</div>
              ) : (
                <ClinicalNotesList
                  initialNotes={clinicalNotes}
                  onNotesUpdated={async () => {
                    "use server"
                    revalidatePath(`/patients/${patientId}`)
                  }}
                  patientId={patient.id}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks for {patient.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              {tasksError ? (
                <div className="text-red-500 text-center">{tasksError}</div>
              ) : (
                <TaskTable
                  initialTasks={tasks}
                  onTasksUpdated={async () => {
                    "use server"
                    revalidatePath(`/patients/${patientId}`)
                  }}
                  patientId={patient.id} // Pass patientId to TaskTable for filtering and new task default
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Client component to handle the CreateClinicalNoteDialog state
function CreateClinicalNoteButton({
  patientId,
  patientName,
  categories,
}: {
  patientId: string
  patientName: string
  categories: ClinicalNoteCategory[]
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Note
      </Button>
      <CreateClinicalNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onNoteCreated={async () => {
          "use server"
          revalidatePath(`/patients/${patientId}`)
        }}
        defaultPatientId={patientId}
        defaultPatientName={patientName}
        categories={categories}
      />
    </>
  )
}
