"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { ClinicalNoteCategory } from "@/lib/services/clinical-notes-service"

interface CreateClinicalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId?: string
  onSuccess?: () => void
}

export function CreateClinicalNoteDialog({ open, onOpenChange, patientId, onSuccess }: CreateClinicalNoteDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined)
  const [followUpNotes, setFollowUpNotes] = useState("")
  const [categories, setCategories] = useState<ClinicalNoteCategory[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (open) {
          const response = await fetch("/api/clinical-notes/categories")
          if (!response.ok) {
            throw new Error("Failed to fetch categories")
          }
          const categoriesData = await response.json()
          setCategories(categoriesData)
          if (categoriesData.length > 0) {
            setCategoryId(categoriesData[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    if (open) {
      fetchCategories()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!title.trim()) {
        throw new Error("Note title is required")
      }

      if (!content.trim()) {
        throw new Error("Note content is required")
      }

      if (!patientId) {
        throw new Error("Patient ID is required")
      }

      const response = await fetch("/api/clinical-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId,
          title,
          content,
          categoryId,
          createdBy: "current-user-id", // This should be replaced with the actual user ID
          isPrivate,
          isImportant,
          tags: [],
          followUpDate: followUpDate ? format(followUpDate, "yyyy-MM-dd") : null,
          followUpNotes: followUpNotes || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create note")
      }

      resetForm()
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating note:", error)
      setError(error instanceof Error ? error.message : "Failed to create note")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setCategoryId(categories.length > 0 ? categories[0].id : "")
    setIsPrivate(false)
    setIsImportant(false)
    setFollowUpDate(undefined)
    setFollowUpNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Clinical Note</DialogTitle>
          <DialogDescription>Add a new clinical note to the patient's record.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Clinical note content"
                rows={6}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
                <Label htmlFor="private">Private Note</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="important" checked={isImportant} onCheckedChange={setIsImportant} />
                <Label htmlFor="important">Mark as Important</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="followup">Follow-up Date (optional)</Label>
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
                    {followUpDate ? format(followUpDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={followUpDate} onSelect={setFollowUpDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {followUpDate && (
              <div className="grid gap-2">
                <Label htmlFor="followupNotes">Follow-up Notes</Label>
                <Textarea
                  id="followupNotes"
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Notes for follow-up"
                  rows={2}
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
