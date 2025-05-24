"use client"

import { useState, useEffect } from "react"
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
import { format, parseISO } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import {
  type ClinicalNote,
  type ClinicalNoteCategory,
  getClinicalNoteCategories,
} from "@/lib/services/clinical-notes-service"
import { cn } from "@/lib/utils"

interface EditClinicalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: ClinicalNote
  onSuccess?: () => void
}

export function EditClinicalNoteDialog({ open, onOpenChange, note, onSuccess }: EditClinicalNoteDialogProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [categoryId, setCategoryId] = useState<string>(note?.category_id || "")
  const [isPrivate, setIsPrivate] = useState(note?.is_private || false)
  const [isImportant, setIsImportant] = useState(note?.is_important || false)
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(
    note?.follow_up_date ? parseISO(note.follow_up_date) : undefined,
  )
  const [followUpNotes, setFollowUpNotes] = useState(note?.follow_up_notes || "")
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setCategoryId(note.category_id || "")
      setIsPrivate(note.is_private)
      setIsImportant(note.is_important)
      setFollowUpDate(note.follow_up_date ? parseISO(note.follow_up_date) : undefined)
      setFollowUpNotes(note.follow_up_notes || "")
    }
  }, [note])

  useEffect(() => {
    const fetchCategories = async () => {
      if (!open) return

      setIsLoading(true)
      try {
        const categoriesData = await getClinicalNoteCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [open])

  const handleSubmit = async () => {
    if (!title || !content || !note) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/clinical-notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category_id: categoryId || null,
          is_private: isPrivate,
          is_important: isImportant,
          follow_up_date: followUpDate ? format(followUpDate, "yyyy-MM-dd") : null,
          follow_up_notes: followUpNotes || null,
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        console.error("Failed to update clinical note:", await response.json())
      }
    } catch (error) {
      console.error("Error updating clinical note:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!note) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Clinical Note</DialogTitle>
          <DialogDescription>Update the clinical note information.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
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
                  <SelectItem value="none">No Category</SelectItem>
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
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
