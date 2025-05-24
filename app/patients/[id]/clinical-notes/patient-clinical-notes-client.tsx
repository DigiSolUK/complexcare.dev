"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, ArrowLeft } from "lucide-react"
import { ClinicalNotesList } from "@/components/clinical-notes/clinical-notes-list"
import { CreateClinicalNoteDialog } from "@/components/clinical-notes/create-clinical-note-dialog"

interface PatientClinicalNotesClientProps {
  patientId: string
  patientName: string
}

export default function PatientClinicalNotesClient({ patientId, patientName }: PatientClinicalNotesClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateNote = () => {
    setIsCreateDialogOpen(true)
  }

  const handleBackToPatient = () => {
    router.push(`/patients/${patientId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleBackToPatient}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Clinical Notes for {patientName}</h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
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
              {/* Categories would be fetched and mapped here */}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <ClinicalNotesList patientId={patientId} />
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <p className="text-center py-8 text-muted-foreground">Recent notes will be displayed here</p>
        </TabsContent>
        <TabsContent value="important" className="mt-6">
          <p className="text-center py-8 text-muted-foreground">Important notes will be displayed here</p>
        </TabsContent>
        <TabsContent value="follow-up" className="mt-6">
          <p className="text-center py-8 text-muted-foreground">Notes with follow-up dates will be displayed here</p>
        </TabsContent>
      </Tabs>

      <CreateClinicalNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        patientId={patientId}
        onSuccess={() => {
          router.refresh()
        }}
      />
    </div>
  )
}
