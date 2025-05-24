"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, FolderPlus, FileText } from "lucide-react"
import ClinicalNoteCategoriesList from "@/components/clinical-notes/clinical-note-categories-list"
import ClinicalNotesList from "@/components/clinical-notes/clinical-notes-list"
import ClinicalNoteTemplatesList from "@/components/clinical-notes/clinical-note-templates-list"
import CreateClinicalNoteDialog from "@/components/clinical-notes/create-clinical-note-dialog"
import CreateCategoryDialog from "@/components/clinical-notes/create-category-dialog"
import type { ClinicalNoteCategory, ClinicalNoteTemplate, ClinicalNote } from "@/lib/services/clinical-notes-service"

export default function ClinicalNotesClient() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("notes")
  const [notes, setNotes] = useState<ClinicalNote[]>([])
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([])
  const [templates, setTemplates] = useState<ClinicalNoteTemplate[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false)
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [notesRes, categoriesRes, templatesRes] = await Promise.all([
          fetch("/api/clinical-notes"),
          fetch("/api/clinical-notes/categories"),
          fetch("/api/clinical-notes/templates"),
        ])

        if (!notesRes.ok || !categoriesRes.ok || !templatesRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [notesData, categoriesData, templatesData] = await Promise.all([
          notesRes.json(),
          categoriesRes.json(),
          templatesRes.json(),
        ])

        setNotes(notesData)
        setCategories(categoriesData)
        setTemplates(templatesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load clinical notes data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleCreateNote = async (
    note: Omit<ClinicalNote, "id" | "createdBy" | "createdAt" | "updatedAt" | "categoryName">,
  ) => {
    try {
      const response = await fetch("/api/clinical-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      })

      if (!response.ok) {
        throw new Error("Failed to create note")
      }

      const newNote = await response.json()
      setNotes((prev) => [newNote, ...prev])
      setIsCreateNoteOpen(false)
      toast({
        title: "Success",
        description: "Clinical note created successfully",
      })
    } catch (error) {
      console.error("Error creating note:", error)
      toast({
        title: "Error",
        description: "Failed to create clinical note",
        variant: "destructive",
      })
    }
  }

  const handleCreateCategory = async (category: Omit<ClinicalNoteCategory, "id">) => {
    try {
      const response = await fetch("/api/clinical-notes/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      const newCategory = await response.json()
      setCategories((prev) => [...prev, newCategory])
      setIsCreateCategoryOpen(false)
      toast({
        title: "Success",
        description: "Category created successfully",
      })
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleCreateTemplate = async (template: Omit<ClinicalNoteTemplate, "id" | "categoryName">) => {
    try {
      const response = await fetch("/api/clinical-notes/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      })

      if (!response.ok) {
        throw new Error("Failed to create template")
      }

      const newTemplate = await response.json()
      setTemplates((prev) => [...prev, newTemplate])
      setIsCreateTemplateOpen(false)
      toast({
        title: "Success",
        description: "Template created successfully",
      })
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/clinical-notes/${noteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete note")
      }

      setNotes((prev) => prev.filter((note) => note.id !== noteId))
      toast({
        title: "Success",
        description: "Clinical note deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete clinical note",
        variant: "destructive",
      })
    }
  }

  const handleUpdateNote = async (noteId: string, updatedData: Partial<ClinicalNote>) => {
    try {
      const response = await fetch(`/api/clinical-notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update note")
      }

      const updatedNote = await response.json()
      setNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)))
      toast({
        title: "Success",
        description: "Clinical note updated successfully",
      })
    } catch (error) {
      console.error("Error updating note:", error)
      toast({
        title: "Error",
        description: "Failed to update clinical note",
        variant: "destructive",
      })
    }
  }

  const filteredNotes = selectedCategory ? notes.filter((note) => note.categoryId === selectedCategory) : notes

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button size="sm" variant="outline" onClick={() => setIsCreateCategoryOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          <ClinicalNoteCategoriesList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            loading={isLoading}
          />
        </div>
      </div>

      <div className="md:col-span-3">
        <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="notes">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="templates">
                <FolderPlus className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
            </TabsList>

            {activeTab === "notes" && (
              <Button onClick={() => setIsCreateNoteOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            )}
            {activeTab === "templates" && (
              <Button onClick={() => setIsCreateTemplateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            )}
          </div>

          <TabsContent value="notes" className="mt-0">
            <ClinicalNotesList
              notes={filteredNotes}
              categories={categories}
              loading={isLoading}
              onNoteDeleted={handleDeleteNote}
            />
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <ClinicalNoteTemplatesList templates={templates} categories={categories} loading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>

      {isCreateNoteOpen && (
        <CreateClinicalNoteDialog
          open={isCreateNoteOpen}
          onOpenChange={setIsCreateNoteOpen}
          onNoteCreated={handleCreateNote}
          categories={categories}
          templates={templates}
          patientId={null}
        />
      )}

      {isCreateCategoryOpen && (
        <CreateCategoryDialog
          open={isCreateCategoryOpen}
          onOpenChange={setIsCreateCategoryOpen}
          onCategoryCreated={handleCreateCategory}
        />
      )}
    </div>
  )
}
