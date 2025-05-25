"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, ImageIcon, FileIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ClinicalNoteAttachmentUploadProps {
  clinicalNoteId: string
  onUploadComplete: (attachment: any) => void
}

export default function ClinicalNoteAttachmentUpload({
  clinicalNoteId,
  onUploadComplete,
}: ClinicalNoteAttachmentUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("clinicalNoteId", clinicalNoteId)

      const response = await fetch("/api/clinical-notes/attachments", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const attachment = await response.json()
      onUploadComplete(attachment)
      toast({
        title: "File uploaded",
        description: "The attachment has been uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload the attachment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (fileType.includes("pdf")) return <FileText className="h-4 w-4" />
    return <FileIcon className="h-4 w-4" />
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        isUploading && "pointer-events-none opacity-50",
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="sr-only"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        disabled={isUploading}
      />

      <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center justify-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-sm">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </div>
        <div className="text-xs text-muted-foreground">PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB)</div>
      </label>

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
          <div className="text-sm font-medium">Uploading...</div>
        </div>
      )}
    </div>
  )
}
