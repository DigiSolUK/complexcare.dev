"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { updateClinicalNote, type ClinicalNote, type ClinicalNoteCategory } from "@/lib/services/clinical-notes-service"

interface EditClinicalNoteDialogProps {
  note: ClinicalNote
  categories: ClinicalNoteCategory[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteUpdated: (note: ClinicalNote) => void
}

export default function EditClinicalNoteDialog({
  note,
  categories,
  open,
  onOpenChange,
  onNoteUpdated,
}: EditClinicalNoteDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    category_id: note.category_id || "",
    title: note.title,
    content: note.content,
    is_private: note.is_private,
    is_important: note.is_important,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedNote = await updateClinicalNote(note.id, formData)
      toast({
        title: "Note updated",
        description: "The clinical note has been updated successfully.",
      })
      onNoteUpdated(updatedNote)
    } catch (error: any) {
      console.error("Error updating note:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update the clinical note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Clinical Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select value={formData.category_id} onValueChange={(value) => handleSelectChange("category_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_private"
                checked={formData.is_private}
                onCheckedChange={(checked) => handleCheckboxChange("is_private", !!checked)}
              />
              <Label htmlFor="is_private">Private</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_important"
                checked={formData.is_important}
                onCheckedChange={(checked) => handleCheckboxChange("is_important", !!checked)}
              />
              <Label htmlFor="is_important">Important</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
