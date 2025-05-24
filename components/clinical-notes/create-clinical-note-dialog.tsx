"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import {
  type ClinicalNoteCategory,
  type ClinicalNoteTemplate,
  getClinicalNoteCategories,
  getClinicalNoteTemplates,
} from "@/lib/services/clinical-notes-service"
import { cn } from "@/lib/utils"

interface CreateClinicalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId?: string
  onSuccess?: () => void
}

export function CreateClinicalNoteDialog({ open, onOpenChange, patientId, onSuccess }: CreateClinicalNoteDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [templateId, setTemplateId] = useState<string>("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined)
  const [followUpNotes, setFollowUpNotes] = useState("")
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([])
  const [templates, setTemplates] = useState<ClinicalNoteTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [categoriesData, templatesData] = await Promise.all([
          getClinicalNoteCategories(),
          getClinicalNoteTemplates(),
        ])
        setCategories(categoriesData)
        setTemplates(templatesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  const handleTemplateChange = (templateId: string) => {
    setTemplateId(templateId)
    if (templateId) {
      const selectedTemplate = templates.find((t) => t.id === templateId)
      if (selectedTemplate) {
        setContent(selectedTemplate.content)
        if (selectedTemplate.category_id) {
          setCategoryId(selectedTemplate.category_id)
        }
      }
    }
  }

  const handleSubmit = async () => {
    if (!title || !content) {
      return
    }

    setIsSubmitting(true)
    try {
      // In a real implementation, you would get the user ID from the session
      const userId = "00000000-0000-0000-0000-000000000000" // Placeholder

      const response = await fetch("/api/clinical-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          title,
          content,
          category_id: categoryId || null,
          created_by: userId,
          is_private: isPrivate,
          is_important: isImportant,
          follow_up_date: followUpDate ? format(followUpDate, "yyyy-MM-dd") : null,
          follow_up_notes: followUpNotes || null,
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        resetForm()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        console.error("Failed to create clinical note:", await response.json())
      }
    } catch (error) {
      console.error("Error creating clinical note:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setCategoryId("")
    setTemplateId("")
    setIsPrivate(false)
    setIsImportant(false)
    setFollowUpDate(undefined)
    setFollowUpNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Clinical Note</DialogTitle>
          <DialogDescription>
            Add a new clinical note for the patient. Use templates to quickly create standardized notes.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template" className="text-right">
                Template
              </Label>
              <Select value={templateId} onValueChange={handleTemplateChange}>
                <SelectTrigger id="template" className="col-span-3">
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-template">No Template</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Enter note title"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-category">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3 min-h-[200px]"
                placeholder="Enter note content"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Options</div>
              <div className="col-span-3 flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPrivate"
                    checked={isPrivate}
                    onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                  />
                  <Label htmlFor="isPrivate">Private note (restricted access)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isImportant"
                    checked={isImportant}
                    onCheckedChange={(checked) => setIsImportant(checked as boolean)}
                  />
                  <Label htmlFor="isImportant">Mark as important</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="followUpDate" className="text-right">
                Follow-up Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !followUpDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {followUpDate ? format(followUpDate, "PPP") : "Select a date (optional)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={followUpDate} onSelect={setFollowUpDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {followUpDate && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="followUpNotes" className="text-right pt-2">
                  Follow-up Notes
                </Label>
                <Textarea
                  id="followUpNotes"
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter follow-up instructions or notes"
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !title || !content}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
