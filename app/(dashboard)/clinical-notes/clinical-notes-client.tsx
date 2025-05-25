"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, AlertTriangle } from "lucide-react"
import { type ClinicalNoteCategory, getClinicalNoteCategories } from "@/lib/services/clinical-notes-service"
import { CreateClinicalNoteDialog } from "@/components/clinical-notes/create-clinical-note-dialog"
import { ClinicalNoteCategoriesList } from "@/components/clinical-notes/clinical-note-categories-list"
import { ClinicalNoteTemplatesList } from "@/components/clinical-notes/clinical-note-templates-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ClinicalNotesClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const categoriesData = await getClinicalNoteCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load clinical note categories. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCreateNote = () => {
    setIsCreateDialogOpen(true)
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clinical notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4">
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading clinical notes...</p>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Please select a patient to view their clinical notes
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-4">
            <p className="text-center py-8 text-muted-foreground">
              Please select a patient to view their recent clinical notes
            </p>
          </div>
        </TabsContent>
        <TabsContent value="important" className="mt-6">
          <div className="grid gap-4">
            <p className="text-center py-8 text-muted-foreground">
              Please select a patient to view their important clinical notes
            </p>
          </div>
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <ClinicalNoteCategoriesList />
        </TabsContent>
        <TabsContent value="templates" className="mt-6">
          <ClinicalNoteTemplatesList />
        </TabsContent>
      </Tabs>

      <CreateClinicalNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          router.refresh()
        }}
      />
    </div>
  )
}
