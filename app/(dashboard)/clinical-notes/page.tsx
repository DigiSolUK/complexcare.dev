import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClinicalNotesList } from "@/components/clinical-notes/clinical-notes-list"
import { ClinicalNoteCategoriesList } from "@/components/clinical-notes/clinical-note-categories-list"
import { ClinicalNoteTemplatesList } from "@/components/clinical-notes/clinical-note-templates-list"
import {
  getClinicalNotes,
  getClinicalNoteCategories,
  getClinicalNoteTemplates,
} from "@/lib/actions/clinical-notes-actions"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { revalidatePath } from "next/cache"

export const metadata: Metadata = {
  title: "Clinical Notes",
  description: "Manage and organize clinical notes, categories, and templates.",
}

async function ClinicalNotesPageContent() {
  const [notesResult, categoriesResult, templatesResult] = await Promise.all([
    getClinicalNotes(),
    getClinicalNoteCategories(),
    getClinicalNoteTemplates(),
  ])

  const notes = notesResult.success ? notesResult.data : []
  const categories = categoriesResult.success ? categoriesResult.data : []
  const templates = templatesResult.success ? templatesResult.data : []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Notes</h1>
          <p className="text-muted-foreground">Manage and organize clinical notes, categories, and templates.</p>
        </div>
      </div>

      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>All Clinical Notes</CardTitle>
              <CardDescription>View, create, and manage clinical notes for all patients.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClinicalNotesList
                initialNotes={notes}
                onNotesUpdated={async () => {
                  "use server"
                  revalidatePath("/clinical-notes")
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Note Categories</CardTitle>
              <CardDescription>Organize your clinical notes into categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClinicalNoteCategoriesList
                onCategoriesUpdated={async () => {
                  "use server"
                  revalidatePath("/clinical-notes")
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Note Templates</CardTitle>
              <CardDescription>Create reusable templates for common clinical notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClinicalNoteTemplatesList
                onTemplatesUpdated={async () => {
                  "use server"
                  revalidatePath("/clinical-notes")
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default async function ClinicalNotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading clinical notes module...</p>
        </div>
      }
    >
      <ClinicalNotesPageContent />
    </Suspense>
  )
}
